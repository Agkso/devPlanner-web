import { ArrowUpRight, Edit2, Trash2 } from "lucide-react";
import type { Project } from "../../types/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  onNavigate: (projectId: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, index, onNavigate, onEdit, onDelete }: ProjectCardProps) => (
  <article
    onClick={() => onNavigate(project._id)}
    className="group surface rounded-2xl border border-border hover:border-[hsl(22_82%_52%/0.40)] p-6 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden"
  >
    <div className="absolute -top-12 -right-12 size-32 rounded-full bg-[hsl(22_82%_52%/0.06)] blur-2xl pointer-events-none" />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] font-mono-soft text-muted-foreground tracking-tight">
          PRJ-{String(index + 1).padStart(3, "0")}
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
              onEdit(project);
            }}
            aria-label="Editar"
            className="size-8 rounded-md grid place-items-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Edit2 className="size-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
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
);
