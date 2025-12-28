import { GoogleGenAI } from "@google/genai";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  // Fix: Handle GET requests for proxied video downloads
  if (req.method === 'GET') {
    const { action, payload } = req.query;
    if (action === 'download' && typeof payload === 'string') {
      try {
        const downloadResponse = await fetch(`${payload}&key=${process.env.API_KEY}`);
        if (!downloadResponse.ok) {
          console.error(`Failed to download from source: ${downloadResponse.statusText}`);
          return res.status(downloadResponse.status).json({ error: 'Failed to download video from source.' });
        }
        const arrayBuffer = await downloadResponse.arrayBuffer();
        res.setHeader('Content-Type', 'video/mp4');
        return res.send(new Uint8Array(arrayBuffer));
      } catch (error: any) {
        console.error("[Gemini Video Download GET Error]:", error);
        return res.status(500).json({ error: 'Video download failed', details: error.message });
      }
    }
    return res.status(400).json({ error: 'Invalid GET request' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  // Initialize GoogleGenAI directly with process.env.API_KEY as per coding guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    switch (action) {
      case 'start':
        const operation = await ai.models.generateVideos(payload);
        return res.status(200).json(operation);
      
      case 'check':
        const status = await ai.operations.getVideosOperation({ operation: payload });
        return res.status(200).json(status);

      case 'download':
        // Proxy the download to include the API Key securely.
        // We append the API key to the URI as required for video downloads.
        const downloadResponse = await fetch(`${payload}&key=${process.env.API_KEY}`);
        const arrayBuffer = await downloadResponse.arrayBuffer();
        res.setHeader('Content-Type', 'video/mp4');
        
        // Fix for "Cannot find name 'Buffer'": Using Uint8Array instead of Buffer.
        // Also renamed the variable to 'arrayBuffer' to avoid any shadowing confusion with the Buffer class.
        return res.send(new Uint8Array(arrayBuffer));

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error("[Gemini Video Error]:", error);
    return res.status(500).json({ error: 'Video operation failed', details: error.message });
  }
}
