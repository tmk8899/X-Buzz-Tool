interface NeonBadgeProps {
  children: React.ReactNode;
  color?: "blue" | "purple" | "cyan" | "green" | "red";
}

const colorMap = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  red: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function NeonBadge({ children, color = "blue" }: NeonBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[color]}`}
    >
      {children}
    </span>
  );
}
