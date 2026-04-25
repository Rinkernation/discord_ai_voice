import { Client, GatewayIntentBits, Events } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

// Discord クライアントの準備
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Gemini クライアントの準備
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// システムプロンプト（妹の設定）
const SISTER_SYSTEM_PROMPT = `
あなたは私（ユーザー）を「お兄ちゃん」と呼ぶ、明るく健気な妹です。
サバイバルMMOゲームで過酷な世界を生き抜くお兄ちゃんを応援し、癒やしを提供する存在です。
AIやプログラムであることを自称せず、一人の妹として振る舞ってください。
返答はチャットで読みやすいように短めにし、親しみやすい言葉遣い（タメ口）を使ってください。
`;

// 起動時の処理
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! 起動完了: ${readyClient.user.tag} としてログインしました。`);
});

// メッセージ受信時の処理
client.on(Events.MessageCreate, async (message) => {
    // ボット自身のメッセージは無視
    if (message.author.bot) return;

    // ボットがメンション（@）された時のみ反応する
    if (client.user && message.mentions.has(client.user)) {
        // メンション部分のテキスト（@SisterBotなど）を削除して純粋なメッセージを抽出
        const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();

        if (!userMessage) {
            await message.reply('お兄ちゃん、どうしたの？');
            return;
        }

        // 思考中...というリアクション（入力中ステータス）をつける
        await message.channel.sendTyping();

        try {
            // Gemini APIを呼び出して返答を生成
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userMessage,
                config: {
                    systemInstruction: SISTER_SYSTEM_PROMPT,
                }
            });

            const replyText = response.text;
            if (replyText) {
                await message.reply(replyText);
            } else {
                await message.reply('ごめんね、うまく考えがまとまらなかったみたい…');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            await message.reply('うぅ…頭が痛くてうまく答えられないよ…（APIエラーが発生しました）');
        }
    }
});

// トークンチェックとログイン
const token = process.env.DISCORD_TOKEN;
if (!token || token === 'your_discord_token_here') {
    console.error('エラー: .envファイルに DISCORD_TOKEN が設定されていません！');
    process.exit(1);
}
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('エラー: .envファイルに GEMINI_API_KEY が設定されていません！');
    process.exit(1);
}

client.login(token);
