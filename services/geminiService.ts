import { GoogleGenAI, Type } from "@google/genai";
import { ArtworkData, MuseumTheme } from "../types";
import { FRAME_LOCATIONS } from "../constants";

// Initialize Gemini Client
// WARNING: process.env.API_KEY is handled by the environment.
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
  // Hardcoded content for "Cheat Code Museum"
  const theme = {
    name: "作弊碼博物館 —— 歷史除罪化大展",
    description: "歡迎來到作弊碼博物館。在這裡，我們重新定義「作弊」：眼鏡是作弊的視力，抗生素是作弊的免疫力。減肥，也不該只有意志力。"
  };

  // Defined content matching FRAME_LOCATIONS order:
  // [ID 1, ID 2, ID 4, ID 6, ID 3, ID 5, ID 7]
  const rawArtworks = [
    // Index 0: ID 1 (End Wall) - Evolution Lab
    {
      title: "進化實驗室",
      artist: "未來系統",
      year: "即刻",
      description: "歡迎來到進化的下一站。在這裡，我們不再被動接受基因的安排。進行代謝檢測，獲取您的專屬進化處方。",
      visualPrompt: "futuristic laboratory portal neon blue"
    },
    // Index 1: ID 2 (Back Left) - Filler
    {
      title: "意志力的迷思",
      artist: "認知心理學",
      year: "N/A",
      description: "我們曾以為近視是看的書不夠多，感染是祈禱不夠虔誠。現在我們知道那是生理機制。肥胖，也從來不是意志力的問題。",
      visualPrompt: "brain neural network abstract art"
    },
    // Index 2: ID 4 (Mid Left) - Airplane
    {
      title: "作弊的位移速度",
      artist: "萊特兄弟",
      year: "1903",
      description: "飛機，嘲笑地心引力的巨大金屬鳥。它讓人類無視雙腳的生理限制，在幾小時內跨越這顆星球。這是對空間距離的徹底作弊。",
      visualPrompt: "vintage airplane blueprint da vinci style"
    },
    // Index 3: ID 6 (Front Left) - Glasses
    {
      title: "作弊的視力",
      artist: "光學修正主義",
      year: "1286",
      description: "眼鏡，最早的生物駭客裝置。它讓我們無視基因決定的視力衰退，強行延續高清的世界。這難道不是一種對自然法則的作弊嗎？",
      visualPrompt: "medieval glasses schematic style"
    },
    // Index 4: ID 3 (Back Right) - Filler
    {
      title: "反自然的勝利",
      artist: "文明史",
      year: "N/A",
      description: "人類文明的歷史，就是一部不斷違反自然、對抗熵增的作弊史。歡迎加入作弊者的行列，或者我們該稱之為——文明人。",
      visualPrompt: "civilization progress upward spiral abstract"
    },
    // Index 5: ID 5 (Mid Right) - Weight Loss
    {
      title: "科學的進化",
      artist: "現代醫學",
      year: "2024",
      description: "減肥藥物與手術，這不是作弊，這是優化。就像我們用眼鏡優化視力，用抗生素優化生存率，我們現在終於能優化自身的代謝與食慾。這不是懶惰，這是進化。",
      visualPrompt: "futuristic medical capsule glowing minimalist"
    },
    // Index 6: ID 7 (Front Right) - Antibiotics
    {
      title: "作弊的免疫力",
      artist: "亞歷山大·弗萊明",
      year: "1928",
      description: "抗生素，人類與微生物戰爭中的無限彈藥代碼。它讓我們得以逃避致命感染的自然淘汰，這是對死亡本身的公然作弊。",
      visualPrompt: "penicillin mold petri dish artistic"
    }
  ];

  const artworks: ArtworkData[] = rawArtworks.map((art: any, index: number) => {
    // We use picsum with a seed based on the visual prompt to get a consistent image
    const seed = Math.abs(art.title.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0));
    return {
      ...art,
      id: FRAME_LOCATIONS[index].id,
      position: FRAME_LOCATIONS[index].position,
      rotation: FRAME_LOCATIONS[index].rotation,
      imageUrl: `https://picsum.photos/seed/${seed}/500/700`
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
    你是一位性格古怪且知識淵博的博物館策展人。
    你目前正在與訪客討論名為 "${contextArtwork?.title || '未知'}" 的作品，作者是 ${contextArtwork?.artist || '未知'}。
    作品描述為： "${contextArtwork?.description}"。
    請用繁體中文回答訪客的問題，回答要簡短（50 字以內）且帶有個性。
    如果使用者問及房間或其他一般事物，請提供協助但保持策展人的角色設定。
  `;

  try {
    const ai = getAiClient();
    if (!ai) {
      return "（策展人遺失了大腦鑰匙... 請在 Vercel 設定 GEMINI_API_KEY 環境變數以啟用聊天功能。）";
    }

    const chat = ai.chats.create({
      model: modelName,
      config: { systemInstruction },
      history: history // Pass previous chat context if needed, though for this simple app we might just send the last query.
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "我此刻無言以對。";
  } catch (e) {
    return "策展人目前出去喝茶了。（連接 AI 發生錯誤）";
  }
};