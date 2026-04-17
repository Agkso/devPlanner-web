import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";

export default function Login() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen relative grid place-items-center p-4 overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute -top-32 -left-32 size-[28rem] rounded-full bg-[hsl(22_82%_52%/0.18)] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-[28rem] rounded-full bg-[hsl(150_32%_42%/0.18)] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grain opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md grid grid-cols-1 gap-6 animate-fade-in">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="size-11 rounded-md grid place-items-center rotate-3 bg-gradient-to-br from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] shadow-[0_8px_28px_-8px_hsl(22_82%_52%/0.6)]">
              <span className="font-display text-[hsl(38_45%_96%)] text-2xl font-semibold leading-none -mt-0.5">
                d
              </span>
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-[hsl(38_32%_92%)]">
              devPlanner
            </span>
          </div>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.3em] text-primary">
            entrar na conta
          </p>
          <h1 className="font-display text-3xl text-[hsl(38_32%_92%)] text-balance">
            Bom retorno ao seu <span className="italic text-primary">painel</span>.
          </h1>
        </div>

        {/* Card */}
        <div className="surface rounded-3xl border border-border p-7 relative overflow-hidden">
          <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
          <form onSubmit={handleSubmit} className="relative space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-xs font-mono-soft uppercase tracking-widest text-muted-foreground">
                <Mail className="size-3.5" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-background/60 border-border focus-visible:border-[hsl(22_82%_52%/0.50)]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2 text-xs font-mono-soft uppercase tracking-widest text-muted-foreground">
                  <Lock className="size-3.5" />
                  Senha
                </Label>
                <button type="button" className="text-[10px] font-mono-soft text-primary hover:underline">
                  esqueci
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-background/60 border-border focus-visible:border-[hsl(22_82%_52%/0.50)]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-2">
                <span className="font-mono-soft text-xs mt-0.5">!</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] hover:opacity-95 text-[hsl(38_45%_96%)] font-medium ring-copper"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar →"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2 border-t border-border">
              <span className="block pt-3">
                Ainda não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-primary hover:underline font-medium"
                >
                  Crie uma agora
                </button>
              </span>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono-soft text-muted-foreground/60 uppercase tracking-widest">
          devPlanner v1.0 · cultivado com cuidado
        </p>
      </div>
    </div>
  );
}
