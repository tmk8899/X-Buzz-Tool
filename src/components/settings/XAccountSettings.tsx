"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";

interface XAccountConfig {
  username: string;
  bearerToken: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

const EMPTY: XAccountConfig = {
  username: "",
  bearerToken: "",
  apiKey: "",
  apiSecret: "",
  accessToken: "",
  accessTokenSecret: "",
};

function MaskedInput({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  const isSensitive = label !== "Xユーザー名";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-400">{label}</label>
        {isSensitive && (
          <button
            onClick={() => setShow(!show)}
            className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            {show ? "隠す" : "表示"}
          </button>
        )}
      </div>
      <input
        type={isSensitive && !show ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      />
      {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
    </div>
  );
}

export default function XAccountSettings() {
  const [config, setConfig] = useState<XAccountConfig>(EMPTY);
  const [saved, setSaved] = useState(false);
  const isConnected = !!config.bearerToken;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("xAccountConfig");
      if (stored) setConfig(JSON.parse(stored));
    } catch {}
  }, []);

  const handleSave = () => {
    localStorage.setItem("xAccountConfig", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (key: keyof XAccountConfig) => (v: string) =>
    setConfig((prev) => ({ ...prev, [key]: v }));

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5 mb-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(79,142,247,0.15)",
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
            style={{ background: "rgba(29,161,242,0.12)", border: "1px solid rgba(29,161,242,0.25)" }}
          >
            𝕏
          </div>
          <div>
            <p className="text-sm font-bold text-white">Xアカウント設定</p>
            <p className="text-[11px] text-slate-500 mt-0.5">APIキーを入力して連携準備</p>
          </div>
        </div>
        <span
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={
            isConnected
              ? { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }
              : { background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }
          }
        >
          {isConnected ? "設定済み" : "未設定"}
        </span>
      </div>

      {/* フォーム */}
      <div className="flex flex-col gap-4">
        <MaskedInput
          label="Xユーザー名"
          value={config.username}
          onChange={set("username")}
          placeholder="例：@your_handle"
        />
        <MaskedInput
          label="Bearer Token"
          value={config.bearerToken}
          onChange={set("bearerToken")}
          placeholder="AAAA..."
          hint="X Developer Portal → Project → Bearer Token"
        />
        <MaskedInput
          label="API Key"
          value={config.apiKey}
          onChange={set("apiKey")}
          placeholder="API Key"
        />
        <MaskedInput
          label="API Secret"
          value={config.apiSecret}
          onChange={set("apiSecret")}
          placeholder="API Key Secret"
        />
        <MaskedInput
          label="Access Token"
          value={config.accessToken}
          onChange={set("accessToken")}
          placeholder="Access Token"
        />
        <MaskedInput
          label="Access Token Secret"
          value={config.accessTokenSecret}
          onChange={set("accessTokenSecret")}
          placeholder="Access Token Secret"
        />
      </div>

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
        style={{
          background: saved
            ? "linear-gradient(135deg, #34d399, #059669)"
            : "linear-gradient(135deg, #4f8ef7, #9b59f5)",
          color: "white",
          boxShadow: "0 0 16px rgba(79,142,247,0.25)",
        }}
      >
        {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
        {saved ? "保存しました！" : "保存する"}
      </button>

      {/* 注意書き */}
      <p className="text-[10px] text-slate-500 text-center">
        APIキーはこのデバイスのみに保存されます。サーバーには送信されません。
      </p>
    </div>
  );
}
