
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PrivateRoute } from '@/components/PrivateRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Edit2, Loader2, ArrowLeft } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'A Fazer' | 'Fazendo' | 'Feito';
  projectId: string;
  createdAt: string;
}

interface Project {
  _id: string;
  title: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: 'A Fazer' | 'Fazendo' | 'Feito';
  }>({
    title: '',
    description: '',
    status: 'A Fazer',
  });
  const [, navigate] = useLocation();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks();
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0]._id);
      }
    } catch (error) {
      toast.error('Erro ao carregar projetos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/tasks/${selectedProjectId}`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Erro ao carregar tarefas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Por favor, preencha o título da tarefa');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
        toast.success('Tarefa atualizada com sucesso!');
      } else {
        await api.post('/tasks', {
          ...formData,
          projectId: selectedProjectId,
        });
        toast.success('Tarefa criada com sucesso!');
      }

      setFormData({ title: '', description: '', status: 'A Fazer' });
      setEditingId(null);
      setIsDialogOpen(false);
      loadTasks();
    } catch (error) {
      toast.error('Erro ao salvar tarefa');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Tarefa deletada com sucesso!');
      loadTasks();
    } catch (error) {
      toast.error('Erro ao deletar tarefa');
      console.error(error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      loadTasks();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'A Fazer' });
  };

  const columns = ['A Fazer', 'Fazendo', 'Feito'] as const;
  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Kanban</h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie suas tarefas com o quadro Kanban
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingId
                      ? 'Atualize os detalhes da sua tarefa'
                      : 'Crie uma nova tarefa para seu projeto'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Nome da tarefa"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      placeholder="Descrição da tarefa"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'A Fazer' | 'Fazendo' | 'Feito') =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A Fazer">A Fazer</SelectItem>
                        <SelectItem value="Fazendo">Fazendo</SelectItem>
                        <SelectItem value="Feito">Feito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingId ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-4">
              <Label htmlFor="project">Projeto:</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center mb-4">
                  Nenhum projeto criado. Crie um projeto primeiro!
                </p>
                <Button onClick={() => navigate('/projects')}>
                  Ir para Projetos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((status) => (
                <div key={status} className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h2 className="font-semibold text-foreground">{status}</h2>
                    <p className="text-sm text-muted-foreground">
                      {getTasksByStatus(status).length} tarefa(s)
                    </p>
                  </div>

                  <div className="space-y-3">
                    {getTasksByStatus(status).map((task) => (
                      <Card
                        key={task._id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {task.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {task.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Select
                            value={task.status}
                            onValueChange={(newStatus) =>
                              handleStatusChange(task._id, newStatus)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A Fazer">A Fazer</SelectItem>
                              <SelectItem value="Fazendo">Fazendo</SelectItem>
                              <SelectItem value="Feito">Feito</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(task)}
                              className="flex-1 h-8 text-xs gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(task._id)}
                              className="flex-1 h-8 text-xs gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Deletar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
