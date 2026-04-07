export interface GeneratePersonaContext {
  name: string;
  tone?: string;
  topics?: string[];
}

export interface GeneratePostInput {
  topic: string;
  target: string;
  purpose: string;
  tone: string;
  maxChars: number;
  hasCta: boolean;
  persona?: GeneratePersonaContext; // ペルソナ設定（任意）
  customInstruction?: string;
}

export interface GeneratedPostResult {
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  full_post: string;
}

export interface GeneratePostResponse {
  results: GeneratedPostResult[];
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
