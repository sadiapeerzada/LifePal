
import { 
  AIStudio, UserRole, AppLanguage, EmotionalState, 
  CareContext, NavigationPlan, PatientAgeGroup, 
  UserProfile, ScannedDoc, MedicineScan, HarmonyMetric, 
  HarmonyInsight, ChildVideo, SymptomLog 
} from "../types";
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Removed redundant declare global for Window.aistudio to fix TS duplicate declaration errors.
// It is centrally declared in types.ts.

interface ResourceResult {
  text: string;
  links: { title: string; url: string }[];
}

const decodeRawPCM = async (
  base64Data: string,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const dataInt16 = new Int16Array(bytes.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const LIFEPAL_SYSTEM = "You are the LifePal AI assistant, a compassionate and expert clinical companion in oncology. Use clear language. NEVER diagnose. ALWAYS direct to JNMCH for medical decisions.";

export const ensureApiKey = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.aistudio) return true;
  const hasKey = await window.aistudio.hasSelectedApiKey();
  if (!hasKey) {
    await window.aistudio.openSelectKey();
    return true; 
  }
  return true;
};

export const getGeminiResponse = async (
  prompt: string,
  role: UserRole,
  ageGroup?: PatientAgeGroup,
  lang: AppLanguage = AppLanguage.ENGLISH,
  useThinking = false,
  mood?: EmotionalState,
  history: { role: 'user' | 'model', text: string }[] = []
): Promise<string> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
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
      return getGeminiResponse(prompt, role, ageGroup, lang, false, mood, history);
    }
    return "The sanctuary engine is temporarily offline. Please try again in a moment.";
  }
};

export const analyzeMedicineImage = async (base64: string, lang: AppLanguage): Promise<Partial<MedicineScan>> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: `Identify this medicine packaging. Language: ${lang}. Return ONLY valid JSON.` }
        ]
      },
      config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Med Scan Error:", e);
    return {};
  }
};

export const analyzeMedicalDocument = async (base64: string, lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: `Analyze this medical document for a patient in ${lang}. Explain terms simply. Return ONLY JSON.` }
        ]
      },
      config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { type: 'ERROR', summary: 'Analysis failed.', isVerified: false };
  }
};

export const fetchOncoLinkNews = async (lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 8 highly relevant, verified oncology news articles, clinical breakthroughs, and patient support guides in ${lang}. Ensure results cover diagnosis management and recovery. Output JSON only.`,
      config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};

export const fetchHeroCinemaVideos = async (lang: AppLanguage): Promise<ChildVideo[]> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 4 random, strictly kid-friendly YouTube video IDs from Pixar or National Geographic Kids. Language: ${lang}. Return ONLY JSON.`,
      config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: schema }
    });
    const videos = JSON.parse(response.text || "[]");
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

export const findNearbyResources = async (query: string, lat?: number, lng?: number): Promise<ResourceResult> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Find ${query} near Aligarh, India.`,
      config: {
        tools: [{ googleMaps: {} }],
        ...(lat && lng ? { toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } } : {})
      }
    });
    const rawLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => {
        if (chunk.maps?.uri) return { title: chunk.maps.title as string, url: chunk.maps.uri as string };
        return null;
      }) || [];
    
    const links = rawLinks.filter((item): item is { title: string; url: string } => item !== null);
    
    return { text: response.text || "No resources found.", links };
  } catch (e) {
    return { text: "Location search unavailable.", links: [] };
  }
};

export const generateSpeech = async (text: string, lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalalities: [Modality.AUDIO],
        speechConfig: { 
          voiceConfig: { 
            prebuiltVoiceConfig: { voiceName: lang === AppLanguage.HINDI ? 'Puck' : 'Zephyr' } 
          } 
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
  } catch (e) { return undefined; }
};

export const playAudio = async (base64: string) => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const buffer = await decodeRawPCM(base64, ctx);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
};

export const getCareNavigationPlan = async (context: CareContext, modelOverride?: string): Promise<NavigationPlan> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = modelOverride || 'gemini-3-pro-preview';
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      roadmap: { type: Type.STRING },
      schemes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, url: { type: Type.STRING }, reason: { type: Type.STRING }, description: { type: Type.STRING } } } },
      hospitals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, location: { type: Type.STRING } } } },
      nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["roadmap", "schemes", "hospitals", "nextSteps"]
  };

  const prompt = `As a Senior Clinical Oncology Coordinator at JNMCH Aligarh, build a precision care roadmap for a ${context.role} managing ${context.cancerType} in ${context.location}. Primary hub focus: JNMCH Aligarh (AMU). Include Ayushman Bharat and Alig Care Foundation. Return строго JSON.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
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

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = (size === "2K" || size === "4K") ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
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
  } catch (e) {
    return undefined;
  }
};

export const animateImage = async (base64: string, prompt: string): Promise<string | null> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Gently animate this image.',
      image: { imageBytes: base64, mimeType: 'image/jpeg' },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
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

export const analyzeVideo = async (base64: string, prompt: string): Promise<string> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
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
    return response.text || "No insights.";
  } catch (e) { return "Error."; }
};

export const analyzeHarmonyData = async (data: HarmonyMetric, profile: UserProfile): Promise<HarmonyInsight> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze health metrics for a ${profile.role} with ${profile.cancerType || 'oncology journey'}. Data: ${data.steps} steps, ${data.sleepHours}h sleep. JSON only.`,
      config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { health_summary: "Keep moving forward.", sleep_insight: "Rest is vital.", activity_insight: "Walk daily.", recovery_insight: "Hydrate.", daily_motivation: "Stay brave." };
  }
};

export const analyzeSymptomPatterns = async (logs: SymptomLog[], profile: UserProfile, lang: AppLanguage): Promise<string> => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const logCtx = logs.map(l => `[${new Date(l.date).toLocaleDateString()}] ${l.type}, Severity: ${l.severity}/10`).join('\n');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these logs for ${profile.role} in ${lang}:\n${logCtx}`,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "Continue tracking for deeper patterns.";
  } catch (e) { return "Pattern engine offline."; }
};

export const uploadToAzureVault = async (_b: string, _m: any) => { return; };
export const getClinicalTutorial = async (title: string, lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Detailed tutorial for ${title} in ${lang}. Step by step guide for home care.` });
  return res.text || "";
};
export const getSimplifiedExplanation = async (ctx: string, role: UserRole, lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Explain this to a ${role} in simple ${lang}: ${ctx}` });
  return res.text || "";
};
export const getFollowupQuestions = async (status: string, lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Based on status: ${status}, suggest 5 follow-up questions for oncology team in ${lang}. JSON array of strings only.` });
  try { return JSON.parse(res.text || "[]"); } catch { return []; }
};
export const generateVaultSummary = async (docs: ScannedDoc[], lang: AppLanguage) => {
  // Use API key directly from process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const summaryCtx = docs.map(d => `${d.name}: ${d.summary}`).join('\n');
  const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Summarize these medical documents for an oncology visit brief in ${lang}:\n${summaryCtx}` });
  return res.text || "";
};
