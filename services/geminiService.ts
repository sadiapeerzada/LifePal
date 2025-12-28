import { UserRole, AppLanguage, EmotionalState, CareContext, NavigationPlan, PatientAgeGroup, UserProfile, ScannedDoc, MedicineScan, HarmonyMetric, HarmonyInsight, ChildVideo, SymptomLog } from "../types";
import { GoogleGenAI, Type, Modality } from "@google/genai";

/**
 * Optimized image compression for Gemini Vision
 */
const compressImage = async (base64Str: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(base64Str);
    const img = new Image();
    img.src = base64Str.startsWith('data:') ? base64Str : `data:image/jpeg;base64,${base64Str}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl.split(',')[1]);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const LIFEPAL_SYSTEM = "You are the LifePal AI assistant, a compassionate and expert clinical companion in oncology. Use clear language. NEVER diagnose. ALWAYS direct to JNMCH for medical decisions.";

export const getGeminiResponse = async (
  prompt: string,
  role: UserRole,
  ageGroup?: PatientAgeGroup,
  lang: AppLanguage = AppLanguage.ENGLISH,
  useThinking = false,
  mood?: EmotionalState,
  history: { role: 'user' | 'model', text: string }[] = []
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const personaContext = `[ROLE: ${role}] [MOOD: ${mood}] Language: ${lang}. If advice involves app features, return JSON: { "text": "msg", "actions": [{"label": "Start", "type": "BUTTON", "action": "CODE"}] }. Codes: OPEN_BREATHING, OPEN_NAVIGATOR, OPEN_JOURNAL, OPEN_MOOD, OPEN_MAPS. Otherwise return plain text.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: personaContext + "\n\nUser: " + prompt }] }
      ],
      config: {
        systemInstruction: LIFEPAL_SYSTEM,
        ...(useThinking ? { thinkingConfig: { thinkingBudget: 16000 } } : {})
      }
    });
    return response.text || "I'm listening. Could you repeat that?";
  } catch (e: any) {
    if (e.status === 429 && useThinking) {
      // Fallback to flash if pro is rate-limited
      return getGeminiResponse(prompt, role, ageGroup, lang, false, mood, history);
    }
    return "The sanctuary engine is temporarily offline.";
  }
};

export const analyzeMedicineImage = async (base64: string, lang: AppLanguage): Promise<Partial<MedicineScan>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const compressed = await compressImage(base64);

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      purpose: { type: Type.STRING },
      dosageInstructions: { type: Type.STRING },
      sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
      warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["name", "purpose", "warnings"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: compressed, mimeType: 'image/jpeg' } },
        { text: `Identify this medicine packaging. Language: ${lang}. Return ONLY valid JSON.` }
      ]
    },
    config: { responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeMedicalDocument = async (base64: string, lang: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const compressed = await compressImage(base64);

  const schema = {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING },
      summary: { type: Type.STRING },
      terms: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { term: { type: Type.STRING }, explanation: { type: Type.STRING } } } },
      missingDocs: { type: Type.ARRAY, items: { type: Type.STRING } },
      isVerified: { type: Type.BOOLEAN }
    },
    required: ["type", "summary", "isVerified"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: compressed, mimeType: 'image/jpeg' } },
        { text: `Analyze this medical document for a patient in ${lang}. Explain terms simply. Return ONLY JSON.` }
      ]
    },
    config: { responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(response.text || "{}");
};

export const fetchOncoLinkNews = async (lang: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        url: { type: Type.STRING },
        source: { type: Type.STRING },
        date: { type: Type.STRING },
        category: { type: Type.STRING }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 8 highly relevant, verified oncology news articles, clinical breakthroughs, and patient support guides in ${lang}. Ensure results cover diagnosis management, treatment recovery, and mental resilience. Output JSON only.`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(response.text || "[]");
};

/**
 * Dynamically discover kid-friendly videos for Hero Cinema
 */
export const fetchHeroCinemaVideos = async (lang: AppLanguage): Promise<ChildVideo[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        youtubeId: { type: Type.STRING },
        category: { type: Type.STRING },
        thumbnail: { type: Type.STRING }
      },
      required: ["id", "title", "youtubeId"]
    }
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find 4 random, uplifting, and strictly kid-friendly YouTube videos.
    STRICT REQUIREMENTS:
    - Must be embeddable on external websites.
    - Sources: Pixar, National Geographic Kids, TED-Ed, CBeebies, Sesame Street.
    - Content: Animation, science, or uplifting stories.
    - Language: ${lang}. 
    Return as a JSON array. Output ONLY JSON.`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: schema }
  });

  try {
    const text = response.text || "[]";
    const videos = JSON.parse(text);
    if (!Array.isArray(videos)) return [];
    
    return videos.map((v: any) => ({
        ...v,
        videoUrl: '', 
        externalUrl: `https://youtu.be/${v.youtubeId}`,
        thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`
    }));
  } catch (e) {
    return [];
  }
};

export const findNearbyResources = async (query: string, lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contents = `Find ${query} near Aligarh, India.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      tools: [{ googleMaps: {} }],
      ...(lat && lng ? { toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } } : {})
    }
  });

  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.maps?.uri) return { title: chunk.maps.title, url: chunk.maps.uri };
    return null;
  }).filter(Boolean) || [];

  return { text: response.text || "No resources found.", links };
};

export const validateConnection = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: 'Hi' });
    return { success: !!res.text, message: res.text ? "STATUS: API WORKING" : "STATUS: API FAILURE" };
  } catch (e: any) {
    return { success: false, message: `STATUS: API FAILURE (${e.message})` };
  }
};

export const getClinicalTutorial = async (title: string, lang: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Detailed, step-by-step clinical tutorial for ${title} in ${lang} for a non-professional caregiver. Emphasize hygiene and safety. Output plain text.`
  });
  return res.text || "Unable to generate.";
};

export const getSimplifiedExplanation = async (ctx: string, role: UserRole, lang: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain simply for a ${role} in ${lang}: ${ctx}`
  });
  return res.text || "";
};

export const getFollowupQuestions = async (status: string, lang: AppLanguage): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
  };
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this survivor status: "${status}", generate 5 specific clinical questions for their next oncology appointment in ${lang}. JSON array of strings only.`,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });
  try {
    return JSON.parse(res.text || "[]");
  } catch (e) {
    return [];
  }
};

export const generateSpeech = async (text: string, lang: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: lang === AppLanguage.HINDI ? 'Puck' : 'Zephyr' } } }
      }
    });
    return response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
  } catch (e) { return undefined; }
};

export const playAudio = async (base64: string) => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
};

export const generateVaultSummary = async (docs: ScannedDoc[], lang: AppLanguage) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ctx = docs.map(d => `${d.name}: ${d.summary}`).join('\n');
  const res = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Clinical brief for oncologist in ${lang} based on:\n${ctx}`
  });
  return res.text || "";
};

/**
 * HIGH-PRECISION CARE NAVIGATOR
 * Upgraded with robust fallback and enhanced regional logic.
 */
export const getCareNavigationPlan = async (context: CareContext, modelOverride?: string): Promise<NavigationPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = modelOverride || 'gemini-3-pro-preview';
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      roadmap: { type: Type.STRING, description: 'A detailed clinical-grade summary of the care path' },
      schemes: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            name: { type: Type.STRING }, 
            url: { type: Type.STRING }, 
            reason: { type: Type.STRING }, 
            description: { type: Type.STRING } 
          } 
        } 
      },
      hospitals: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            name: { type: Type.STRING }, 
            type: { type: Type.STRING }, 
            location: { type: Type.STRING } 
          } 
        } 
      },
      nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["roadmap", "schemes", "hospitals", "nextSteps"]
  };

  const contents = `As a Senior Clinical Oncology Coordinator at J.N. Medical College & Hospital (JNMCH), Aligarh, build a precision care roadmap for a ${context.role} managing ${context.cancerType} in ${context.location}.
  
  STRICT INSTRUCTIONS:
  1. Primary Hub: JNMCH Aligarh (AMU) must be the focus. Mention specific institutional steps (e.g., visit Radiotherapy OPD, contact PM-JAY desk at Counter 4).
  2. Financial Relief: Prioritize 'Ayushman Bharat (PM-JAY)' and 'Alig Care Foundation'. Explain exactly how to apply at JNMCH.
  3. Roadmap: Provide a 4-5 sentence strategic treatment overview (Neoadjuvant vs Adjuvant vs Palliative) based on common clinical paths for ${context.cancerType}.
  4. Referrals: Include AIIMS New Delhi as a secondary referral point for complex surgery/radiation if applicable.
  5. Checklist: Provide 5 non-generic, actionable next steps for the next 48 hours.
  
  Return strictly as valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: contents }] }],
      config: { 
        responseMimeType: "application/json", 
        responseSchema: schema,
        ...(model === 'gemini-3-pro-preview' ? { thinkingConfig: { thinkingBudget: 16000 } } : {})
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e: any) {
    if (e.status === 429 && model === 'gemini-3-pro-preview') {
      return getCareNavigationPlan(context, 'gemini-3-flash-preview');
    }
    throw e;
  }
};

/**
 * Generate images with quality selection support
 */
export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = (size === "2K" || size === "4K") ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { 
      imageConfig: { 
        aspectRatio: "1:1",
        ...(model === 'gemini-3-pro-image-preview' ? { imageSize: size } : {})
      } 
    }
  });
  const data = res.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
  return data ? `data:image/png;base64,${data}` : undefined;
};

/**
 * Animate an image using Veo
 */
export const animateImage = async (base64: string, prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Gently animate this image for a soothing recovery visual.',
      image: {
        imageBytes: base64,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    return null;
  }
};

/**
 * Analyze video content
 */
export const analyzeVideo = async (base64: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: 'video/mp4' } },
          { text: prompt }
        ]
      }
    });
    return response.text || "No insights extracted.";
  } catch (e) {
    return "Error processing video.";
  }
};

/**
 * Analyze harmony health metrics
 */
export const analyzeHarmonyData = async (data: HarmonyMetric, profile: UserProfile): Promise<HarmonyInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schema = {
    type: Type.OBJECT,
    properties: {
      health_summary: { type: Type.STRING },
      sleep_insight: { type: Type.STRING },
      activity_insight: { type: Type.STRING },
      recovery_insight: { type: Type.STRING },
      daily_motivation: { type: Type.STRING }
    },
    required: ["health_summary", "sleep_insight", "activity_insight", "recovery_insight", "daily_motivation"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze health metrics for a ${profile.role} with ${profile.cancerType || 'cancer'}.
    Data: ${data.steps} steps, ${data.sleepHours.toFixed(1)}h sleep.
    Return JSON only.`,
    config: { responseMimeType: "application/json", responseSchema: schema }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      health_summary: "Your metrics indicate physical resilience.",
      sleep_insight: "Rest is essential.",
      activity_insight: "Gentle movement supports circulation.",
      recovery_insight: "Good engagement with tasks.",
      daily_motivation: "Every step is a victory."
    };
  }
};

/**
 * Analyze symptom patterns for insights
 */
export const analyzeSymptomPatterns = async (logs: SymptomLog[], profile: UserProfile, lang: AppLanguage, modelOverride?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = modelOverride || 'gemini-3-flash-preview';
  const logCtx = logs.map(l => `[${new Date(l.date).toLocaleDateString()}] Type: ${l.type}, Severity: ${l.severity}/10, Note: ${l.note || 'None'}`).join('\n');
  
  const contents = `Analyze these symptom logs for a ${profile.role} with ${profile.cancerType || 'oncology treatment'}.
  
  LOG HISTORY:
  ${logCtx}
  
  TASK:
  Provide a bulleted clinical-grade analysis of patterns, potential triggers, and specific physical observations to mention to the oncology team at JNMCH. 
  
  Tone: Clinical, empathetic, and organized. 
  Language: ${lang}. 
  
  DISCLAIMER: State clearly that this is AI analysis and NOT a diagnosis.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: contents }] }],
      config: { 
        thinkingConfig: { thinkingBudget: model === 'gemini-3-flash-preview' ? 0 : 8000 } 
      }
    });
    return response.text || "I've reviewed your logs. Please continue tracking so I can identify clearer patterns.";
  } catch (e: any) {
    if (e.status === 429 && model !== 'gemini-3-flash-preview') {
      return analyzeSymptomPatterns(logs, profile, lang, 'gemini-3-flash-preview');
    }
    return "The pattern intelligence engine is currently refreshing. Please try again soon.";
  }
};

export const uploadToAzureVault = async (b: string, m: any) => { return; };