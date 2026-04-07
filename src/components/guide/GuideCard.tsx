import { LucideIcon } from "lucide-react";

interface GuideCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function GuideCard({
  step,
  title,
  description,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}: GuideCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex gap-4"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span
          className="text-xs font-bold"
          style={{ color }}
        >
          {String(step).padStart(2, "0")}
        </span>
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
