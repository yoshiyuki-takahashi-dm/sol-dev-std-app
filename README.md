# ソリューションディベロッパーStandard研修の最終課題

## 実装方針
基本的に上から実装する。

かっこ内は習得できるポイント。
- [x] スタート画面（簡単なＵＩ）
- [x] はじめから画面（簡単な入力ＵＩ、画面遷移）
- [x] s3バケットにトレーナー情報を記録（s3アクセス　追加）
- [x] つづきから画面（簡単なリストＵＩ）
- [x] s3バケットからトレーナー情報を取得（s3アクセス　取得）
- [x] 帰る、ぽけもん捕まえる画面（簡単なＵＩ）
- [x] PokeAPIでポケモン詳細取得に時間がかかるため、ユーザー操作で任意取得にする
- [x] ぽけもん一覧画面（フロントからPokeAPIアクセス）
- [x] ぽけもん指定して取得（バックからPokeAPIアクセス）
- [x] もっているぽけもんを表示（PokeAPIアクセス結果をs3に記録）
- [x] もっているぽけもんを手放す（s3アクセス　変更）
- [x] トレーナー帰る（s3アクセス　削除）
- [x] なにかリッチなＵＩ（ポケモン詳細取得、タイプフィルター）


## 取り組み方針
あまり考え込まずに例題や正解（half）実装を参考にする。理解のためにコメントをできるだけ記載する。一方、一度参考にしたところはできるだけもう見ないようにする。また、ユニークな実装で頭を使うようにする。

## 正解例との差分
〇は追加、×はやらなかったこと
- 〇　トップ画面をポケモンゲームに寄せてGif表示
- 〇　ポケモン選択画面で詳細取得の操作
- 〇　ポケモン選択画面でポケモン画像（前後）を表示
- 〇　ポケモン選択画面でタイプ選択してフィルタをかける
- 〇　マサラタウンにかえる
- ✕　ポケモンニックネーム編集（ほかを優先した）
- ✕　ポケモンGet時にバックエンドからPokeAPI通信（PulseSecure切ってもダメだった。WSLとか実行環境の問題かも。別策で解決。）

## やってみてダメだったこと、やらないこと
- PokeAPIでポケモン詳細取得に時間がかかるため、起動時に裏のストアで取得し続けておく
  - ストアは同じコンポーネントツリー間でのデータ受渡の仕組みのため
- デモモード
  - fetchせずにローカルデータを操作するつもりでいたけど、やってみてもあまり得られるものがないと感じたため

## もうちょっとやりたかったこと
- ポケモン詳細を1300件近くとっても遅くないと感じる仕組み
  - 具体的に：とりながら画面表示する、1回とったらどこかに永続化する
- ポケモンタイプフィルターのデザイン崩れ
  - 具体的に：色相環をダイアログの中に配置、マウスオーバーで出すツールチップの座標修正

## 本実装で得たこと、再認識したこと
- リアクティブ変数の更新で再描画されるのは関連するコンポーネントのみ
  - 変数が増えてきたり、オブジェクトをリアクティブにしてたりすると（？）、けっこう頭から抜けるので留意する。
- 開発/実行環境由来の問題対策がむずかしい
  - 実装したコードは対策が単純なことが多い。環境となると、切り分けしようにも複数環境を用意する必要があったり複雑なことが多い。expressサーバーからPokeAPIできない問題は、Proxyの問題かと思っていたが、社外環境にしても発生したため原因は別にありそうだった。
- 別対策で解決できないか？も意識すること。
  - 上記該当のPokeAPIでは指定のポケモン詳細情報を取得するだけだったので必ずしもサーバーサイドから実行しなくてもよかった。フロントに実装して、s3アクセスしてトレーナー情報更新する箇所だけサーバーサイドに残す方法で対策した。問題に真っ向勝負して深堀する力も大事だけど、別案を広くもつ/検討する力も大事、という話。