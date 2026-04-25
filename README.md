# Project Antigravity: Discord Sister AI Bot

## 概要
Project Antigravityは、Discordコミュニティ（主にサバイバルMMO向け）に、Googleの最新AIモデル「Gemini」と音声合成エンジン「VOICEVOX」を組み合わせた、フルボイスの「妹分AI」を召喚するプロジェクトです。

ただのチャットボットではなく、TypeScriptを用いた堅牢な設計と、Google Cloud Platform（GCP）によるスケーラブルなインフラ構成を採用し、実用性と技術学習の両立を目指しています。

## 技術スタック
エンジニアとしてのスキルセットを証明するため、以下のモダンな構成を採用しています。

| カテゴリ | 採用技術 |
| :--- | :--- |
| **Language** | TypeScript (Node.js) |
| **Library** | discord.js |
| **AI (LLM)** | Google Gemini 1.5 Pro (Vertex AI / Google AI SDK) |
| **Voice Synthesis** | VOICEVOX (Local / Container API) |
| **Infrastructure** | Google Cloud Run (Containerized Execution) |
| **Database** | Cloud Firestore (Conversation History / Status Management) |
| **Secret Management** | Secret Manager |

## 主要機能
- **リアルタイムAI対話**: Geminiによる文脈を理解した自然な会話。
- **フルボイス応答**: VOICEVOXとの連携により、VC上での発話を実現。
- **キャラクター切り替え**: 設定ファイルを差し替えることで、複数の人格（妹、四国めたん、春日部つむぎ等）を切り替え可能。
- **退出コマンド**: 「バイバイ」などのキーワードでVCからスマートに退出。

## アーキテクチャ図


## 今後の展望 (Roadmap)
1. **好感度システムの構築**: Firestoreにユーザーごとの「好感度」を蓄積し、数値によってAIの応答内容や声色が変化する仕組みの実装。
2. **ゲーム内イベント連携**: ゲーム内の特定の出来事をトリガーにした自動発言機能。
3. **フロントエンド開発**: Reactを用いた、ボットの設定や好感度を確認できるWebダッシュボードの構築。
4. **完全音声対話 (Voice-to-Voice)**: Whisper等の音声認識AI (STT) を導入し、マイクで話しかけるだけで返事をしてくれる完全通話機能の実現。

---

## クレジット

本プロジェクトの音声出力およびキャラクター設定には、以下のソフトウェアとキャラクターを使用しています。

- **音声合成エンジン**: [VOICEVOX](https://voicevox.hiroshiba.jp/)
- **キャラクターライセンス**:
  - **四国めたん**: [東北ずん子プロジェクト](https://zunko.jp/) (c) SSS LLC.
  - **春日部つむぎ**: [春日部つむぎ公式サイト](https://tsumugi.tokyo/) (c) Kasukabe Tsukushi.