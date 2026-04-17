import { useAuth } from "../hooks/useAuth";
import { DashboardLayout } from "../components/DashboardLayout";
import { PrivateRoute } from "../components/PrivateRoute";
import { Button } from "../components/ui/button";
import {
  ArrowUpRight,
  BarChart3,
  CheckSquare2,
  FolderPlus,
  Sparkles,
} from "lucide-react";
import { useLocation } from "wouter";

interface ActionCardProps {
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

const ActionCard = ({ title, description, icon: Icon, cta, onClick, tone }: ActionCardProps) => {
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

const StatBlock = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "primary" | "moss" | "destructive";
}) => {
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

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="space-y-10">
          {/* Hero */}
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-mono-soft text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                {today}
              </p>
              <h1 className="font-display text-4xl lg:text-5xl text-[hsl(38_32%_92%)] text-balance leading-[1.05]">
                Bem-vindo,{" "}
                <span className="italic text-primary">{user?.name?.split(" ")[0] || "dev"}</span>.
                <br />
                Pronto para <span className="underline decoration-[hsl(22_82%_52%/0.40)] decoration-4 underline-offset-4">organizar</span> o dia?
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Gerencie seus projetos e tarefas com a metodologia Kanban. Tudo em um painel só.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full bg-[hsl(22_82%_52%/0.10)] border border-[hsl(22_82%_52%/0.25)]">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-[10px] font-mono-soft uppercase tracking-[0.18em] text-primary">
                {user?.role === "Admin" ? "modo admin" : "modo padrão"}
              </span>
            </div>
          </header>

          {/* Action grid */}
          <div className={`grid grid-cols-1 ${user?.role === "Admin" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5`}>
            <ActionCard
              title="Novo projeto"
              description="Crie um espaço para organizar suas tarefas com Kanban."
              icon={FolderPlus}
              cta="Criar projeto"
              tone="primary"
              onClick={() => navigate("/projects")}
            />
            <ActionCard
              title="Minhas tarefas"
              description="Visualize, edite e atualize o status de todas as suas tarefas."
              icon={CheckSquare2}
              cta="Ver tarefas"
              tone="moss"
              onClick={() => navigate("/tasks")}
            />
            {user?.role === "Admin" && (
              <ActionCard
                title="Logs de auditoria"
                description="Acompanhe todas as ações realizadas no sistema."
                icon={BarChart3}
                cta="Ver logs"
                tone="destructive"
                onClick={() => navigate("/admin/logs")}
              />
            )}
          </div>

          {/* About + stats */}
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
                  devPlanner é uma ferramenta para gerenciar projetos e tarefas usando a
                  metodologia Kanban. Interface intuitiva, recursos avançados e foco em
                  produtividade — para você ou seu time.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Kanban", "Time real", "Multi-projeto", "Auditoria"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono-soft border border-border bg-background/60 text-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  onClick={() => navigate("/projects")}
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
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
