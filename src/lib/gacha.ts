// ============================================================
// 女神ガチャ — 抽選ロジック & 映像生成AI用プロンプトビルダー
//
// 演出仕様（合計4秒 / 各カット1秒）:
//   ①幅約5m・30段の真紅カーペットの階段を一番下から駆け上がる
//   ②頂上のクレーンゲーム大のガチャガチャのハンドルが回転しカプセルが出る
//   ③カプセルが2つに開き、眩い光を放つ
//   ④光が収まると女神が丸い台座にストンと降臨、顔アップで一言セリフ
// ============================================================

export type CapsuleColor = "gold" | "silver" | "bronze" | "rainbow";

export type GoddessColor =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "pink"
  | "orange"
  | "purple"
  | "black"
  | "white";

export interface GachaResult {
  capsule: CapsuleColor;
  goddess: GoddessColor;
}

// ------------------------------------------------------------
// 出現率テーブル（‰ = 1/1000 単位。0.8% のような小数を整数で扱う）
// ------------------------------------------------------------

export const CAPSULE_WEIGHTS: Record<CapsuleColor, number> = {
  gold: 330, // 金 33%
  silver: 620, // 銀 62%
  bronze: 20, // 銅 2%
  rainbow: 30, // レインボー 3%
};

// 8色は各0.8%（=8‰）。合計6.4%で、残り93.6%は通常色（白）の女神が降臨する
export const GODDESS_WEIGHTS: Record<GoddessColor, number> = {
  red: 8,
  blue: 8,
  yellow: 8,
  green: 8,
  pink: 8,
  orange: 8,
  purple: 8,
  black: 8,
  white: 936,
};

// ------------------------------------------------------------
// 表示用メタデータ
// ------------------------------------------------------------

export const CAPSULE_META: Record<
  CapsuleColor,
  { label: string; en: string; rate: string; gradient: string; glow: string }
> = {
  gold: {
    label: "金",
    en: "gleaming gold",
    rate: "33%",
    gradient: "linear-gradient(135deg, #f7d774, #b8860b)",
    glow: "rgba(247,215,116,0.6)",
  },
  silver: {
    label: "銀",
    en: "polished silver",
    rate: "62%",
    gradient: "linear-gradient(135deg, #e8e8f0, #8a8a9a)",
    glow: "rgba(220,220,235,0.5)",
  },
  bronze: {
    label: "銅",
    en: "antique bronze",
    rate: "2%",
    gradient: "linear-gradient(135deg, #d09a6a, #7a4a24)",
    glow: "rgba(208,154,106,0.55)",
  },
  rainbow: {
    label: "レインボー",
    en: "iridescent rainbow",
    rate: "3%",
    gradient:
      "linear-gradient(135deg, #ff5f6d, #ffc371, #a8e063, #4facfe, #b06ab3)",
    glow: "rgba(176,106,179,0.6)",
  },
};

export const GODDESS_META: Record<
  GoddessColor,
  { label: string; en: string; rate: string; color: string; quote: string }
> = {
  red: {
    label: "赤の女神",
    en: "crimson-red",
    rate: "0.8%",
    color: "#f87171",
    quote: "情熱は、すべてを燃やし尽くすわ。",
  },
  blue: {
    label: "青の女神",
    en: "deep-blue",
    rate: "0.8%",
    color: "#60a5fa",
    quote: "静けさの中にこそ、真実はあるの。",
  },
  yellow: {
    label: "黄の女神",
    en: "radiant-yellow",
    rate: "0.8%",
    color: "#facc15",
    quote: "光あるところに、私は在る。",
  },
  green: {
    label: "緑の女神",
    en: "emerald-green",
    rate: "0.8%",
    color: "#4ade80",
    quote: "芽吹きなさい、あなたの運命よ。",
  },
  pink: {
    label: "ピンクの女神",
    en: "blossom-pink",
    rate: "0.8%",
    color: "#f472b6",
    quote: "愛こそが、最強の祝福よ。",
  },
  orange: {
    label: "オレンジの女神",
    en: "sunset-orange",
    rate: "0.8%",
    color: "#fb923c",
    quote: "夜明けは、あなたのためにあるの。",
  },
  purple: {
    label: "紫の女神",
    en: "mystic-purple",
    rate: "0.8%",
    color: "#c084fc",
    quote: "秘めたる力、いま解き放ちなさい。",
  },
  black: {
    label: "黒の女神",
    en: "obsidian-black",
    rate: "0.8%",
    color: "#94a3b8",
    quote: "闇もまた、私の翼のひとつ。",
  },
  white: {
    label: "白の女神",
    en: "pure-white",
    rate: "93.6%",
    color: "#f1f5f9",
    quote: "また会えたわね。今日も良い一日を。",
  },
};

// ------------------------------------------------------------
// 抽選
// ------------------------------------------------------------

function weightedPick<T extends string>(
  weights: Record<T, number>,
  rng: () => number,
): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll < 0) return key;
  }
  return entries[entries.length - 1][0];
}

export function drawGacha(rng: () => number = Math.random): GachaResult {
  return {
    capsule: weightedPick(CAPSULE_WEIGHTS, rng),
    goddess: weightedPick(GODDESS_WEIGHTS, rng),
  };
}

// ------------------------------------------------------------
// 映像生成AI用プロンプト（日本語 / 英語）
// ------------------------------------------------------------

export function buildVideoPrompt(result: GachaResult): {
  ja: string;
  en: string;
} {
  const capsule = CAPSULE_META[result.capsule];
  const goddess = GODDESS_META[result.goddess];

  const ja = `【女神ガチャ 4秒ショート映像 / 4カット構成】

■ 舞台設定
幅約5m・30段の大階段に真紅のカーペットが敷かれている。階段の頂上には、クレーンゲームほどの大きさの巨大なガチャガチャマシンが鎮座している。荘厳で神殿のような雰囲気。

■ カット1（0:00–0:01）階段の駆け上がり
カメラは階段の一番下からスタート。真紅のカーペットの上を、頂上の巨大ガチャガチャに向かって一気に駆け上がるダイナミックな前進移動ショット。

■ カット2（0:01–0:02）ガチャを回す
巨大ガチャガチャの回転ハンドルが「ガチャリ」と回り、取り出し口から${capsule.label}色（${capsule.en}）のカプセルがコロンと転がり出る。

■ カット3（0:02–0:03）カプセル開封
${capsule.label}のカプセルが上下2つにパカッと開き、中から画面全体が白く飛ぶほどの眩い光が放たれる。

■ カット4（0:03–0:04）女神降臨
光が収まると、${goddess.label}（${goddess.en}）が丸い台座の上にストンと上から降り立つ。カメラが女神の顔にクローズアップし、女神が一言つぶやく——
「${goddess.quote}」`;

  const en = `[Goddess Gacha — 4-second short film, 4 shots, 1 second each]

Setting: A grand 30-step staircase, about 5 meters wide, covered in a deep crimson carpet. At the top sits a giant gacha capsule machine the size of a crane game, glowing in a solemn, temple-like atmosphere.

Shot 1 (0:00–0:01) — Dynamic forward-moving camera rushes up the crimson-carpeted staircase from the very bottom to the giant gacha machine at the top.

Shot 2 (0:01–0:02) — Close-up: the machine's large dial turns with a satisfying clunk, and a ${capsule.en} capsule tumbles out of the dispenser slot.

Shot 3 (0:02–0:03) — The ${capsule.en} capsule pops open into two halves, releasing a blinding, screen-flooding burst of divine light.

Shot 4 (0:03–0:04) — As the light fades, a ${goddess.en} goddess gently drops from above and lands softly on a round pedestal. The camera pushes into a close-up of her face as she speaks a single line: "${goddess.quote}"

Style: cinematic, hyper-detailed, dramatic volumetric lighting, 4K.`;

  return { ja, en };
}
