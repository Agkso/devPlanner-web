import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface ProjectsHeaderProps {
  onNewProject: () => void;
  projectCount: number;
  isLoading: boolean;
}

export const ProjectsHeader = ({ onNewProject, projectCount, isLoading }: ProjectsHeaderProps) => (
  <>
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

      <Button
        onClick={onNewProject}
        className="h-11 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] ring-copper gap-2"
      >
        <Plus className="size-4" />
        Novo projeto
      </Button>
    </header>

    {!isLoading && projectCount > 0 && (
      <div className="flex items-center gap-3 text-xs font-mono-soft text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary" />
        <span>
          {projectCount} {projectCount === 1 ? "projeto" : "projetos"} ativos
        </span>
      </div>
    )}
  </>
);
