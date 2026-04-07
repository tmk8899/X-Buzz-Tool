"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  CalendarClock,
  History,
  UserCircle2,
  BookOpen,
  Zap,
  ChevronRight,
  RefreshCw,
  BookMarked,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "ダッシュボード" },
  { href: "/generate", icon: Sparkles, label: "AI投稿生成" },
  { href: "/schedule", icon: CalendarClock, label: "予約投稿" },
  { href: "/history", icon: History, label: "投稿履歴" },
  { href: "/rewrite", icon: RefreshCw, label: "リライト" },
  { href: "/persona", icon: UserCircle2, label: "ペルソナ設定" },
  { href: "/notebook", icon: BookOpen, label: "ノートブック" },
  { href: "/guide", icon: BookMarked, label: "使い方ガイド" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col z-50"
      style={{
        background: "linear-gradient(180deg, #080810 0%, #0b0b18 100%)",
        borderRight: "1px solid rgba(79,142,247,0.12)",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-7 flex items-center gap-3 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
            boxShadow: "0 0 16px rgba(79,142,247,0.5)",
          }}
        >
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-white text-sm tracking-wide">
          X Buzz Tool
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4 h-px" style={{ background: "rgba(79,142,247,0.1)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, rgba(79,142,247,0.18), rgba(155,89,245,0.10))",
                      boxShadow: "inset 0 0 0 1px rgba(79,142,247,0.25)",
                    }
                  : {}
              }
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: "linear-gradient(180deg, #4f8ef7, #9b59f5)" }}
                />
              )}
              <Icon size={17} className={isActive ? "text-blue-400" : ""} />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight size={13} className="text-blue-400 opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mx-4 mb-4 mt-2 h-px" style={{ background: "rgba(79,142,247,0.1)" }} />
      <div className="px-5 pb-6">
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(79,142,247,0.12)",
          }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #9b59f5)" }}
          >
            👨‍💻
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">田中テック</p>
            <p className="text-[10px] text-slate-500 truncate">@tanaka_tech</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
