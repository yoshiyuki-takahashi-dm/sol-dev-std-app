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
- [ ] PokeAPIでポケモン一覧取得に時間がかかるため、バックエンド側でもっておく
- [ ] ぽけもん一覧画面（フロントからPokeAPIアクセス）
- [ ] ぽけもん指定して取得（バックからPokeAPIアクセス）
- [ ] もっているぽけもんを表示（PokeAPIアクセス結果をs3に記録）
- [ ] もっているぽけもんの情報変更（s3アクセス　変更）
- [ ] トレーナー帰る（s3アクセス　削除）
- [ ] なにかリッチなＵＩ


## 取り組み方針
あまり考え込まずに例題や正解（half）実装を参考にする。理解のためにコメントをできるだけ記載する。

ユニークな実装で頭を使うようにする。

## やってみてダメだったこと、やらないこと
- PokeAPIでポケモン一覧取得に時間がかかるため、起動時に裏のストアで取得し続けておく
  - これは、同じコンポーネントツリー間でのデータ受渡のため