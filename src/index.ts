import { Client, GatewayIntentBits, Events, Message } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';
import { GoogleGenAI } from '@google/genai';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';
import { characters } from './characters';

// 環境変数の読み込み
dotenv.config();

// 使用するキャラクターの選択（環境変数 ACTIVE_CHARACTER がなければ 'sister' を使用）
const characterKey = process.env.ACTIVE_CHARACTER || 'sister';
const character = characters[characterKey] || characters['sister'];

console.log(`キャラ設定読み込み完了: ${character.name} モードで起動します。`);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates, // VCに参加するために必要
    ],
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! 起動完了: ${readyClient.user.tag} としてログインしました。`);
});

// VOICEVOX APIを叩いて音声を生成する関数
async function generateVoice(text: string): Promise<Buffer> {
    const baseUrl = 'http://localhost:50021';
    
    // 1. テキストから音声合成用のクエリを作成
    const queryResponse = await axios.post(`${baseUrl}/audio_query`, null, {
        params: {
            text: text,
            speaker: character.voicevoxSpeakerId
        }
    });

    // 2. クエリをもとに音声データ（ArrayBuffer）を生成
    const synthResponse = await axios.post(`${baseUrl}/synthesis`, queryResponse.data, {
        params: {
            speaker: character.voicevoxSpeakerId
        },
        responseType: 'arraybuffer'
    });

    return Buffer.from(synthResponse.data);
}

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;

    if (client.user && message.mentions.has(client.user)) {
        const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();

        if (!userMessage) {
            await message.reply(character.replies.emptyMessage);
            return;
        }

        // 退出コマンドのチェック
        if (userMessage.match(/(バイバイ|おやすみ|さよなら|帰って|切断)/)) {
            const connection = getVoiceConnection(message.guild!.id);
            if (connection) {
                connection.destroy();
                await message.reply(character.replies.leaveMessage);
                return;
            }
        }

        // ユーザーがボイスチャンネルに参加しているかチェック
        const member = message.member;
        const voiceChannel = member?.voice.channel;
        
        let connection: any = null;
        if (voiceChannel) {
            // ボットも同じボイスチャンネルに接続する
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator as any,
            });
        }

        if ('sendTyping' in message.channel) {
            await message.channel.sendTyping();
        }

        try {
            // Geminiでテキストを生成
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userMessage,
                config: {
                    systemInstruction: character.systemPrompt,
                }
            });

            const replyText = response.text;
            if (!replyText) throw new Error("Geminiから空の返答が返ってきました");

            // テキストチャットにも返信
            await message.reply(replyText);

            // VCにいる場合は音声を生成して再生
            if (connection) {
                console.log(`VOICEVOX(${character.name})で音声を生成中...`);
                const audioBuffer = await generateVoice(replyText);
                
                // 音声データを再生可能なストリームに変換
                const stream = Readable.from(audioBuffer);
                const resource = createAudioResource(stream);
                const player = createAudioPlayer();
                
                connection.subscribe(player);
                player.play(resource);
                
                player.on(AudioPlayerStatus.Idle, () => {
                    console.log('再生終了');
                });
            }

        } catch (error) {
            console.error('Error:', error);
            await message.reply(character.replies.errorMessage);
        }
    }
});

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
