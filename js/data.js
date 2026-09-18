/*
 * Product content.
 * Source: osc-inc.co.jp product pages (/zw3d/, /zwcad/, /zwcad-mfg/, /zwsoft-products/), checked 2026-09-18.
 * Only facts stated on those pages are used. "scenes" / "outcomes" are phrased as
 * direct consequences of the listed features, not as measured results.
 */
window.OSC = window.OSC || {};

window.OSC.links = {
  contact: "https://www.osc-inc.co.jp/お問合せ/",
  trial: "https://www.osc-inc.co.jp/zwtrial/",
  apply: "https://www.osc-inc.co.jp/zw_product_apply/"
};

window.OSC.products = [
  {
    id: "zw3d",
    name: "ZW3D",
    category: "3D CAD/CAM",
    dim: "3D（図面作成機能あり）",
    catch: "設計から製造まで、ひとつの環境で。",
    value: "設計から製造までを一貫してサポートする、オールインワンの3D CAD/CAM。",
    summary:
      "ソリッドとサーフェスを自由に使い分けられるハイブリッドモデリングを核に、部品設計・アセンブリ設計・2D図面・解析（CAE）・加工（CAM）までを一つの環境で扱える統合型3Dソフトウェアです。",
    highlights: ["ハイブリッドモデリング", "アセンブリ設計と干渉チェック", "2軸〜5軸加工に対応するCAM"],
    features: [
      { t: "部品設計", d: "ハイブリッドモデリングとダイレクト編集。板金・金型・溶接構造物向けの専用モジュールを備えます。" },
      { t: "アセンブリ設計", d: "大規模アセンブリへの対応、干渉チェック、分解図や動作のアニメーション。" },
      { t: "2D図面作成", d: "3Dモデルと連動した自動投影、JISに準拠した注記ツール、PDF／DWGへの一括出力。" },
      { t: "シミュレーション（CAE）", d: "静解析・振動解析・熱伝導解析などの構造解析と、最適化設計の支援。" },
      { t: "製造（CAM）", d: "2軸〜5軸加工、加工シミュレーション、ポストプロセッサへの対応。" }
    ],
    scenes: [
      "板金・金型・溶接構造物を含む製品を3Dで設計する",
      "3Dモデルから加工パスの作成まで、社内で一貫して進めたい",
      "モデル・図面・解析を同じデータで扱い、手戻りを減らしたい"
    ],
    outcomes: [
      "設計と製造のあいだのデータ変換・受け渡しの手間を減らせます",
      "設計変更を加工側のデータへ反映しやすくなります",
      "設計のみ／加工のみなど、用途に応じてエディションを選べます"
    ],
    usage: "3D設計から製造（CAM）まで",
    scene: "板金・金型を含む製品設計、社内での加工データ作成",
    keyFeature: "ハイブリッドモデリング、CAE、2〜5軸CAM",
    price: {
      from: "¥329,000〜",
      rows: [
        ["Lite", "¥329,000"],
        ["Standard", "¥635,000"],
        ["Professional", "¥949,000"],
        ["Premium", "¥1,688,000"],
        ["2 Axis Machining", "¥662,000"],
        ["3 Axis Machining", "¥971,000"]
      ]
    },
    page: "https://www.osc-inc.co.jp/zw3d/",
    visualLabel:
      "青く陰影をつけた、リブと穴のあるL字ブラケットの3Dイラスト。XYZの座標軸つき。"
  },
  {
    id: "zwcad",
    name: "ZWCAD",
    category: "2D 汎用CAD",
    dim: "2D",
    catch: "使い慣れたDWG環境を、そのまま。",
    value: "DWGをネイティブにサポートし、AutoCADとの高い互換性を持つ汎用2D CAD。",
    summary:
      "最新のDWG／DXF形式とシームレスな互換性を持つ汎用2D CADです。業界標準のコマンド体系を継承しているため、操作感を大きく変えずに設計業務へ移行できます。永久ライセンス方式を採用しています。",
    highlights: ["DWG／DXFとの高い互換性", "業界標準コマンドを継承した操作環境", "永久ライセンス方式"],
    features: [
      { t: "優れた互換性とスムーズな移行", d: "最新のDWG／DXF形式とシームレスな互換性があり、他社CADとのデータ授受も比較的容易です。" },
      { t: "使い慣れた操作環境", d: "業界標準のコマンドを継承。操作感を変えることなく、導入初日から設計業務を始められます。" },
      { t: "独自の高速エンジン", d: "マルチスレッド並列処理の最適化により、図面の読み込みや操作を高速化しています。" },
      { t: "柔軟なライセンス体系", d: "永久ライセンス方式。スタンドアロン版のほか、ネットワークライセンスも選べます。" }
    ],
    scenes: [
      "取引先とDWG図面をやり取りする",
      "他社の2D CADから乗り換えたい",
      "社内の作図・図面修正業務をまかなう"
    ],
    outcomes: [
      "蓄積したDWG図面をそのまま開いて活用できます",
      "操作の学び直しを抑えて移行できます",
      "永久ライセンスのため、利用コストの見通しを立てやすくなります"
    ],
    usage: "汎用の2D作図・図面編集",
    scene: "DWG図面の授受、他社2D CADからの移行",
    keyFeature: "DWG／DXF互換、業界標準コマンド、高速エンジン",
    price: {
      from: "¥114,000〜",
      rows: [
        ["Standard", "¥114,000"],
        ["Professional", "¥160,000"]
      ]
    },
    page: "https://www.osc-inc.co.jp/zwcad/",
    visualLabel:
      "穴あきプレートの2D図面イラスト。中心線・寸法線・表題欄が描かれている。"
  },
  {
    id: "zwcad-mfg",
    name: "ZWCAD MFG",
    category: "2D 機械設計CAD",
    dim: "2D",
    catch: "機械製図の定型作業を、もっと速く。",
    value: "ZWCAD Professionalをベースに、製造設計機能を統合した2DメカニカルCAD。",
    summary:
      "ZWCAD Professionalをベースに、機械設計向けの機能を統合した2DメカニカルCADです。JISをはじめとする規格に準拠した部品ライブラリや、バルーンと同期する部品表（BOM）機能で、機械製図の定型作業を支援します。DWG形式もそのまま扱えます。",
    highlights: ["JISなどの規格に準拠した部品ライブラリ", "シャフト・ギヤのジェネレーター", "バルーンと同期するBOM生成"],
    features: [
      { t: "部品ライブラリ", d: "ISO・EN・DIN・ANSI・ASME・JISなどの規格に準拠した、豊富な部品ライブラリを搭載しています。" },
      { t: "スマート作図ツール", d: "寸法を入力するだけでシャフトやギヤを生成するジェネレーターと、元図と連動する詳細図の作成機能。" },
      { t: "寸法記入と機械記号", d: "重なりを避けて適切な間隔で寸法を一括記入。表面粗さ・溶接記号・引出線注記などの機械記号に対応。" },
      { t: "BOM（部品表）機能", d: "バルーンと同期して部品表を生成します。" },
      { t: "ライセンス体系", d: "永久ライセンス方式。スタンドアロン版とネットワークライセンス版があります。" }
    ],
    scenes: [
      "ボルト・ベアリングなどの規格部品を多用する機械製図",
      "図面と部品表を同時に作成・更新したい",
      "DWG互換の環境のまま、機械設計機能を追加したい"
    ],
    outcomes: [
      "規格部品を一から作図する手間を減らせます",
      "バルーンと部品表のずれを防ぎやすくなります",
      "ZWCADと同じDWGベースの環境で機械製図に取り組めます"
    ],
    usage: "機械部品・装置の2D製図",
    scene: "規格部品を使う機械製図、部品表の作成",
    keyFeature: "規格部品ライブラリ、ジェネレーター、BOM",
    price: {
      from: "¥175,000",
      rows: [["スタンドアロン版", "¥175,000"]]
    },
    page: "https://www.osc-inc.co.jp/zwcad-mfg/",
    visualLabel:
      "ギヤ付き段付きシャフトの正面図イラスト。番号つきバルーンと部品表（BOM）が添えられている。"
  }
];
