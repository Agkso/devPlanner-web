import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen relative grid place-items-center p-4 overflow-hidden">
      <div className="absolute -top-32 -left-32 size-[28rem] rounded-full bg-[hsl(22_82%_52%/0.15)] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-[28rem] rounded-full bg-[hsl(150_32%_42%/0.15)] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
      <div className="absolute inset-0 copper-grid opacity-30 pointer-events-none" />

      <div className="relative text-center max-w-lg animate-fade-in">
        <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-[hsl(22_82%_52%/0.10)] border border-[hsl(22_82%_52%/0.25)] mb-6">
          <Compass className="size-9 text-primary" />
        </div>

        <p className="font-mono-soft text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
          erro 404
        </p>
        <h1 className="font-display text-6xl lg:text-7xl text-[hsl(38_32%_92%)] mb-4 text-balance leading-none">
          Caminho <span className="italic text-primary">perdido</span>.
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          A página que você procura não existe ou foi movida para outro endereço.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => navigate("/")}
            className="h-11 px-6 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] ring-copper gap-2"
          >
            <Home className="size-4" />
            Voltar ao início
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="h-11 px-6 border-border bg-card"
          >
            ← Página anterior
          </Button>
        </div>

        <p className="mt-12 text-[10px] font-mono-soft text-muted-foreground/60 uppercase tracking-widest">
          devPlanner v1.0
        </p>
      </div>
    </div>
  );
}
