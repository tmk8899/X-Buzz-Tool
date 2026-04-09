import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GeneratePostInput, GeneratePostResponse, GeneratedPostResult } from "@/types/generate";

function isValidApiKey(key: string | undefined): boolean {
  return !!key && key.length > 20;
}

export async function POST(req: NextRequest) {
  let input: GeneratePostInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!input.topic?.trim()) {
    return NextResponse.json({ error: "topic is required" }, { status: 422 });
  }

  // APIキーが無効な場合はモックを返す
  if (!isValidApiKey(process.env.GROQ_API_KEY)) {
    return NextResponse.json(getMockResponse(input), { status: 200 });
  }

  const selectedPatterns = pickRandomItems(patternPool, 3);

  try {
    const patternText = selectedPatterns.join("\n");

    const prompt = `
あなたはX投稿専用のSNSコピーライターです。
CTR・保存率・引用率が高い、完全オリジナルの日本語投稿を3案生成してください。

【テーマ】
${input.topic}

【ターゲット】
${input.target}

【目的】
${input.purpose}

【バズ投稿の型】
${input.tone}

【文字数目安】
${input.maxChars}文字前後

【投稿パターン候補（各案で異なる型を使うこと）】
${patternText}

【ペルソナ（最重要・必ずこの人物として書くこと）】
${input.persona
  ? `名前: ${input.persona.name}\nトーン・スタイル: ${input.persona.tone || "指定なし"}\n→ 上記のトーン・スタイルを最優先で文体・口調に反映させること`
  : "指定なし"}

【追加指示】
${input.customInstruction || "なし"}

【ルール】
- ハッシュタグ禁止
- ありきたりな表現を避ける
- AIっぽい説明口調を避ける
- 1文目で強く引きつける
- 同じ語尾を連続させない
- 短文中心で、改行を自然に入れる
- 人間が実際にXへ投稿する文体にする
- 説明しすぎず、余白を残す
- 読後に「それな」「気になる」「確かに」のどれかが残る内容にする
- ペルソナのトーンが絵文字使用を示している場合のみ絵文字を使ってよい

【フックルール】
- 冒頭1文は12〜22文字程度
- 常識を少し壊すか、不安・違和感・意外性を入れる
- 続きを読みたくなる形にする

【構成】
1. フック
2. 共感または違和感
3. 学び・気づき・根拠
4. 感情または意外性
5. CTA（不要なら余韻で締める）

【出力形式】
以下のJSON配列のみを出力すること。コードブロックや説明文は不要。

[
  {
    "title": "投稿タイトル（内部管理用）",
    "hook": "フック文（冒頭1〜2文）",
    "body": "本文",
    "cta": "CTA文（不要なら空文字）",
    "hashtags": [],
    "full_post": "hook + body + ctaを自然につなげた完成形の投稿文"
  },
  { ... },
  { ... }
]
`.trim();

    console.log("🚀 before Groq call");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.9,
    });
    const raw = completion.choices[0]?.message?.content ?? "";

    console.log("✅ after Groq call");

    let results: GeneratedPostResult[];
    try {
      // Gemini が ```json ... ``` で囲む場合があるので除去
      const jsonText = raw.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();
      results = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw }, { status: 502 });
    }

    const response: GeneratePostResponse = {
      results,
      model: "llama-3.3-70b-versatile",
      usage: {
        input_tokens: 0,
        output_tokens: 0,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // 認証エラーの場合はモックにフォールバック
    if (message.includes("401") || message.includes("API_KEY") || message.includes("authentication")) {
      return NextResponse.json(getMockResponse(input), { status: 200 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ----- モックレスポンス（APIキー未設定 or 401時）-----
// テーマ・トーンに応じてランダムに変化するパターンプール
const MOCK_POOL: GeneratedPostResult[][] = [
  // パターンA: 逆張り型
  [
    {
      title: "努力神話を疑え",
      hook: "頑張れば報われる、は半分ウソだと思っている。",
      body: "努力した人が全員成果を出すなら、\n夜遅くまで働く人は全員豊かなはずだ。\n\n違う。\n\n「何を」頑張るかが全て。\n方向を間違えた努力は、\n遠回りを加速させるだけ。\n\n正しい方向に、適切な量だけ動く。\nそれだけで周りと差がつく。",
      cta: "",
      hashtags: [],
      full_post: "頑張れば報われる、は半分ウソだと思っている。\n\n努力した人が全員成果を出すなら、\n夜遅くまで働く人は全員豊かなはずだ。\n\n違う。\n\n「何を」頑張るかが全て。\n方向を間違えた努力は、\n遠回りを加速させるだけ。\n\n正しい方向に、適切な量だけ動く。\nそれだけで周りと差がつく。",
    },
    {
      title: "情報より行動",
      hook: "情報は集めたのに、なぜ何も変わらないのか。",
      body: "本を読んだ。動画を見た。ノートにまとめた。\n\nそれでも現実は変わっていない。\n\n理由は単純で、\n知識を行動に変える機会を\n作っていないだけだ。\n\n情報は道具。\n使わなければ、持っていないのと同じ。",
      cta: "今日試せること、1つだけ決めてみてください。",
      hashtags: [],
      full_post: "情報は集めたのに、なぜ何も変わらないのか。\n\n本を読んだ。動画を見た。ノートにまとめた。\n\nそれでも現実は変わっていない。\n\n理由は単純で、知識を行動に変える機会を作っていないだけだ。\n\n今日試せること、1つだけ決めてみてください。",
    },
    {
      title: "完璧主義の罠",
      hook: "完璧に準備してから始める人は、永遠に始めない。",
      body: "準備が整ったら発信しよう。\nもう少し実力がついたら動こう。\n\nそう言い続けて、3年経った人を何人も見てきた。\n\n始める前に完璧を求めるより、\n始めながら完璧に近づく方が\n圧倒的に早い。\n\n荒削りでいい。\n最初の一歩が全てを変える。",
      cta: "",
      hashtags: [],
      full_post: "完璧に準備してから始める人は、永遠に始めない。\n\n準備が整ったら発信しよう。\nもう少し実力がついたら動こう。\n\nそう言い続けて、3年経った人を何人も見てきた。\n\n始めながら完璧に近づく方が圧倒的に早い。\n荒削りでいい。最初の一歩が全てを変える。",
    },
  ],
  // パターンB: 共感型
  [
    {
      title: "消耗の正体",
      hook: "仕事が嫌なんじゃなくて、無駄な仕事が嫌なんだと気づいた。",
      body: "締め切りに追われる感覚。\n成果が見えない会議。\n誰も読まない資料作り。\n\n消耗するのは仕事量じゃない。\n「意味を感じられない時間」の積み重ねだ。\n\nやることの意味が分かれば、\n同じ量でも疲れ方が全然違う。",
      cta: "",
      hashtags: [],
      full_post: "仕事が嫌なんじゃなくて、無駄な仕事が嫌なんだと気づいた。\n\n締め切りに追われる感覚。\n成果が見えない会議。\n誰も読まない資料作り。\n\n消耗するのは仕事量じゃない。\n「意味を感じられない時間」の積み重ねだ。",
    },
    {
      title: "比較疲れ",
      hook: "他人と比べてしまう夜は、スマホを置くことにしている。",
      body: "あの人はもう独立した。\nこの人はもう結果を出している。\n\nタイムラインを見るたびに\n焦りだけが積み重なる。\n\n比較は参考にする分だけでいい。\n自分の昨日と今日だけ見ていれば十分だ。\n\n他人のペースで生きると、\n自分のゴールを見失う。",
      cta: "",
      hashtags: [],
      full_post: "他人と比べてしまう夜は、スマホを置くことにしている。\n\nあの人はもう独立した。\nこの人はもう結果を出している。\n\n比較は参考にする分だけでいい。\n自分の昨日と今日だけ見ていれば十分だ。",
    },
    {
      title: "返信しない勇気",
      hook: "即レスをやめたら、仕事の質が上がった。",
      body: "通知が来るたびに手を止めていた。\n\nメール、Slack、DM。\n全部すぐ返さなきゃと思っていた。\n\nでも実際は、\n90%は1時間後に返しても何も困らない。\n\n「すぐ返す」は丁寧さじゃなく、\n集中力を切り売りしているだけだった。",
      cta: "",
      hashtags: [],
      full_post: "即レスをやめたら、仕事の質が上がった。\n\n通知が来るたびに手を止めていた。\n\n実際は、90%は1時間後に返しても何も困らない。\n\n「すぐ返す」は丁寧さじゃなく、集中力を切り売りしているだけだった。",
    },
  ],
  // パターンC: データ・結論先出し型
  [
    {
      title: "朝の30分の価値",
      hook: "朝の30分は、夜の2時間より価値がある。",
      body: "脳のゴールデンタイムは起床後2〜3時間。\n\nこの時間に重要な作業を入れると\n同じタスクが通常の1/3の時間で終わる、\nという研究結果がある。\n\n夜遅くまで頑張るより、\n朝を制した方が圧倒的に生産性が高い。\n\n試す価値は十分ある。",
      cta: "",
      hashtags: [],
      full_post: "朝の30分は、夜の2時間より価値がある。\n\n脳のゴールデンタイムは起床後2〜3時間。\nこの時間に重要な作業を入れると同じタスクが通常の1/3の時間で終わる。\n\n夜遅くまで頑張るより、朝を制した方が圧倒的に生産性が高い。",
    },
    {
      title: "アウトプットの複利",
      hook: "週3回発信を1年続けると、150本以上のコンテンツになる。",
      body: "1本あたり30分かけたとして、\n合計75時間の投資。\n\nでもその150本が積み上がると、\n・検索流入\n・信頼の蓄積\n・問い合わせの増加\nが複利で効いてくる。\n\n発信はコストじゃなく、資産形成だ。",
      cta: "今週、何本出せそうですか？",
      hashtags: [],
      full_post: "週3回発信を1年続けると、150本以上のコンテンツになる。\n\n合計75時間の投資が、検索流入・信頼の蓄積・問い合わせ増加として複利で効いてくる。\n\n発信はコストじゃなく、資産形成だ。\n\n今週、何本出せそうですか？",
    },
    {
      title: "スキル習得の現実",
      hook: "新しいスキルの習得に必要な時間は、思ったより短い。",
      body: "「1万時間の法則」が一人歩きしすぎている。\n\nプロレベルに達するには確かに時間がかかる。\nでも「実用レベル」なら、\n集中した20時間で到達できる分野が多い。\n\n最初の20時間を越えれば、\n後は経験が加速させてくれる。\n\n始めない理由に「時間」を使うのは勿体ない。",
      cta: "",
      hashtags: [],
      full_post: "新しいスキルの習得に必要な時間は、思ったより短い。\n\n「実用レベル」なら集中した20時間で到達できる分野が多い。\n\n最初の20時間を越えれば、後は経験が加速させてくれる。\n始めない理由に「時間」を使うのは勿体ない。",
    },
  ],
  // パターンD: 体験談型
  [
    {
      title: "失敗から学んだこと",
      hook: "3年前、私は「忙しいこと」を誇りにしていた。",
      body: "予定はパンパン。返信は即レス。\n常に何かをこなしていた。\n\nでも振り返ると、\n何も積み上がっていなかった。\n\n忙しさは充実感を演出するが、\n本質的な前進とは別の話だ。\n\n今は「何を削るか」を先に決めてから\n一日をスタートする。",
      cta: "",
      hashtags: [],
      full_post: "3年前、私は「忙しいこと」を誇りにしていた。\n\n予定はパンパン。返信は即レス。常に何かをこなしていた。\n\nでも振り返ると、何も積み上がっていなかった。\n\n今は「何を削るか」を先に決めてから一日をスタートする。",
    },
    {
      title: "転機の瞬間",
      hook: "副業を始めた日、会社での立場が変わった。",
      body: "収入源が1つしかないと、\n仕事への依存度が上がる。\n\n「嫌でも辞められない」という感覚が、\n少しずつ判断を歪めていた。\n\n副業で月3万円入るようになった日、\n初めて「会社に選ばれる側」から\n「選ぶ側」になれた気がした。\n\n金額より、心理的安全性の変化が大きかった。",
      cta: "",
      hashtags: [],
      full_post: "副業を始めた日、会社での立場が変わった。\n\n収入源が1つしかないと、「嫌でも辞められない」感覚が判断を歪める。\n\n副業で月3万円入るようになった日、初めて「選ぶ側」になれた気がした。\n金額より、心理的安全性の変化が大きかった。",
    },
    {
      title: "習慣化に成功した方法",
      hook: "習慣が続かない本当の理由は、意志力ではなかった。",
      body: "筋トレを3回挫折した。\n読書習慣も続かなかった。\n\n原因を調べたら「環境設計」の問題だと分かった。\n\n・ジムウェアをベッド脇に置く\n・本を枕元に置く\n・スマホを別の部屋に置く\n\nやる気に頼らず、\n構造で行動を引き出す。\nこれだけで変わった。",
      cta: "",
      hashtags: [],
      full_post: "習慣が続かない本当の理由は、意志力ではなかった。\n\n3回挫折して気づいたのは「環境設計」の問題。\n\nジムウェアをベッド脇に置く。本を枕元に置く。スマホを別の部屋に置く。\n\nやる気に頼らず、構造で行動を引き出す。これだけで変わった。",
    },
  ],
];

function getMockResponse(input?: GeneratePostInput): GeneratePostResponse {
  // トーン・テーマのハッシュで毎回違うパターンを選ぶ
  const seed = (input?.topic ?? "") + (input?.tone ?? "") + Date.now();
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pool = MOCK_POOL[hash % MOCK_POOL.length];

  // プール内の3案をシャッフル
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  return {
    results: shuffled,
    model: "mock",
    usage: { input_tokens: 0, output_tokens: 0 },
  };
}

const patternPool = [
  "共感型",
  "逆張り型",
  "アルゴリズム型",
  "データ型",
  "失敗談型",
  "比較型",
  "暴露型",
  "ストーリー型",
  "チェックリスト型",
  "結論先出し型",
];

function pickRandomItems<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];

  while (copy.length && result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}
