import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [, navigate] = useLocation();

  // Carregar logs
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/logs');
      setLogs(response.data);
    } catch (error) {
      toast.error('Erro ao carregar logs');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PrivateRoute requiredRole="Admin">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Logs de Auditoria
                </h1>
                <p className="text-muted-foreground mt-2">
                  Visualize todas as ações do sistema
                </p>
              </div>
            </div>

            <Button
              onClick={loadLogs}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="search">Buscar por usuário, ação ou recurso</Label>
                <Input
                  id="search"
                  placeholder="Digite para filtrar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">
                  Nenhum log encontrado.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {filteredLogs.length} Log(s) de Auditoria
                </CardTitle>
                <CardDescription>
                  Últimas ações registradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Recurso</TableHead>
                        <TableHead>ID do Recurso</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log._id}>
                          <TableCell className="font-medium">
                            {log.userName}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(
                                log.action
                              )}`}
                            >
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {log.resourceId}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(log.timestamp)}
                          </TableCell>
                          <TableCell className="text-xs">
                            <details className="cursor-pointer">
                              <summary className="text-primary hover:underline">
                                Ver detalhes
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
