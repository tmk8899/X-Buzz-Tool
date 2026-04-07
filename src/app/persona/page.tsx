"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PersonaCard from "@/components/persona/PersonaCard";
import { dummyCharacters } from "@/lib/dummy-data";

export default function PersonaPage() {
  const [characters, setCharacters] = useState(dummyCharacters);

  const handleSelect = (id: string) => {
    setCharacters((prev) =>
      prev.map((c) => ({ ...c, isActive: c.id === id }))
    );
  };

  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="ペルソナ設定"
        description="投稿キャラクターのトーンとスタイルを管理"
        actions={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
              color: "white",
              boxShadow: "0 0 16px rgba(79,142,247,0.3)",
            }}
          >
            <Plus size={15} />
            新規ペルソナ
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {characters.map((char) => (
          <PersonaCard
            key={char.id}
            character={char}
            onSelect={() => handleSelect(char.id)}
            onEdit={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
