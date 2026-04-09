"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, CalendarClock, History, UserCircle2 } from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "ホーム" },
  { href: "/generate", icon: Sparkles, label: "生成" },
  { href: "/schedule", icon: CalendarClock, label: "予約" },
  { href: "/history", icon: History, label: "履歴" },
  { href: "/persona", icon: UserCircle2, label: "設定" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        background: "rgba(8,8,16,0.95)",
        borderTop: "1px solid rgba(79,142,247,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
            style={{ minWidth: 52 }}
          >
            <Icon
              size={20}
              style={{ color: isActive ? "#4f8ef7" : "#475569" }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: isActive ? "#4f8ef7" : "#475569" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
