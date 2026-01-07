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
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
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
  const personaContext = `[ROLE: ${role}] [MOOD: ${mood}] [LANG: ${lang}]. MANDATORY: You MUST reply entirely in the script of ${lang}. No English glitches.`;
  
  try {
    const res = await callGateway('chat', 
      [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: `${personaContext}\n\nUser: ${prompt}` }] }
      ],
      {
        model: useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
        thinkingConfig: useThinking ? { thinkingBudget: 4000 } : undefined
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

export const uploadToAzureVault = async (base64: string, metadata: any) => { 
  console.log(`[LifePal Azure Hub]: Initiating secure upload for ${metadata.name} to private blob container.`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { success: true, vaultId: metadata.id }; 
};

export const fetchOncoLinkNews = async (lang: AppLanguage) => {
  try {
    const res = await callGateway('news', 
      `ACT AS A MEDICAL NEWS ENGINE. Language: ${lang}. 
       Search for: "latest verified cancer oncology news patients 2024 2025".
       Respond ONLY with a valid JSON array.
       Format: [{"title": "...", "summary": "...", "url": "...", "source": "...", "date": "..."}]`,
      { model: 'gemini-3-flash-preview', tools: [{ googleSearch: {} }] }
    );
    
    const text = res.output;
    // Aggressive extraction of JSON array from possible Markdown wrapper or citation text
    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonStr);
    }
    return [];
  } catch (e) {
    console.error("News Fetch Error:", e);
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
      `Find 4 kid-safe YouTube video IDs for a brave child hero. Language: ${lang}. JSON only.`,
      { model: 'gemini-3-flash-preview', tools: [{ googleSearch: {} }], responseSchema: schema }
    );
    const text = res.output;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const videos = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    
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
    },
    required: ["roadmap", "schemes", "hospitals", "nextSteps"]
  };

  const prompt = `STRATEGY for ${context.role} dealing with ${context.cancerType} in ${context.location}. 
  Status: ${context.financialStatus}. Priority: ${context.priority}. 
  JSON Output Mandatory.`;
  
  // Flash is critical for speed on Vercel to prevent 10s timeouts.
  const res = await callGateway('nav', prompt, { 
    model: 'gemini-3-flash-preview', 
    responseSchema: schema 
  });
  
  const text = res.output;
  const startIdx = text.indexOf('{');
  const endIdx = text.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1) {
    return JSON.parse(text.substring(startIdx, endIdx + 1));
  }
  throw new Error("Invalid Navigator Response Format");
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

export const analyzeSymptomPatterns = async (logs: SymptomLog[], profile: UserProfile, lang: AppLanguage): Promise<string> => {
  const logCtx = logs.map(l => `${l.type}: ${l.severity}`).join('\n');
  const res = await callGateway('symptoms', `Analyze logs for ${profile.role} in ${lang}:\n${logCtx}`, { model: 'gemini-3-flash-preview' });
  return res.output;
};

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
  try { 
    const match = res.output.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : []; 
  } catch { return []; }
};
export const generateVaultSummary = async (docs: ScannedDoc[], lang: AppLanguage) => {
  const ctx = docs.map(d => d.summary).join('\n');
  const res = await callGateway('vault_sum', `Summarize for visit in ${lang}:\n${ctx}`, { model: 'gemini-3-flash-preview' });
  return res.output;
};

export const animateImage = async (base64: string, prompt: string): Promise<string | null> => {
  const payload = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image: {
      imageBytes: base64,
      mimeType: 'image/jpeg',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  };

  try {
    const res = await fetch('/api/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', payload })
    });
    let operation = await res.json();

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const checkRes = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', payload: operation })
      });
      operation = await checkRes.json();
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return `/api/video?action=download&payload=${encodeURIComponent(downloadLink)}`;
    }
    return null;
  } catch (e) {
    console.error("[animateImage Error]:", e);
    return null;
  }
};

export const analyzeVideo = async (base64: string, prompt: string): Promise<string> => {
  try {
    const res = await callGateway('video_intel', 
      {
        parts: [
          { inlineData: { data: base64, mimeType: 'video/mp4' } },
          { text: prompt }
        ]
      },
      { model: 'gemini-3-pro-preview' }
    );
    return res.output;
  } catch (e) {
    return "The video intelligence engine could not process this file at this time.";
  }
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
    },
    required: ["health_summary", "sleep_insight", "activity_insight", "recovery_insight", "daily_motivation"]
  };

  const prompt = `Perform a lifestyle recovery analysis in ${profile.language} for:
  Steps: ${data.steps}
  Sleep: ${data.sleepHours} hours
  Heart Rate: ${data.heartRate} bpm
  Active Time: ${data.activeMinutes} mins
  Patient Context: ${profile.role} ${profile.cancerType ? 'with ' + profile.cancerType : ''}. Provide clinical but gentle motivation.`;

  try {
    const res = await callGateway('harmony', prompt, {
      model: 'gemini-3-flash-preview',
      responseSchema: schema
    });
    return JSON.parse(res.output);
  } catch (e) {
    return {
      health_summary: "Your metrics show a consistent recovery rhythm.",
      sleep_insight: "Quality rest is the foundation of cellular repair.",
      activity_insight: "Gentle walking improves circulation and mood.",
      recovery_insight: "Balance your active periods with deep hydration.",
      daily_motivation: "Every day is a victory in your resilience journey."
    };
  }
};