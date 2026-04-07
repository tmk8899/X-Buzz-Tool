import GlassCard from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string | number;
  growth?: number;
  icon: string;
  glowColor?: "blue" | "purple" | "none";
}

export default function StatCard({
  label,
  value,
  growth,
  icon,
  glowColor = "none",
}: StatCardProps) {
  const isPositive = growth !== undefined && growth >= 0;

  return (
    <GlassCard glowColor={glowColor} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {growth !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-red-400 bg-red-500/10"
            }`}
          >
            {isPositive ? "+" : ""}
            {growth.toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </GlassCard>
  );
}
