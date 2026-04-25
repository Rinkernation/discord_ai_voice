# 02. ローカル開発環境の構築手順

このドキュメントでは、ボットを自分のPCで動かすための手順をまとめます。

## 1. 必要なツール
- Node.js (v20以上推奨)
- Docker Desktop (VOICEVOXエンジン用)

## 2. トークンの取得と設定

### 2-1. Discord Bot Token の取得とサーバーへの招待
1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセスして「New Application」を作成します。
2. 左メニュー「Bot」を開きます。
3. `Reset Token` ボタンを押して **Botトークン** をコピーし、プロジェクト直下の `.env` ファイル内の `DISCORD_TOKEN` に貼り付けます。
4. 同じ「Bot」画面を少し下にスクロールし、**Privileged Gateway Intents（特権ゲートウェイインテント）** という項目のうち、以下のスイッチをオンにして保存します。
   - **Message Content Intent** （日本語翻訳ブラウザの場合：「メッセージ内容のインテント」等。上から3つ目のスイッチです。これが無いとボットがユーザーの発言を読み取れません）
5. 左メニュー「OAuth2」→「URL Generator」を開きます。
   - Scopes: `bot` にチェック
   - Bot Permissions: `Administrator` (管理者) にチェック
6. 下部に生成されたURLをブラウザの別タブで開き、自分のサーバーにBotを招待します。

### 2-2. Gemini API Key の取得
1. [Google AI Studio](https://aistudio.google.com/) からAPIキーを取得します。
2. `.env` ファイル内の `GEMINI_API_KEY` に貼り付けます。

## 3. インストールと起動
ターミナルで以下のコマンドを実行します。

```bash
# パッケージのインストール
npm install
# ※WindowsのPowerShellで赤字のエラーが出る場合は以下を使用：
# npm.cmd install

# VOICEVOXエンジンの起動
# 【方法A】Dockerを使う場合:
docker run --rm -d -p 50021:50021 --name voicevox voicevox/voicevox_engine:cpu-ubuntu20.04-latest

# 【方法B】Dockerが使えない（BIOSの仮想化オフなど）場合:
# VOICEVOX公式サイト (https://voicevox.hiroshiba.jp/) から
# Windows版のアプリをダウンロードして起動しておくことでも、同じように利用可能です！

# 開発モードでボットを起動
npm run dev
# ※エラーが出る場合は以下を使用：
# npm.cmd run dev
```

## 4. トラブルシューティング
（起動しない場合や、よくあるエラーの解決方法をここに追記していきます）
