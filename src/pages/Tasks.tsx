import React, { useEffect, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { PrivateRoute } from "../components/PrivateRoute";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Edit2,
  Loader2,
  Plus,
  Timer,
  Trash2,
} from "lucide-react";
import api from "../services/api";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"; import { KanbanColumn } from "../components/tasks/KanbanColumn";
import { useKanbanDnD } from "../hooks/task/useKanban";

type Status = "A Fazer" | "Fazendo" | "Feito";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: Status;
  projectId: string;
  createdAt: string;
}
interface Project {
  _id: string;
  title: string;
}

const COLUMNS: { status: Status; subtitle: string; icon: React.ComponentType<{ className?: string }>; tone: "muted" | "copper" | "moss" }[] = [
  { status: "A Fazer", subtitle: "aguardando", icon: CircleDashed, tone: "muted" },
  { status: "Fazendo", subtitle: "em progresso", icon: Timer, tone: "copper" },
  { status: "Feito", subtitle: "concluídas", icon: CheckCircle2, tone: "moss" },
];

const toneClasses: Record<"muted" | "copper" | "moss", { dot: string; counter: string; border: string; iconColor: string }> = {
  muted: {
    dot: "bg-muted-foreground/40",
    counter: "bg-muted text-muted-foreground border-border",
    border: "border-l-border",
    iconColor: "text-muted-foreground",
  },
  copper: {
    dot: "bg-primary shadow-[0_0_10px_hsl(22_82%_52%)]",
    counter: "bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] border-transparent",
    border: "border-l-primary",
    iconColor: "text-primary",
  },
  moss: {
    dot: "bg-[hsl(150_32%_42%)]",
    counter: "bg-[hsl(150_32%_42%/0.20)] text-[hsl(150_32%_42%)] border-[hsl(150_32%_42%/0.30)]",
    border: "border-l-[hsl(150_32%_42%)]",
    iconColor: "text-[hsl(150_32%_42%)]",
  },
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ title: string; description: string; status: Status }>({
    title: "",
    description: "",
    status: "A Fazer",
  });
  const [, navigate] = useLocation();
  const { handleDragStart, handleDragEnd } = useKanbanDnD({
    tasks,
    setTasks,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) loadTasks();
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
      if (response.data.length > 0) setSelectedProjectId(response.data[0]._id);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
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
      toast.error("Erro ao carregar tarefas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Por favor, preencha o título da tarefa");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        await api.post("/tasks", { ...formData, projectId: selectedProjectId });
        toast.success("Tarefa criada com sucesso!");
      }
      setFormData({ title: "", description: "", status: "A Fazer" });
      setEditingId(null);
      setIsDialogOpen(false);
      loadTasks();
    } catch (error) {
      toast.error("Erro ao salvar tarefa");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Tarefa deletada com sucesso!");
      loadTasks();
    } catch (error) {
      toast.error("Erro ao deletar tarefa");
      console.error(error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task._id);
    setFormData({ title: task.title, description: task.description, status: task.status });
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success("Status atualizado com sucesso!");
      loadTasks();
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({ title: "", description: "", status: "A Fazer" });
  };

  const getTasksByStatus = (status: Status) => tasks.filter((t) => t.status === status);
  const currentProject = projects.find((p) => p._id === selectedProjectId);

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="ml-10 space-y-8">
          <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate("/projects")}
                className="inline-flex items-center gap-2 text-xs font-mono-soft uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-3"
              >
                <ArrowLeft className="size-3.5" />
                voltar para projetos
              </button>
              <h1 className="font-display text-4xl text-[hsl(38_32%_92%)] text-balance">
                Quadro <span className="italic text-primary">Kanban</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                {currentProject
                  ? <>Trabalhando em <span className="text-foreground font-medium">{currentProject.title}</span></>
                  : "Selecione um projeto para começar"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {projects.length > 0 && (
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="h-11 min-w-[16rem] bg-card border-border">
                    <SelectValue placeholder="Selecionar projeto" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {projects.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    disabled={!selectedProjectId}
                    className="h-11 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] ring-copper gap-2"
                  >
                    <Plus className="size-4" />
                    Nova tarefa
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-[hsl(38_32%_92%)]">
                      {editingId ? "Editar tarefa" : "Criar nova tarefa"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {editingId
                        ? "Atualize os detalhes da sua tarefa"
                        : "Crie uma nova tarefa para seu projeto"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground">
                        Título
                      </Label>
                      <Input
                        id="title"
                        placeholder="Nome da tarefa"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="h-11 bg-background/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground">
                        Descrição
                      </Label>
                      <Input
                        id="description"
                        placeholder="Descrição da tarefa"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="h-11 bg-background/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value as Status })
                        }
                      >
                        <SelectTrigger className="h-11 bg-background/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="A Fazer">A Fazer</SelectItem>
                          <SelectItem value="Fazendo">Fazendo</SelectItem>
                          <SelectItem value="Feito">Feito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)]"
                      >
                        {editingId ? "Atualizar" : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {!isLoading && projects.length === 0 && (
            <div className="surface rounded-3xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Você ainda não tem projetos. Crie um para começar a adicionar tarefas.
              </p>
              <Button
                onClick={() => navigate("/projects")}
                className="bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)]"
              >
                Ir para projetos
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && selectedProjectId && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {COLUMNS.map((column) => {
                  const items = tasks.filter((t) => t.status === column.status);

                  return (
                    <KanbanColumn
                      key={column.status}
                      column={column}
                      tasks={items}
                      onEditTask={handleEdit}
                      onDeleteTask={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  );
                })}
              </div>
            </DndContext>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
