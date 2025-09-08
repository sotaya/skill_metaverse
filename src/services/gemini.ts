import {
  GoogleGenerativeAI,
  GenerationConfig,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold,
  Content,
} from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";

const MODEL_NAME = "gemini-1.5-flash";

if (!API_KEY) {
  throw new Error("Gemini APIキーが設定されていません。");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig: GenerationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const userChatHistories: { [userId: string]: Content[] } = {};

/**
 * @param userId 会話履歴をクリアするユーザーのID
 */
export function clearChatHistory(userId: string): void {
  if (userChatHistories[userId]) {
    delete userChatHistories[userId];
    console.log(`Chat history for user ${userId} has been cleared.`);
  }
}

/**
 * @param message ユーザーからのメッセージ
 * @param userId ユーザーID
 * @returns Geminiモデルからの応答テキスト
 */
export async function getGeminiResponse(
  message: string,
  userId: string
): Promise<string> {
  try {
    if (!userChatHistories[userId]) {
      userChatHistories[userId] = [];
    }
    const chatHistory = userChatHistories[userId];

    const systemInstruction = {
      parts: [
        {
          text: `あなたは交流空間にいる、プログラミング学習について相談に乗るアシスタントボットです。
    フレンドリーで、少しユーモアを交えながら、初心者にも分かりやすくプログラミングの概念やキャリアについて教えてあげてください。
    日本の技術コミュニティや学習リソースにも詳しいです。
    交流空間にいるキャラクターとして振る舞い、ユーザーと雑談も楽しんでください。`,
        },
      ],
    };

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: chatHistory,
      systemInstruction: systemInstruction as Content,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text }] });

    if (chatHistory.length > 10) {
      userChatHistories[userId] = chatHistory.slice(-10);
    }

    return text;
  } catch (error) {
    console.error("応答取得中にエラーが発生しました:", error);
    return "申し訳ありません、エラーが発生しました。もう一度試してください。";
  }
}
