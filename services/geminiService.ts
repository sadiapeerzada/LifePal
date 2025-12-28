
import { 
  UserRole, AppLanguage, EmotionalState, 
  CareContext, NavigationPlan, PatientAgeGroup, 
  UserProfile, ScannedDoc, MedicineScan, HarmonyMetric, 
  HarmonyInsight, ChildVideo, SymptomLog 
} from "../types";

interface ResourceResult {
  text: string;
  links: { title: string; url: string }[];
}

const callGateway = async (feature: string, contents: any, config: any = {}) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature, contents, config })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Gateway Error');
  }
  return response.json();
};

export const ensureApiKey = async (): Promise<boolean> => {
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
  // Enhanced prompt context to force language compliance
  const personaContext = `[ROLE: ${role}] [MOOD: ${mood}] [LANG: ${lang}]. MANDATORY: You MUST reply entirely in the script of ${lang}. No English glitches.`;
  
  try {
    const res = await callGateway('chat', 
      [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: `${personaContext}\n\nUser: ${prompt}` }] }
      ],
      {
        model: useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
        thinkingConfig: useThinking ? { thinkingBudget: 16000 } : undefined
      }
    );
    return res.output;
  } catch (e) {
    return "The sanctuary engine is temporarily offline.";
  }
};

export const analyzeMedicineImage = async (base64: string, lang: AppLanguage): Promise<any> => {
  const schema = {
    type: "OBJECT",
    properties: {
      name: { type: "STRING" },
      purpose: { type: "STRING" },
      composition: { type: "STRING" },
      dosageInstructions: { type: "STRING" },
      interactions: { type: "ARRAY", items: { type: "STRING" } },
      sideEffects: { type: "ARRAY", items: { type: "STRING" } },
      warnings: { type: "ARRAY", items: { type: "STRING" } },
      storage: { type: "STRING" }
    },
    required: ["name", "purpose", "warnings", "composition"]
  };

  try {
    const res = await callGateway('med_scan', 
      {
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: `Identify medicine in ${lang}. Provide clinical analysis (composition, interactions). JSON.` }
        ]
      },
      { model: 'gemini-3-flash-preview', responseSchema: schema }
    );
    return JSON.parse(res.output);
  } catch (e) {
    return {};
  }
};

export const analyzeMedicalDocument = async (base64: string, lang: AppLanguage) => {
  const schema = {
    type: "OBJECT",
    properties: {
      type: { type: "STRING" },
      summary: { type: "STRING" },
      terms: { type: "ARRAY", items: { type: "OBJECT", properties: { term: { type: "STRING" }, explanation: { type: "STRING" } } } },
      missingDocs: { type: "ARRAY", items: { type: "STRING" } },
      isVerified: { type: "BOOLEAN" }
    },
    required: ["type", "summary", "isVerified"]
  };

  try {
    const res = await callGateway('doc_intel', 
      {
        parts: [
          { inlineData: { data: base64, mimeType: 'image/jpeg' } },
          { text: `Analyze report in ${lang}. JSON.` }
        ]
      },
      { model: 'gemini-3-flash-preview', responseSchema: schema }
    );
    return JSON.parse(res.output);
  } catch (e) {
    return { type: 'ERROR', summary: 'Analysis failed.', isVerified: false };
  }
};

export const fetchOncoLinkNews = async (lang: AppLanguage) => {
  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        summary: { type: "STRING" },
        url: { type: "STRING" },
        source: { type: "STRING" },
        date: { type: "STRING" },
        category: { type: "STRING" }
      }
    }
  };

  try {
    const res = await callGateway('news', 
      `Find oncology news in ${lang}. JSON only.`,
      { model: 'gemini-3-flash-preview', tools: [{ googleSearch: {} }], responseSchema: schema }
    );
    return JSON.parse(res.output);
  } catch (e) {
    return [];
  }
};

export const fetchHeroCinemaVideos = async (lang: AppLanguage): Promise<ChildVideo[]> => {
  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        id: { type: "STRING" },
        title: { type: "STRING" },
        description: { type: "STRING" },
        youtubeId: { type: "STRING" },
        category: { type: "STRING" }
      },
      required: ["id", "title", "youtubeId"]
    }
  };

  try {
    const res = await callGateway('videos', 
      `Find 4 kid-safe YouTube video IDs. Language: ${lang}. JSON only.`,
      { model: 'gemini-3-flash-preview', tools: [{ googleSearch: {} }], responseSchema: schema }
    );
    const videos = JSON.parse(res.output);
    return videos.map((v: any) => ({
      ...v,
      videoUrl: '',
      externalUrl: `https://youtu.be/${v.youtubeId}`,
      thumbnail: `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`
    }));
  } catch (e) {
    return [];
  }
};

export const findNearbyResources = async (query: string, lat?: number, lng?: number): Promise<ResourceResult> => {
  try {
    const res = await callGateway('maps', 
      `Find ${query} near Aligarh, India.`,
      { 
        model: 'gemini-2.5-flash', 
        tools: [{ googleMaps: {} }],
        toolConfig: lat && lng ? { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } : undefined
      }
    );
    
    const links = res.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.maps?.uri)
      .map((chunk: any) => ({ title: chunk.maps.title, url: chunk.maps.uri })) || [];
    
    return { text: res.output, links };
  } catch (e) {
    return { text: "Location search unavailable.", links: [] };
  }
};

export const generateSpeech = async (text: string, lang: AppLanguage) => {
  try {
    const res = await callGateway('tts', text, {
      model: "gemini-2.5-flash-preview-tts",
      responseModalities: ["AUDIO"],
      speechConfig: { 
        voiceConfig: { 
          prebuiltVoiceConfig: { voiceName: lang === AppLanguage.HINDI ? 'Puck' : 'Zephyr' } 
        } 
      }
    });
    return res.output;
  } catch (e) { return undefined; }
};

export const playAudio = async (base64: string) => {
  const decodeRawPCM = async (data: string, ctx: AudioContext) => {
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const int16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, int16.length, 24000);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < int16.length; i++) channel[i] = int16[i] / 32768.0;
    return buffer;
  };

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const buffer = await decodeRawPCM(base64, ctx);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  src.start();
};

export const getCareNavigationPlan = async (context: CareContext): Promise<NavigationPlan> => {
  const schema = {
    type: "OBJECT",
    properties: {
      roadmap: { type: "STRING" },
      schemes: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, url: { type: "STRING" }, reason: { type: "STRING" }, description: { type: "STRING" } } } },
      hospitals: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, type: { type: "STRING" }, location: { type: "STRING" } } } },
      nextSteps: { type: "ARRAY", items: { type: "STRING" } }
    }
  };

  const prompt = `Build oncology roadmap for ${context.role} in ${context.location}. JSON output.`;
  const res = await callGateway('nav', prompt, { model: 'gemini-3-pro-preview', responseSchema: schema, thinkingConfig: { thinkingBudget: 16000 } });
  return JSON.parse(res.output);
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  try {
    const model = (size === "2K" || size === "4K") ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const res = await callGateway('image', prompt, {
      model,
      imageConfig: { aspectRatio: "1:1", imageSize: size === "1K" ? undefined : size }
    });
    return `data:image/png;base64,${res.output}`;
  } catch (e) { return undefined; }
};

export const animateImage = async (base64: string, prompt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        payload: {
          model: 'veo-3.1-fast-generate-preview',
          prompt: prompt || 'Gently animate this.',
          image: { imageBytes: base64, mimeType: 'image/jpeg' },
          config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        }
      })
    });
    let op = await response.json();
    while (!op.done) {
      await new Promise(r => setTimeout(r, 10000));
      const check = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', payload: op })
      });
      op = await check.json();
    }
    const uri = op.response?.generatedVideos?.[0]?.video?.uri;
    const vidRes = await fetch(`/api/video?action=download&payload=${encodeURIComponent(uri)}`);
    const blob = await vidRes.blob();
    return URL.createObjectURL(blob);
  } catch (e) { return null; }
};

export const analyzeVideo = async (base64: string, prompt: string): Promise<string> => {
  const res = await callGateway('video_intel', {
    parts: [{ inlineData: { data: base64, mimeType: 'video/mp4' } }, { text: prompt }]
  }, { model: 'gemini-3-flash-preview' });
  return res.output;
};

export const analyzeHarmonyData = async (data: HarmonyMetric, profile: UserProfile): Promise<HarmonyInsight> => {
  const schema = {
    type: "OBJECT",
    properties: {
      health_summary: { type: "STRING" },
      sleep_insight: { type: "STRING" },
      activity_insight: { type: "STRING" },
      recovery_insight: { type: "STRING" },
      daily_motivation: { type: "STRING" }
    }
  };
  const res = await callGateway('harmony', `Analyze health metrics for ${profile.role}. JSON only.`, { model: 'gemini-3-flash-preview', responseSchema: schema });
  return JSON.parse(res.output);
};

export const analyzeSymptomPatterns = async (logs: SymptomLog[], profile: UserProfile, lang: AppLanguage): Promise<string> => {
  const logCtx = logs.map(l => `${l.type}: ${l.severity}`).join('\n');
  const res = await callGateway('symptoms', `Analyze logs for ${profile.role} in ${lang}:\n${logCtx}`, { model: 'gemini-3-flash-preview' });
  return res.output;
};

export const uploadToAzureVault = async (_b: string, _m: any) => { return; };
export const getClinicalTutorial = async (title: string, lang: AppLanguage) => {
  const res = await callGateway('tutorial', `Tutorial for ${title} in ${lang}.`, { model: 'gemini-3-flash-preview' });
  return res.output;
};
export const getSimplifiedExplanation = async (ctx: string, role: UserRole, lang: AppLanguage) => {
  const res = await callGateway('explain', `Explain for ${role} in ${lang}: ${ctx}`, { model: 'gemini-3-flash-preview' });
  return res.output;
};
export const getFollowupQuestions = async (status: string, lang: AppLanguage) => {
  const res = await callGateway('questions', `Questions for ${status} in ${lang}. JSON array of strings.`, { model: 'gemini-3-flash-preview' });
  try { return JSON.parse(res.output); } catch { return []; }
};
export const generateVaultSummary = async (docs: ScannedDoc[], lang: AppLanguage) => {
  const ctx = docs.map(d => d.summary).join('\n');
  const res = await callGateway('vault_sum', `Summarize for visit in ${lang}:\n${ctx}`, { model: 'gemini-3-flash-preview' });
  return res.output;
};
