# Copper Recoil

女性ボーカルの4ピース・ロックバンド Copper Recoil のオフィシャルサイトです。  
https://copper-recoil.com/

## Preview

依存パッケージはありません。リポジトリ直下で次を実行し、`http://localhost:4173` を開いてください。

```sh
python3 -m http.server 4173
```

掲載情報は `index.html` で管理しています。ライブは12月19日（土）・錦糸町パピーズ・出演17:40〜を掲載し、年は未指定のため表示していません。

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
