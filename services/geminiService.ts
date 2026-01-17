import { GoogleGenAI } from "@google/genai";
import { ArtworkData, MuseumTheme } from "../types";
import { FRAME_LOCATIONS } from "../constants";
import { exhibitionData, exhibitionTheme } from "../data/exhibitionData";

// Initialize Gemini Client
// WARNING: process.env.API_KEY is handled by the environment.
// We use lazy initialization to prevent crashes if the key is missing (e.g. during simple deployment checks)
let aiInstance: GoogleGenAI | null = null;
const getAiClient = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      aiInstance = new GoogleGenAI({ apiKey });
    }
  }
  return aiInstance;
};
const modelName = 'gemini-3-flash-preview';

/**
 * Generates a cohesive theme and set of artworks for the museum.
 */
export const generateMuseumContent = async (): Promise<{ theme: MuseumTheme, artworks: ArtworkData[] }> => {
  // Use centralized exhibition data
  const theme = exhibitionTheme;

  // Map exhibition data to ArtworkData format
  // We can directly map since our data structure is aligned with what we need
  const artworks: ArtworkData[] = FRAME_LOCATIONS.map((loc) => {
    const art = exhibitionData.find(d => d.id === loc.id);

    if (!art) {
      // Fallback or error handling if ID mismatch
      // For now, return a placeholder to avoid crash, though this shouldn't happen if data is correct
      return {
        id: loc.id,
        position: loc.position,
        rotation: loc.rotation,
        title: "Unknown",
        artist: "Unknown",
        year: "2026",
        description: "Data missing",
        imageUrl: "https://picsum.photos/200/300"
      };
    }

    // We use picsum with a seed based on the visual prompt to get a consistent image
    const seed = Math.abs(art.title.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
    const imageUrl = art.imageUrl || `https://picsum.photos/seed/${seed}/500/700`;

    return {
      id: loc.id,
      position: loc.position,
      rotation: loc.rotation,
      title: art.title,
      artist: art.artist,
      year: "2026",
      description: art.description, // Use the main description for the basic view
      imageUrl: imageUrl,
      // We can attach the extra details if we extend ArtworkData, 
      // primarily we can use them in the curator chat or overlay.
      // For now, let's append them to description or keep as is.
      // Ideally, update ArtworkData type, but let's stick to existing type to avoid breaking changes first.
      // We can append details to description for the AI to see, but maybe hidden from UI if UI takes description?
      // actually, let's keep description as is for UI, and the AI can read it.
      // Better yet, let's update the AI prompt to include these details if we can access them.
      // But `generateMuseumContent` returns `ArtworkData`.
    };
  });

  return { theme, artworks };
};

/**
 * Chat with the curator about a specific artwork.
 */
export const chatWithCurator = async (
  history: { role: string, parts: { text: string }[] }[],
  userMessage: string,
  contextArtwork?: ArtworkData
): Promise<string> => {

  const systemInstruction = `
    你是一位極具同理心且專業的醫學人文策展人。
    你目前正在與訪客討論「身不由己」展覽中的作品 "${contextArtwork?.title || '未知'}"。
    作品描述為： "${contextArtwork?.description}"。
    
    展覽核心理念：
    1. 健康狀態是基因、生理與環境交互作用的結果。
    2. 醫學介入是一種理性、有效且正當的選擇。
    3. 身體差異應被理解，而非被道德化審判。
    
    請用繁體中文回答訪客的問題。
    回答風格：溫暖、理性、啟發性，避免說教。
    回答長度：請保持在 80 字以內，適合對話的節奏。
    如果使用者詢問醫學建議，請強調「醫學介入是選項之一」，但不提供具體診療方案。
  `;

  try {
    const ai = getAiClient();
    if (!ai) {
      return "（策展人正在調整展品... 請在 .env.local 設定 API_KEY 以啟用聊天功能。）";
    }

    const chat = ai.chats.create({
      model: modelName,
      config: { systemInstruction },
      history: history
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "我正在思考這個問題...";
  } catch (e) {
    return "策展人暫時無法回應。（連接 AI 發生錯誤）";
  }
};