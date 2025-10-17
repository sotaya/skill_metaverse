# Crosk - リアルタイムコミュニケーションメタバース

    Crosk は、ユーザーがアバターを操作して仮想空間を自由に移動し、他のユーザーや AI ボットとリアルタイムで交流できる 2D メタバースアプリケーションです。プログラミングスキルを登録し、同じ興味を持つ他のユーザーと繋がることを目的としています。

## ✨ 主な機能

- リアルタイムなアバター操作: キーボードや画面上の D-Pad で仮想空間内を自由に移動できます。

- リアルタイムチャット: 他のユーザーや AI ボットと近づくことで、チャットを開始できます。

- プロフィールとスキルの登録: 自身のプロフィールやプログラミングスキルを登録・編集できます。

- フォロー・フォロワー機能: 気になるユーザーをフォローし、繋がりを作ることができます。

- ライセンス情報の表示: アプリ内で使用されているオープンソースアセットのクレジット情報を確認できます。

## 🛠️ 技術スタック

- フロントエンド: React, TypeScript, Redux Toolkit, PixiJS

- バックエンド / データベース: Firebase (Authentication, Firestore Realtime Database)

- スタイリング: Sass (SCSS)

- AI チャット: Google Gemini API

## 🚀 セットアップと実行方法

1. リポジトリをクローンします:

   `git clone https://github.com/your-username/skill_metaverse.git`
   `cd skill_metaverse`

2. 依存関係をインストールします:

   `npm install`

3. Firebase と Gemini の設定:
   プロジェクトのルートに.env ファイルを作成し、お使いの Firebase プロジェクトと Gemini API キーの設定情報を記述してください。

   `# .env ファイルの中身`
   `REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"`
   `REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"`
   `REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"`
   `REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"`
   `REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"`
   `REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"`
   `REACT_APP_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"`

4. 開発サーバーを起動します:

   `npm start`

   ブラウザで `http://localhost:3000` を開きます。

## 📜 ライセンス

    [!IMPORTANT]このプロジェクトは GNU General Public License v3.0 の下で公開されています。

    これは、プロジェクト内で使用されているアバターなどのグラフィックアセットに、GPL や CC-BY-SA といった「コピーレフト」の性質を持つライセンスが含まれているためです。

    このプロジェクトのソースコードをフォークして利用したり、派生物を作成したりする場合、あなたのプロジェクトも同様に GPL-3.0 ライセンスの下でソースコードを公開する必要があります。

詳細については、LICENSE ファイルおよびアプリケーション内のライセンス情報ページをご参照ください。

## ❤️ クレジット

このプロジェクトは、以下のような素晴らしいオープンソースのアセットを利用して作成されています。クリエイターの皆様に心より感謝申し上げます。

- 2D 空間タイルデザイン: [OpenGameArt.org](https://opengameart.org/)

- アバター作成: [Universal LPC Sprite Sheet Character Generator](https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/)

各アセットの詳細なクレジットは、アプリケーション内の「設定」→「ライセンス情報」からご確認いただけます。
