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
  | "black";

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

// 8色の女神は等確率（各12.5%）。色ごとに司る運勢が異なる
export const GODDESS_WEIGHTS: Record<GoddessColor, number> = {
  red: 125,
  blue: 125,
  yellow: 125,
  green: 125,
  pink: 125,
  orange: 125,
  purple: 125,
  black: 125,
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
  {
    label: string;
    en: string;
    rate: string;
    color: string;
    fortune: string;
    fortuneEn: string;
    quote: string;
  }
> = {
  red: {
    label: "赤の女神",
    en: "crimson-red",
    rate: "12.5%",
    color: "#f87171",
    fortune: "勝負運",
    fortuneEn: "victory in battles and challenges",
    quote: "今日のあなたに、負けはないわ。",
  },
  blue: {
    label: "青の女神",
    en: "deep-blue",
    rate: "12.5%",
    color: "#60a5fa",
    fortune: "仕事運",
    fortuneEn: "success in work and career",
    quote: "その仕事、必ず実を結ぶわ。",
  },
  yellow: {
    label: "黄の女神",
    en: "radiant-yellow",
    rate: "12.5%",
    color: "#facc15",
    fortune: "金運",
    fortuneEn: "wealth and financial fortune",
    quote: "黄金の流れは、あなたに向かっているわ。",
  },
  green: {
    label: "緑の女神",
    en: "emerald-green",
    rate: "12.5%",
    color: "#4ade80",
    fortune: "健康運",
    fortuneEn: "health and vitality",
    quote: "心も体も、今日は満ちているわ。",
  },
  pink: {
    label: "ピンクの女神",
    en: "blossom-pink",
    rate: "12.5%",
    color: "#f472b6",
    fortune: "恋愛運",
    fortuneEn: "love and romance",
    quote: "今日、愛はあなたに微笑むわ。",
  },
  orange: {
    label: "オレンジの女神",
    en: "sunset-orange",
    rate: "12.5%",
    color: "#fb923c",
    fortune: "家族運",
    fortuneEn: "family harmony and bonds",
    quote: "大切な人との時間を、忘れないでね。",
  },
  purple: {
    label: "紫の女神",
    en: "mystic-purple",
    rate: "12.5%",
    color: "#c084fc",
    fortune: "出世運",
    fortuneEn: "promotion and rising status",
    quote: "頂へ続く扉は、もう開いているわ。",
  },
  black: {
    label: "黒の女神",
    en: "obsidian-black",
    rate: "12.5%",
    color: "#94a3b8",
    fortune: "はずれ（無理せずに1日を過ごす）",
    fortuneEn: "a miss — take it easy and rest today",
    quote: "今日は無理をしないで。ゆっくり過ごしなさい。",
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
光が収まると、${goddess.label}（${goddess.en}）が丸い台座の上にストンと上から降り立つ。女神は${goddess.label.replace("の女神", "")}を基調とした、宝石と金の細工をふんだんにあしらった半透明のシルクのドレスをまとい、頭には同色のクリスタルが連なる王冠を戴くアニメ調の美しい姿。${goddess.fortune}を司る女神である。カメラが女神の顔にクローズアップし、女神が一言つぶやく——
「${goddess.quote}」`;

  const en = `[Goddess Gacha — 4-second short film, 4 shots, 1 second each]

Setting: A grand 30-step staircase, about 5 meters wide, covered in a deep crimson carpet. At the top sits a giant gacha capsule machine the size of a crane game, glowing in a solemn, temple-like atmosphere.

Shot 1 (0:00–0:01) — Dynamic forward-moving camera rushes up the crimson-carpeted staircase from the very bottom to the giant gacha machine at the top.

Shot 2 (0:01–0:02) — Close-up: the machine's large dial turns with a satisfying clunk, and a ${capsule.en} capsule tumbles out of the dispenser slot.

Shot 3 (0:02–0:03) — The ${capsule.en} capsule pops open into two halves, releasing a blinding, screen-flooding burst of divine light.

Shot 4 (0:03–0:04) — As the light fades, a beautiful anime-style ${goddess.en} goddess gently drops from above and lands softly on a round pedestal. She wears an ornate ${goddess.en} gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of ${goddess.fortuneEn}. The camera pushes into a close-up of her face as she speaks a single line: "${goddess.quote}"

Style: cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.`;

  return { ja, en };
}
