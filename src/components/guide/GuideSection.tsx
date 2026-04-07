interface GuideSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function GuideSection({ title, children }: GuideSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#4f8ef7" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
