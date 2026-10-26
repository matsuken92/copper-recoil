# Copper Recoil

女性ボーカルの4ピース・ロックバンド Copper Recoil のオフィシャルサイトです。  
https://copper-recoil.com/

## Preview

依存パッケージはありません。リポジトリ直下で次を実行し、`http://localhost:4173` を開いてください。

```sh
python3 -m http.server 4173
```

掲載情報は `index.html` で管理しています。ライブは12月19日（土）・錦糸町パピーズ・出演17:40〜を掲載し、年は未指定のため表示していません。

## Google Analytics 4（GA4）

`index.html` の `<head>` にGoogleタグの読み込み処理を実装し、測定ID `G-C1L1YQN8KW` を設定しています。GitHub Pagesへの公開反映後、本番ドメインで計測が有効になります。

### 初回セットアップ

1. [Google Analytics](https://analytics.google.com/) にログインし、初めて使う場合は「測定を開始」からアカウントを作成します。既存アカウントがある場合は「管理」→「作成」→「プロパティ」に進みます。
2. プロパティ名を `Copper Recoil`、レポートのタイムゾーンを日本、通貨を日本円に設定し、業種・規模・利用目的を選んで作成します。
3. データ収集で「ウェブ」を選択し、ウェブサイトURLを `https://copper-recoil.com`、ストリーム名を `Copper Recoil Website` としてデータストリームを作成します。
4. 「拡張計測機能」の設定で、スクロール数と離脱クリックを有効にします。SNSや会場サイトへのリンククリックを計測できます。
5. ウェブストリームの詳細にある `G-` で始まる「測定ID」をコピーします。「管理」→「データの収集と修正」→「データ ストリーム」から再確認できます。数値だけのプロパティID・ストリームIDとは異なります。
6. `index.html` 内の `measurementId` に測定IDを設定します。現在は `const measurementId = 'G-C1L1YQN8KW';` を設定済みです。測定IDは公開HTMLに含まれる識別子です。APIキーやサービスアカウントは不要です。
7. 変更をGitHub Pagesの公開対象ブランチに反映し、デプロイ完了を待ちます。Googleの画面で表示されるタグを追加で貼り付ける必要はありません。

公式手順: [アナリティクスのセットアップ](https://support.google.com/analytics/answer/9304153?hl=ja)、[拡張計測機能](https://support.google.com/analytics/answer/9216061?hl=ja)。

### 計測内容と動作

- 有効な形式の測定IDが設定され、ホスト名が `copper-recoil.com` または `www.copper-recoil.com` のときだけGoogleタグを非同期で読み込みます。`localhost`、IPアドレス、GitHub Pagesのプレビュー用ドメインでは計測しません。
- 初回の `page_view` はGoogleタグの `config` が自動送信します。手動で同じイベントを追加送信していません。流入元や端末などはGA4の標準レポートで確認できます。
- 拡張計測を有効にすると、ページの90%まで到達したスクロールや外部サイトへのクリックも計測します。独自の音楽プレーヤーの再生、メールアドレスの表示・コピーは今回の計測対象に含みません。
- 測定を止める場合は `measurementId` を空文字に戻して再デプロイします。

### 公開後の確認

1. 広告ブロッカーの影響を受けないブラウザで公開サイトを開きます。ローカルプレビューは計測対象外です。
2. 開発者ツールのNetworkで `gtag/js?id=G-...` が読み込まれ、`collect` リクエストの `tid` が設定した測定ID、`en` が `page_view` になっていることを確認します。
3. GA4の「レポート」→「リアルタイム」で自分のアクセスを確認します。ページ下部までスクロールしたりSNSリンクを開いたりして、`scroll`・`click` も確認します。
4. 通常のレポートへの反映には24〜48時間かかることがあります。まずリアルタイムで確認してください（[Google公式のデータ収集確認手順](https://support.google.com/analytics/answer/9333790?hl=ja)）。

## Music

Musicセクションで「光の呼吸 (Studio version)」（`assets/media/hikari_no_kokyu.mp3`）のみを試聴できます。専用プレーヤーで再生・一時停止・シークに対応し、自動再生はしません。音源は再生ボタンを押した時に初めて読み込みます。JavaScriptが無効な場合は有効化の案内を表示します。

シークの動作確認にはHTTP Range対応の配信サーバーを使用してください。上記のPython簡易サーバーでは、再生位置の変更が正しく動作しない場合があります。

ダウンロードリンクやブラウザ標準のプレーヤーを表示せず、音源URLは `script.js` 内でBase64に分割して保持し、再生操作時に復元します。音源URLにはファイルのSHA-256先頭12桁を `?v=` として付け、差し替え前のキャッシュと区別します。「光の呼吸」に適用済みです。同じファイル名で差し替える際も、ハッシュを再計算してエンコードされたURLを更新してください。`script.js` 更新後は、そのSHA-256先頭12桁で `index.html` のスクリプトURLの `?v=` も更新します。

これは通常の画面からの保存をしにくくする簡易対策で、暗号化やアクセス制御ではありません。GitHub Pages上のMP3は公開ファイルです。開発者ツール・通信の解析・録音による保存や、公開リポジトリからの取得は防げません。

## Contact

メールアドレスは `script.js` のエンコードされた文字列で管理し、「メールアドレスを表示」の操作後にだけ復元します。初期HTMLや初期表示のDOMにはアドレスと `mailto:` リンクを含めません。

これは単純なメールアドレス収集を抑える簡易対策です。JavaScriptを解析・実行するbotによる取得は防げません。表示後はメールアプリを開くか、アドレスをコピーできます。JavaScriptが無効な場合は有効化の案内を表示します。

## Social sharing (OGP / X)

`index.html` の `description`・`og:description`・`twitter:description` と、`title`・`og:title`・`twitter:title` は同じ内容に保ってください。正規URLは `https://copper-recoil.com/` です。日付が古くならないよう、説明文は個別ライブの日時を含めません。

共有画像は既存の `assets/top.png`（1648×720、約2.29:1）を使用します。`assets/icon.jpg` は400×400のためファビコンとして維持します。共有サービスによって画像の端がトリミングされる場合があります。画像を差し替える際は、OGPとX両方のURL・altおよびOGPの寸法とMIMEタイプを更新してください。キャッシュとの区別には新しいファイル名を推奨します。

マージ後の確認手順:

1. GitHub Pagesのデプロイ完了後、公開HTMLのheadにOGPとTwitter Cardがあることを確認。
2. 画像URLが認証不要でHTTP 200・`image/png`を返すことを確認。
3. Facebook Sharing Debuggerで再取得し、XとDiscordでも共有時のカードを確認。各サービスのキャッシュにより反映が遅れる場合があります。
