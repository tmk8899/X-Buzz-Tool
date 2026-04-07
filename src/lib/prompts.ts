import type { GeneratePostInput } from "@/types/generate";

const TONE_LABELS: Record<string, string> = {
  casual:   "カジュアル（親しみやすく、絵文字を適度に使い、話し言葉）",
  expert:   "専門家（権威ある口調、データや根拠を示す）",
  story:    "ストーリー（個人の体験談・感情を込めた物語形式）",
  list:     "リスト型（番号付きリスト・箇条書きで読みやすく）",
  question: "問いかけ（読者への共感・問いかけを重視）",
  shock:    "インパクト（冒頭で驚かせ、最後まで読ませる）",
};

export function buildGeneratePrompt(input: GeneratePostInput): string {
  const tone = TONE_LABELS[input.tone] ?? input.tone;
  const ctaText = input.hasCta
    ? "あり（コメント・RT・フォローを促す一文や問いかけを末尾に入れる）"
    : "なし（CTAは含めない）";
  const charLimit = input.maxChars ?? 140;
  const personaNote = input.persona
    ? `名前: ${input.persona.name}\nトーン補足: ${input.persona.tone ?? "指定なし"}\n得意トピック: ${(input.persona.topics ?? []).join("、")}`
    : "特になし";

  return `あなたはX投稿のプロ編集者です。
以下の条件をもとに、反応が取りやすい日本語の短文投稿を3案作成してください。

条件:
- テーマ: ${input.topic}
- ターゲット: ${input.target}
- 目的: ${input.purpose}
- 文体: ${tone}
- 文字数目安: ${charLimit}文字前後（ハッシュタグ含まず）
- CTA: ${ctaText}
- ペルソナ情報:\n${personaNote}

出力ルール:
- 1案ずつ見出し付き
- 冒頭1行は強いフック
- 改行を活用
- 読みやすさ重視
- 抽象論で終わらず具体性を入れる
- 日本のXユーザー向けの自然な言い回し

【出力形式】
必ず以下のJSON配列のみを返してください。前後に説明文や \`\`\` は含めないこと。

[
  {
    "title": "見出し（案1のタイトル、30文字以内）",
    "hook": "冒頭フック（最初の1〜2文。読者を強く引きつける）",
    "body": "本文（改行は\\nで表現。具体性を含む）",
    "cta": "CTA文（CTAなしの場合は空文字列\"\"）",
    "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "ハッシュタグ3"],
    "full_post": "hook\\n\\nbody\\n\\ncta を結合した完全な投稿文"
  },
  { ... },
  { ... }
]`;
}
