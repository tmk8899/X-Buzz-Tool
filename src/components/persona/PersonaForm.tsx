"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { Character } from "@/types";

interface PersonaFormProps {
  initial?: Character;
  onSave: (character: Character) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = ["🧑‍💻", "👨‍💼", "👩‍💼", "🎯", "🚀", "💡", "🔥", "⚡", "🌟", "😎"];

export default function PersonaForm({ initial, onSave, onClose }: PersonaFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tone, setTone] = useState(initial?.tone ?? "");
  const [avatar, setAvatar] = useState(initial?.avatar ?? "🧑‍💻");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>(initial?.topics ?? []);

  const addTopic = () => {
    const t = topicInput.trim();
    if (t && !topics.includes(t)) {
      setTopics([...topics, t]);
    }
    setTopicInput("");
  };

  const removeTopic = (t: string) => setTopics(topics.filter((x) => x !== t));

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      tone: tone.trim(),
      topics,
      avatar,
      isActive: initial?.isActive ?? false,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-20"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        style={{
          background: "#0f0f1a",
          border: "1px solid rgba(79,142,247,0.25)",
          boxShadow: "0 0 40px rgba(79,142,247,0.1)",
        }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            {initial ? "ペルソナを編集" : "新規ペルソナ"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* アバター */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">アバター</label>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                style={
                  avatar === a
                    ? { background: "rgba(79,142,247,0.2)", border: "1px solid rgba(79,142,247,0.5)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* 名前 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">名前 *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：副業エンジニア"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* 説明 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">説明</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例：副業・フリーランスに特化した発信者"
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* トーン */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">トーン・スタイル</label>
          <textarea
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="例：共感重視で親しみやすい口調。難しい言葉は使わない。"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* トピック */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">トピック</label>
          <div className="flex gap-2">
            <input
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTopic()}
              placeholder="例：副業"
              className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button
              onClick={addTopic}
              className="px-3 py-3 rounded-xl transition-all hover:opacity-80"
              style={{ background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", color: "#7aa8f7" }}
            >
              <Plus size={16} />
            </button>
          </div>
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => removeTopic(t)}
                  className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-all hover:opacity-70"
                  style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#22d3ee" }}
                >
                  {t} <X size={10} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
              color: "white",
              boxShadow: "0 0 16px rgba(79,142,247,0.3)",
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
