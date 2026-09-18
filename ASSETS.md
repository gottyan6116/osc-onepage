# 使用素材 出典・ライセンス管理表

確認日：2026-09-18

## 公開モックで使用している素材

| 素材 | 使用箇所 | 出典 | 利用条件 | 使用可否 |
|---|---|---|---|---|
| 分解図イラスト（フランジ／ベアリングハウジング／ギヤ／カラー／シャフト） | ヒーロー | 自作（`js/visuals.js` の `hero()`） | 自作のため制限なし | ○ 使用 |
| L字ブラケットの3Dイラスト | ZW3Dカード・モーダル | 自作（`bracketSVG()`） | 同上 | ○ 使用 |
| プレートの2D図面イラスト | ZWCADカード・モーダル | 自作（`zwcad()`） | 同上 | ○ 使用 |
| 段付きシャフトの図面＋BOMイラスト | ZWCAD MFGカード・モーダル | 自作（`mfg()`） | 同上 | ○ 使用 |
| 導入支援の線画アイコン4点、最終CTA背景の図面線 | 導入支援、最終CTA | 自作 | 同上 | ○ 使用 |
| オズクリエイション企業ロゴ（`assets/osc-logo.png`、270×60px PNG） | ヘッダー左上 | osc-inc.co.jp 掲載のロゴ（ユーザー提供の画像） | 利用許諾の記載なし。**採用選考で同社に提示する提案モックとして、ユーザーの指示で使用** | △ 面接での提示のみ。一般公開・デプロイする場合は許諾が必要 |
| フッター背景色 #0474BA | フッター | osc-inc.co.jp の画面から色を抽出 | 色のみ（著作物ではない） | ○ 使用 |
| Meiryo UI／メイリオ | 本文・見出しの書体 | Windows標準フォント（閲覧者の端末のものを使用。配布・埋め込みなし） | 端末にインストール済みのフォントを参照するだけ | ○ 使用（Macなどではヒラギノ角ゴにフォールバック） |
| IBM Plex Mono | 図版・ラベルの英数字 | Google Fonts | SIL Open Font License 1.1 | ○ 使用 |

すべての図版には「自作の技術イラストであり、製品の実際の画面ではない」旨を注記しています。

## 調査のみで確認し、公開モックには使用していない素材

| 素材 | 掲載元 | 利用条件 | 判断 |
|---|---|---|---|
| ZW3D_Logo / ZWCAD_LOGO / ZWCAD-MFG_LOGO | osc-inc.co.jp 各製品ページ | 利用許諾の記載なし | × 不使用 |
| 製品アイコン（3D-Icon, ZWRC_ZWCAD, zwcad_mfg） | /zwsoft-products/ | 同上 | × 不使用 |
| 機能説明の画像（PartDesign, AssemblyDesign, 2DDrawing, CAE, CAM, Compatibility_Migration, Familiar_InterFace, character_program_fast, license_system, hugeamount_lib, StamrtEditor, SmartDmntn__Symbl, ZWCAD2026TOP, MFG_TOP など） | osc-inc.co.jp 各製品ページ | 同上 | × 不使用（差し替え候補） |
| ZWSOFT公式サイトの画像 | zwsoft.com（日本版は zwsoft.co.jp へリダイレクト） | メディア素材の利用規約は確認できず | × 不使用 |
| 既存ページのスクリーンショット | `research/current-zwsoft-products-1440.png` | 比較検証のために撮影 | △ 調査用のみ（公開しない） |

## 作業記録

- `https://www.zwsoft.com/jp/` は `https://www.zwsoft.co.jp/` へ301リダイレクトされたため、会社概要の詳細は取得していません。モックにZWSOFT社の数値は掲載していません。
- 公式の製品画面を使う場合は、オズクリエイション様またはZWSOFT社の許諾を得たうえで、`[data-card-visual]` と `[data-m-visual]` の中身を `<picture>`（WebP/AVIF＋代替テキスト）に差し替えます。
