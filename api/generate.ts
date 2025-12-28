
import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 60,
};

const LIFEPAL_SYSTEM_INSTRUCTION = `
You are the LifePal AI assistant, an expert in oncology care coordination and emotional support.
MANDATORY: You must respond in the language specified in the user context ([LANG: ...]).
If the language is Hindi, use clear and empathetic Devnagari script.
If the language is Urdu, use professional and caring Nastaliq-compatible text.
If the language is Telugu, use natural and comforting Telugu script.

Follow clinical guardrails: NEVER provide a diagnosis, NEVER change or suggest medication dosages, and ALWAYS prioritize the Aligarh (JNMCH) institutional protocols.
Maintain a gentle, sanctuary-like persona.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API_KEY missing' });

  const { feature, contents, config: modelConfig } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = modelConfig?.model || 'gemini-3-flash-preview';

    // The user context is prepended in the frontend's getGeminiResponse
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
