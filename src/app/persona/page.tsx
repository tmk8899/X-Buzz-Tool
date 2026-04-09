"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PersonaCard from "@/components/persona/PersonaCard";
import PersonaForm from "@/components/persona/PersonaForm";
import { dummyCharacters } from "@/lib/dummy-data";
import type { Character } from "@/types";

export default function PersonaPage() {
  const [characters, setCharacters] = useState<Character[]>(dummyCharacters);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Character | undefined>(undefined);

  const handleSelect = (id: string) => {
    setCharacters((prev) => {
      const next = prev.map((c) => ({ ...c, isActive: c.id === id }));
      const active = next.find((c) => c.isActive);
      if (active) {
        localStorage.setItem("activePersona", JSON.stringify({ name: active.name, tone: active.tone, topics: active.topics }));
      }
      return next;
    });
  };

  const handleEdit = (character: Character) => {
    setEditTarget(character);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditTarget(undefined);
    setShowForm(true);
  };

  const handleSave = (saved: Character) => {
    setCharacters((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setShowForm(false);
    setEditTarget(undefined);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(undefined);
  };

  return (
    <div className="min-h-full p-4 lg:p-8">
      <PageHeader
        title="ペルソナ設定"
        description="投稿キャラクターのトーンとスタイルを管理"
        actions={
          <button
            onClick={handleNew}
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
            onEdit={() => handleEdit(char)}
          />
        ))}
      </div>

      {showForm && (
        <PersonaForm
          initial={editTarget}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
