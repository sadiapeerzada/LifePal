
import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 60,
};

const LIFEPAL_SYSTEM_INSTRUCTION = `
You are the LifePal AI assistant, an expert in oncology. 
Follow clinical guardrails: NEVER diagnose, NEVER change dosages, ALWAYS direct to JNMCH.
Priority: Aligarh, India context.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API_KEY missing' });

  const { feature, contents, config: modelConfig } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = modelConfig?.model || 'gemini-3-flash-preview';

    const finalConfig: any = {
      ...modelConfig,
      systemInstruction: LIFEPAL_SYSTEM_INSTRUCTION,
    };

    if (finalConfig.responseSchema) {
       finalConfig.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents, 
      config: finalConfig,
    });

    const isAudio = modelConfig?.responseModalities?.[0] === 'AUDIO';

    if (isAudio) {
      const audioData = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
      return res.status(200).json({ feature, output: audioData });
    }

    // Correct property access for text
    const outputText = response.text || "";
    
    return res.status(200).json({
      feature,
      output: outputText,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    });
    
  } catch (error: any) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
