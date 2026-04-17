import { Sparkles } from "lucide-react";

interface HomeHeaderProps {
  userName: string | undefined;
  role: string | undefined;
  today: string;
}

export const HomeHeader = ({ userName, role, today }: HomeHeaderProps) => (
  <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
    <div>
      <p className="font-mono-soft text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
        {today}
      </p>
      <h1 className="font-display text-4xl lg:text-5xl text-[hsl(38_32%_92%)] text-balance leading-[1.05]">
        Bem-vindo,{" "}
        <span className="italic text-primary">{userName?.split(" ")[0] || "dev"}</span>.
        <br />
        Pronto para{" "}
        <span className="underline decoration-[hsl(22_82%_52%/0.40)] decoration-4 underline-offset-4">
          organizar
        </span>{" "}
        o dia?
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl">
        Gerencie seus projetos e tarefas com a metodologia Kanban. Tudo em um painel só.
      </p>
    </div>
    <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full bg-[hsl(22_82%_52%/0.10)] border border-[hsl(22_82%_52%/0.25)]">
      <Sparkles className="size-3.5 text-primary" />
      <span className="text-[10px] font-mono-soft uppercase tracking-[0.18em] text-primary">
        {role === "Admin" ? "modo admin" : "modo padrão"}
      </span>
    </div>
  </header>
);
