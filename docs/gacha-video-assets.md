# 女神ガチャ 動画素材の作り方

ガチャ画面（/gacha）は、`public/videos/gacha/` に以下の **13本のmp4** を置くと、
抽選結果に合わせて「導入 → カプセル → 女神」の3本を自動で連続再生します。
（素材が無い間は簡易CSSアニメーション演出で動作します）

## ファイル構成

```
public/videos/gacha/
├── intro.mp4            … 階段駆け上がり（全結果共通・1本）
├── capsule-gold.mp4     … 金カプセル排出〜開封
├── capsule-silver.mp4   … 銀カプセル排出〜開封
├── capsule-bronze.mp4   … 銅カプセル排出〜開封
├── capsule-rainbow.mp4  … レインボーカプセル排出〜開封
├── goddess-red.mp4      … 赤の女神（勝負運）降臨〜セリフ
├── goddess-blue.mp4     … 青の女神（仕事運）
├── goddess-yellow.mp4   … 黄の女神（金運）
├── goddess-green.mp4    … 緑の女神（健康運）
├── goddess-pink.mp4     … ピンクの女神（恋愛運）
├── goddess-orange.mp4   … オレンジの女神（家族運）
├── goddess-purple.mp4   … 紫の女神（出世運）
└── goddess-black.mp4    … 黒の女神（はずれ）
```

3パーツに分割してあるため、4色×8色=32通りの結果をこの13本だけで表現できます。

## 作り方

1. 下の各プロンプトを Veo 3（[labs.google/flow](https://labs.google/flow) / Gemini）や Sora に貼り付けて動画を生成する
2. 生成された動画を上記のファイル名で `public/videos/gacha/` に保存する
3. `npm run dev` でアプリを起動し /gacha でガチャを回すと、結果に合った動画が連続再生される

**コツ**
- 女神のセリフ入り音声を作れる **Veo 3 が最もおすすめ**（goddess系クリップの日本語セリフをそのまま喋ってくれます）
- 生成される動画は8秒などの固定尺のことが多いので、動画編集アプリ（CapCutなど）で各1〜3秒にトリミングするとテンポが良くなります
- 見た目の一貫性を出すため、同じセッション内で続けて生成するか、最初に気に入った1本を参照画像として使い回してください

---

## intro（全結果共通）

### `intro.mp4`

```
Dynamic forward-moving camera rushes up a grand 30-step staircase, about 5 meters wide, covered in a deep crimson carpet, from the very bottom toward a giant gacha capsule machine the size of a crane game waiting at the top. Solemn, temple-like atmosphere. Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

## カプセル（4本）

### `capsule-gold.mp4`（金）

```
Close-up of a giant gacha capsule machine. Its large dial turns with a satisfying clunk, and a gleaming gold capsule tumbles out of the dispenser slot. The capsule then pops open into two halves, releasing a blinding, screen-flooding burst of divine light. Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `capsule-silver.mp4`（銀）

```
Close-up of a giant gacha capsule machine. Its large dial turns with a satisfying clunk, and a polished silver capsule tumbles out of the dispenser slot. The capsule then pops open into two halves, releasing a blinding, screen-flooding burst of divine light. Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `capsule-bronze.mp4`（銅）

```
Close-up of a giant gacha capsule machine. Its large dial turns with a satisfying clunk, and a antique bronze capsule tumbles out of the dispenser slot. The capsule then pops open into two halves, releasing a blinding, screen-flooding burst of divine light. Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `capsule-rainbow.mp4`（レインボー）

```
Close-up of a giant gacha capsule machine. Its large dial turns with a satisfying clunk, and a iridescent rainbow capsule tumbles out of the dispenser slot. The capsule then pops open into two halves, releasing a blinding, screen-flooding burst of divine light. Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

## 女神（8本）

### `goddess-red.mp4`（赤の女神）

```
As a blinding divine light fades, a beautiful anime-style crimson-red goddess gently drops from above and lands softly on a round pedestal. She wears an ornate crimson-red gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of victory in battles and challenges. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "今日のあなたに、負けはないわ。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-blue.mp4`（青の女神）

```
As a blinding divine light fades, a beautiful anime-style deep-blue goddess gently drops from above and lands softly on a round pedestal. She wears an ornate deep-blue gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of success in work and career. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "その仕事、必ず実を結ぶわ。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-yellow.mp4`（黄の女神）

```
As a blinding divine light fades, a beautiful anime-style radiant-yellow goddess gently drops from above and lands softly on a round pedestal. She wears an ornate radiant-yellow gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of wealth and financial fortune. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "黄金の流れは、あなたに向かっているわ。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-green.mp4`（緑の女神）

```
As a blinding divine light fades, a beautiful anime-style emerald-green goddess gently drops from above and lands softly on a round pedestal. She wears an ornate emerald-green gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of health and vitality. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "心も体も、今日は満ちているわ。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-pink.mp4`（ピンクの女神）

```
As a blinding divine light fades, a beautiful anime-style blossom-pink goddess gently drops from above and lands softly on a round pedestal. She wears an ornate blossom-pink gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of love and romance. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "今日、愛はあなたに微笑むわ。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-orange.mp4`（オレンジの女神）

```
As a blinding divine light fades, a beautiful anime-style sunset-orange goddess gently drops from above and lands softly on a round pedestal. She wears an ornate sunset-orange gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of family harmony and bonds. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "大切な人との時間を、忘れないでね。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-purple.mp4`（紫の女神）

```
As a blinding divine light fades, a beautiful anime-style mystic-purple goddess gently drops from above and lands softly on a round pedestal. She wears an ornate mystic-purple gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of promotion and rising status. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "頂へ続く扉は、もう開いているわ。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```

### `goddess-black.mp4`（黒の女神）

```
As a blinding divine light fades, a beautiful anime-style obsidian-black goddess gently drops from above and lands softly on a round pedestal. She wears an ornate obsidian-black gown of layered translucent silk laced with gold filigree and matching jewels, and a spiked crystal crown in the same color. She is the goddess of a miss — take it easy and rest today. The camera pushes into a close-up of her face as she speaks a single line in Japanese: "今日は無理をしないで。ゆっくり過ごしなさい。" Cinematic anime, hyper-detailed, dramatic volumetric lighting, 4K.
```
