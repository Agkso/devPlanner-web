import { useAuth } from '../hooks/useAuth';
import { DashboardLayout } from '../components/DashboardLayout';
import { PrivateRoute } from '../components/PrivateRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FolderPlus, CheckSquare2, BarChart3 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bem-vindo, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus projetos e tarefas com facilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-primary" />
                  Novo Projeto
                </CardTitle>
                <CardDescription>
                  Crie um novo projeto para organizar suas tarefas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate('/projects')}
                  className="w-full"
                  variant="outline"
                >
                  Criar Projeto
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare2 className="w-5 h-5 text-accent" />
                  Minhas Tarefas
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as suas tarefas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate('/tasks')}
                  className="w-full"
                  variant="outline"
                >
                  Ver Tarefas
                </Button>
              </CardContent>
            </Card>

            {user?.role === 'Admin' && (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-destructive" />
                    Logs de Auditoria
                  </CardTitle>
                  <CardDescription>
                    Visualize todas as ações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate('/admin/logs')}
                    className="w-full"
                    variant="outline"
                  >
                    Ver Logs
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sobre Dev Planner</CardTitle>
              <CardDescription>
                Uma plataforma moderna para gerenciar seus projetos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/80">
                Dev Planner é uma ferramenta poderosa para gerenciar seus projetos e tarefas usando a metodologia Kanban. Com uma interface intuitiva e recursos avançados, você pode aumentar sua produtividade e colaborar melhor com sua equipe.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-xs text-muted-foreground">Projetos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">0</p>
                  <p className="text-xs text-muted-foreground">Tarefas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">0</p>
                  <p className="text-xs text-muted-foreground">Concluídas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">0</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
