import { Button } from "../ui/button";
import { StatBlock } from "./StatBlock";

interface HomeAboutSectionProps {
  onNavigate: () => void;
}

const TAGS = ["Kanban", "Time real", "Multi-projeto", "Auditoria"];

export const HomeAboutSection = ({ onNavigate }: HomeAboutSectionProps) => (
  <section className="surface rounded-3xl border border-border p-7 lg:p-9 relative overflow-hidden">
    <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
    <div className="absolute -top-20 -right-20 size-64 rounded-full bg-[hsl(22_82%_52%/0.10)] blur-3xl pointer-events-none" />
    <div className="relative grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-primary mb-2">
          sobre
        </p>
        <h2 className="font-display text-3xl text-[hsl(38_32%_92%)] mb-4 text-balance">
          Uma plataforma <span className="italic text-primary">moderna</span> para organizar projetos.
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          devPlanner é uma ferramenta para gerenciar projetos e tarefas usando a metodologia Kanban.
          Interface intuitiva, recursos avançados e foco em produtividade — para você ou seu time.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono-soft border border-border bg-background/60 text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button
          onClick={onNavigate}
          className="mt-6 h-10 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] ring-copper"
        >
          Começar agora →
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatBlock label="projetos" value={0} tone="primary" />
        <StatBlock label="tarefas" value={0} tone="moss" />
        <StatBlock label="concluídas" value={0} />
        <StatBlock label="pendentes" value={0} tone="destructive" />
      </div>
    </div>
  </section>
);
