import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { PrivateRoute } from "../components/PrivateRoute";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ArrowLeft, Loader2, RefreshCw, Search, ShieldAlert } from "lucide-react";
import api from "../services/api";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface AuditLogUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}
interface AuditLog {
  _id: string;
  user: AuditLogUser;
  action: string;
  details: Record<string, any>;
  resource: string;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
}

const actionTone = (action: string) => {
  switch (action) {
    case "CREATE":
      return "bg-[hsl(150_32%_42%/0.15)] text-[hsl(150_32%_42%)] border-[hsl(150_32%_42%/0.30)]";
    case "UPDATE":
      return "bg-[hsl(22_82%_52%/0.15)] text-primary border-[hsl(22_82%_52%/0.30)]";
    case "DELETE":
      return "bg-destructive/15 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/logs");
      setLogs(response.data);
    } catch (error) {
      toast.error("Erro ao carregar logs");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("pt-BR");

  return (
    <PrivateRoute requiredRole="Admin">
      <DashboardLayout>
        <div className="space-y-8">
          {/* Hero */}
          <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-xs font-mono-soft uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-3"
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
              <h1 className="font-display text-4xl text-[hsl(38_32%_92%)] text-balance">
                Logs de <span className="italic text-primary">auditoria</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Todas as ações registradas no sistema, em ordem cronológica.
              </p>
            </div>

            <Button
              onClick={loadLogs}
              variant="outline"
              className="h-11 px-5 border-border bg-card hover:border-[hsl(22_82%_52%/0.40)] gap-2"
            >
              <RefreshCw className="size-4" />
              Atualizar
            </Button>
          </header>

          {/* Filter + counter */}
          <div className="surface rounded-2xl border border-border p-5 flex flex-col md:flex-row md:items-center gap-4">
            <label className="flex items-center gap-3 px-3 h-11 rounded-md bg-background/60 border border-border focus-within:border-[hsl(22_82%_52%/0.40)] flex-1">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por usuário, ação ou recurso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground/60"
              />
            </label>
            <div className="flex items-center gap-2 text-xs font-mono-soft text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>
                {filteredLogs.length} de {logs.length} registros
              </span>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="surface rounded-3xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">Nenhum log encontrado.</p>
            </div>
          ) : (
            <div className="surface rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto scroll-fancy">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-mono-soft text-[10px] uppercase tracking-widest text-muted-foreground">
                        Usuário
                      </TableHead>
                      <TableHead className="font-mono-soft text-[10px] uppercase tracking-widest text-muted-foreground">
                        Ação
                      </TableHead>
                      <TableHead className="font-mono-soft text-[10px] uppercase tracking-widest text-muted-foreground">
                        Recurso
                      </TableHead>
                      <TableHead className="font-mono-soft text-[10px] uppercase tracking-widest text-muted-foreground">
                        ID
                      </TableHead>
                      <TableHead className="font-mono-soft text-[10px] uppercase tracking-widest text-muted-foreground">
                        Quando
                      </TableHead>
                      <TableHead className="font-mono-soft text-[10px] uppercase tracking-widest text-muted-foreground">
                        Detalhes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log._id} className="border-border hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-gradient-to-br from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] grid place-items-center text-[10px] font-mono-soft text-[hsl(38_45%_96%)]">
                              {log.user.name
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-[hsl(38_32%_92%)] truncate">
                                {log.user.name}
                              </p>
                              <p className="text-[10px] font-mono-soft text-muted-foreground truncate">
                                {log.user.role}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-soft font-bold tracking-wider border ${actionTone(
                              log.action,
                            )}`}
                          >
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {log.resource}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono-soft text-[10px] text-muted-foreground">
                            {log.resourceId.slice(-8)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <details className="cursor-pointer group/details">
                            <summary className="text-xs text-primary hover:underline list-none flex items-center gap-1">
                              <span className="group-open/details:rotate-90 transition-transform">
                                ›
                              </span>
                              Ver
                            </summary>
                            <pre className="mt-2 p-3 bg-background/60 rounded-md text-[10px] font-mono-soft overflow-auto max-h-32 border border-border text-foreground/80 scroll-fancy">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
