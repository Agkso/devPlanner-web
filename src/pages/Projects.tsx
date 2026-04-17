
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
import { ArrowUpRight, Edit2, FolderOpen, Loader2, Plus, Trash2 } from "lucide-react";
import api from "../services/api";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [, navigate] = useLocation();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Por favor, preencha o título do projeto");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
        toast.success("Projeto atualizado com sucesso!");
      } else {
        await api.post("/projects", formData);
        toast.success("Projeto criado com sucesso!");
      }
      setFormData({ title: "", description: "" });
      setEditingId(null);
      setIsDialogOpen(false);
      loadProjects();
    } catch (error) {
      toast.error("Erro ao salvar projeto");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este projeto?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Projeto deletado com sucesso!");
      loadProjects();
    } catch (error) {
      toast.error("Erro ao deletar projeto");
      console.error(error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    setFormData({ title: project.title, description: project.description });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({ title: "", description: "" });
  };

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="ml-10 space-y-8">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="font-mono-soft text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                workspace
              </p>
              <h1 className="font-display text-4xl text-[hsl(38_32%_92%)] text-balance">
                Meus <span className="italic text-primary">projetos</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Crie, edite e organize todos os seus quadros Kanban em um só lugar.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] ring-copper gap-2">
                  <Plus className="size-4" />
                  Novo projeto
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl text-[hsl(38_32%_92%)]">
                    {editingId ? "Editar projeto" : "Criar novo projeto"}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    {editingId
                      ? "Atualize os detalhes do seu projeto"
                      : "Crie um novo projeto para organizar suas tarefas"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground">
                      Título
                    </Label>
                    <Input
                      id="title"
                      placeholder="Nome do projeto"
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
                      placeholder="Descrição do projeto"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="h-11 bg-background/60"
                    />
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
          </header>

          {!isLoading && projects.length > 0 && (
            <div className="flex items-center gap-3 text-xs font-mono-soft text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>
                {projects.length} {projects.length === 1 ? "projeto" : "projetos"} ativos
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="surface rounded-3xl border border-dashed border-border p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
              <div className="relative">
                <div className="size-16 mx-auto rounded-2xl bg-[hsl(22_82%_52%/0.10)] grid place-items-center mb-4">
                  <FolderOpen className="size-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-[
                hsl(38_32%_92%)] mb-2">
                  Nenhum projeto ainda
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Crie seu primeiro projeto para começar a organizar tarefas no Kanban.
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="h-11 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] gap-2"
                >
                  <Plus className="size-4" />
                  Criar primeiro projeto
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, idx) => (
                <article
                  key={project._id}
                  onClick={() => navigate(`/tasks?projectId=${project._id}`)}
                  className="group surface rounded-2xl border border-border hover:border-[hsl(22_82%_52%/0.40)] p-6 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 size-32 rounded-full bg-[hsl(22_82%_52%/0.06)] blur-2xl pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[10px] font-mono-soft text-muted-foreground tracking-tight">
                        PRJ-{String(idx + 1).padStart(3, "0")}
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <h3 className="font-display text-xl text-[hsl(38_32%_92%)] mb-2 leading-tight text-balance">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5 min-h-[2.5rem]">
                      {project.description || "Sem descrição"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-[10px] font-mono-soft text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
                          }}
                          aria-label="Editar"
                          className="size-8 rounded-md grid place-items-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project._id);
                          }}
                          aria-label="Deletar"
                          className="size-8 rounded-md grid place-items-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
