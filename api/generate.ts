
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  maxDuration: 60,
};

const LIFEPAL_SYSTEM_INSTRUCTION = `
You are the LifePal AI assistant, a compassionate and expert clinical companion in oncology.

Core Identity & Tone:
- You are grounded, empathetic, and resilient. You speak with the warmth of a caregiver and the precision of a senior nurse.
- Use simple, clear language. Explain medical jargon using accessible analogies (e.g., "White blood cells are your body's security guards").

Clinical Expertise Requirements:
- You are knowledgeable about specific cancer types (e.g., Carcinoma, Sarcoma, Lymphoma, Leukemia, Glioblastoma) and subtypes.
- You understand detailed treatment phases: Neoadjuvant (shrinking tumor before surgery), Adjuvant (cleaning up after), Palliative (symptom management), and Maintenance.
- When asked about specific drugs (e.g., Cisplatin, Doxorubicin, Pembrolizumab), explain their general purpose and common management strategies for side effects (nausea, neuropathy, fatigue).

Safety Guardrails (CRITICAL):
- NEVER provide a specific medical diagnosis based on symptoms.
- NEVER suggest changing a prescription dosage.
- ALWAYS direct users to their specific oncology team at JNMCH or their local hospital for medical decisions.
- If a user mentions severe symptoms (chest pain, high fever during chemo, uncontrolled bleeding), IMMEDIATELY advise Emergency care.

Regional Context:
- When performing searches or giving advice, prioritize protocols relevant to India/Aligarh (JNMCH) where applicable.
- Response format MUST be JSON ONLY if requested or implied by the prompt structure, otherwise use plain text.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable is missing.");
    return res.status(500).json({ error: 'Internal server configuration error.' });
  }

  const { feature, contents, config: modelConfig } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Default to Flash for speed and reliability unless overridden
    const modelName = modelConfig?.model || 'gemini-3-flash-preview';

    // Construct final config. 
    const finalConfig: any = {
      ...modelConfig,
      systemInstruction: LIFEPAL_SYSTEM_INSTRUCTION,
    };

    // If schema is provided, enforce JSON. If it's an AUDIO response, do not enforce JSON schema.
    const isAudio = modelConfig?.responseModalities?.[0] === 'AUDIO';

    if (!finalConfig.responseSchema && !isAudio) {
       // Optional: we can enforce a default schema wrapper if desired, but for general chat it might be restrictive.
       // For specific tools like Med Scanner, the frontend sends a schema.
       // Let's stick to what was sent.
    } else if (finalConfig.responseSchema) {
       finalConfig.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents, 
      config: finalConfig,
    });

    // Handle Audio Response
    if (isAudio) {
      const audioData = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
      if (!audioData) {
          throw new Error("No audio data returned from model.");
      }
      return res.status(200).json({ feature, output: audioData });
    }

    // Handle Text/JSON Response
    let outputText = response.text || "{}";
    
    // --- ROBUST JSON EXTRACTION ---
    // Try to extract JSON if present, but handle plain text gracefully
    const jsonStart = outputText.indexOf('{');
    const jsonEnd = outputText.lastIndexOf('}');
    const arrayStart = outputText.indexOf('[');
    const arrayEnd = outputText.lastIndexOf(']');

    let cleanedJson = outputText;

    if (jsonStart !== -1 && jsonEnd !== -1 && (arrayStart === -1 || jsonStart < arrayStart)) {
        cleanedJson = outputText.substring(jsonStart, jsonEnd + 1);
    } else if (arrayStart !== -1 && arrayEnd !== -1) {
        cleanedJson = outputText.substring(arrayStart, arrayEnd + 1);
    }

    try {
      const result = JSON.parse(cleanedJson);
      
      // If the model followed the default wrapper schema (rarely used now but supported)
      if (result.feature || result.output) {
        return res.status(200).json({
          feature: result.feature || feature,
          output: result.output || "No relevant insights found.",
          groundingMetadata: response.candidates?.[0]?.groundingMetadata
        });
      }

      // If the model followed a custom schema (direct object), stringify it as 'output'
      return res.status(200).json({
        feature: feature,
        output: JSON.stringify(result),
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
      });

    } catch (parseError) {
      // Not JSON, return as plain text in output
      return res.status(200).json({
        feature: feature,
        output: outputText,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
      });
    }
    
  } catch (error: any) {
    console.error("[LifePal AI Gateway Error]:", error);
    const status = error.status || 500;
    const message = status === 429 ? "Quota exceeded. Please wait a moment." : "The intelligence engine is currently unavailable.";
    return res.status(status).json({ error: message, details: error.message });
  }
}
