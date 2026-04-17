import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "../ui/button";

export const LogsHeader = ({ onReload }: { onReload: () => void }) => {
  const [, navigate] = useLocation();

  return (
    <header className="w-full flex flex-col lg:flex-row lg:items-end lg:justify-between ">
      <div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-xs font-mono-soft uppercase tracking-widest text-muted-foreground hover:text-primary mb-3"
        >
          <ArrowLeft className="size-3.5" />
          voltar ao dashboard
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-destructive/15 grid place-items-center">
            <ShieldAlert className="size-5 text-destructive" />
          </div>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.3em] text-destructive">
            área administrativa
          </p>
        </div>

        <h1 className="font-display text-4xl text-[hsl(38_32%_92%)]">
          Logs de <span className="italic text-primary">auditoria</span>
        </h1>
      </div>

      <Button onClick={onReload} variant="outline" className="h-11 px-5 gap-2">
        <RefreshCw className="size-4" />
        Atualizar
      </Button>
    </header>
  );
}