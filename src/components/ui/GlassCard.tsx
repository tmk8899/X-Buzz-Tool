import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "none";
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "none",
}: GlassCardProps) {
  const glowClass =
    glowColor === "blue"
      ? "glow-blue"
      : glowColor === "purple"
        ? "glow-purple"
        : "";

  return (
    <div
      className={`glass rounded-xl p-5 transition-all duration-200 hover:border-white/[0.12] ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
