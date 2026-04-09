import { redirect } from "next/navigation";

// 旧ページ → 新ペルソナ設定ページへリダイレクト
export default function CharacterPage() {
  redirect("/persona");
}
