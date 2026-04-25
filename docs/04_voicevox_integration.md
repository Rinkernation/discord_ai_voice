# 04. VOICEVOXとの連携（音声化）

このドキュメントでは、Geminiが生成したテキストをVOICEVOXを使って音声データに変換し、Discordのボイスチャット（VC）で読み上げる手順を解説します。

## 1. 概要
- **ライブラリ**: `@discordjs/voice`, `axios`, `libsodium-wrappers`, `ffmpeg-static`
- **音声エンジン**: Docker上のVOICEVOX (`localhost:50021`)
- **フロー**: 
  1. ユーザーがVCにいる状態でボットにメンション
  2. ボットが同じVCに参加
  3. Geminiが返答テキストを生成
  4. `axios` でテキストをVOICEVOX APIに送信し、音声データを取得
  5. `@discordjs/voice` を使ってVCにストリーミング再生

## 2. 必要なパッケージのインストール
```bash
npm install @discordjs/voice libsodium-wrappers ffmpeg-static prism-media axios
```
※Windowsの場合は `npm.cmd install ...` を使用。

## 3. 実装のポイント
- **VOICEVOX APIの2段階リクエスト**: まず `/audio_query` でアクセントなどのメタデータを生成し、それを `/synthesis` に渡すことで最終的なWAVデータを取得します。
- **声の変更**: `speaker` のID数値を変更することで、様々な声に変更できます。（例：2＝四国めたんノーマル、3＝ずんだもんノーマル）
