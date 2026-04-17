export interface StatBlockProps {
  label: string;
  value: string | number;
  tone?: "default" | "primary" | "moss" | "destructive";
}

export const StatBlock = ({ label, value, tone = "default" }: StatBlockProps) => {
  const c =
    tone === "primary"
      ? "text-primary"
      : tone === "moss"
        ? "text-[hsl(150_32%_42%)]"
        : tone === "destructive"
          ? "text-destructive"
          : "text-[hsl(38_32%_92%)]";
  return (
    <div className="text-center p-4 rounded-xl border border-border bg-background/40">
      <p className={`font-display text-3xl ${c} leading-none`}>{value}</p>
      <p className="text-[10px] font-mono-soft uppercase tracking-widest text-muted-foreground mt-2">
        {label}
      </p>
    </div>
  );
};
