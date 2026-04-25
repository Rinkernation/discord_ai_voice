const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
    console.log("=== Gemini API 通信テスト ===");
    try {
        console.log("モデル 'gemini-2.5-flash' にメッセージを送信中...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'こんにちは、テストです。返事は短くてOKです。'
        });
        console.log("✅ 成功！返答:", response.text);
    } catch (e) {
        console.error("❌ エラー発生:", e.status, e.message);
    }
}

run();
