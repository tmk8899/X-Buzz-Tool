"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PersonaCard from "@/components/persona/PersonaCard";
import PersonaForm from "@/components/persona/PersonaForm";
import XAccountSettings from "@/components/settings/XAccountSettings";
import { dummyCharacters } from "@/lib/dummy-data";
import type { Character } from "@/types";

const STORAGE_KEY = "personas";

function loadPersonas(): Character[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Character[];
  } catch {}
  return dummyCharacters;
}

function savePersonas(list: Character[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    const active = list.find((c) => c.isActive);
    if (active) {
      localStorage.setItem(
        "activePersona",
        JSON.stringify({ name: active.name, tone: active.tone, topics: active.topics })
      );
    }
  } catch {}
}

export default function PersonaPage() {
  const [characters, setCharacters] = useState<Character[]>(dummyCharacters);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Character | undefined>(undefined);

  // クライアント側のみlocalStorageから読み込む
  useEffect(() => {
    setCharacters(loadPersonas());
    setMounted(true);
  }, []);

  const update = (next: Character[]) => {
    setCharacters(next);
    savePersonas(next);
  };

  const handleSelect = (id: string) => {
    update(characters.map((c) => ({ ...c, isActive: c.id === id })));
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
    const idx = characters.findIndex((c) => c.id === saved.id);
    const next =
      idx >= 0
        ? characters.map((c, i) => (i === idx ? saved : c))
        : [...characters, saved];
    update(next);
    setShowForm(false);
    setEditTarget(undefined);
  };

  const handleDelete = (id: string) => {
    if (!confirm("このペルソナを削除しますか？")) return;
    update(characters.filter((c) => c.id !== id));
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(undefined);
  };

  if (!mounted) return null;

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

      <XAccountSettings />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {characters.map((char) => (
          <PersonaCard
            key={char.id}
            character={char}
            onSelect={() => handleSelect(char.id)}
            onEdit={() => handleEdit(char)}
            onDelete={() => handleDelete(char.id)}
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
