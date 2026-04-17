import { ArrowUpRight } from "lucide-react";

export interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
  onClick: () => void;
  tone: "primary" | "moss" | "destructive";
}

const toneStyles: Record<ActionCardProps["tone"], { ring: string; iconBg: string; iconText: string }> = {
  primary: {
    ring: "border-[hsl(22_82%_52%/0.30)] hover:border-[hsl(22_82%_52%/0.60)]",
    iconBg: "bg-[hsl(22_82%_52%/0.12)]",
    iconText: "text-primary",
  },
  moss: {
    ring: "border-[hsl(150_32%_42%/0.30)] hover:border-[hsl(150_32%_42%/0.60)]",
    iconBg: "bg-[hsl(150_32%_42%/0.15)]",
    iconText: "text-[hsl(150_32%_42%)]",
  },
  destructive: {
    ring: "border-[hsl(8_75%_55%/0.30)] hover:border-[hsl(8_75%_55%/0.60)]",
    iconBg: "bg-[hsl(8_75%_55%/0.12)]",
    iconText: "text-destructive",
  },
};

export const ActionCard = ({ title, description, icon: Icon, cta, onClick, tone }: ActionCardProps) => {
  const t = toneStyles[tone];
  return (
    <button
      onClick={onClick}
      className={`group surface rounded-2xl border ${t.ring} p-6 text-left transition-all hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className={`size-11 rounded-xl grid place-items-center ${t.iconBg}`}>
          <Icon className={`size-5 ${t.iconText}`} />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
      <h3 className="font-display text-xl text-[hsl(38_32%_92%)] mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <span className="text-xs font-mono-soft uppercase tracking-widest text-primary">{cta} →</span>
    </button>
  );
};
