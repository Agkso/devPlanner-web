import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, Plus } from "lucide-react";
import type { TaskProject } from "../../types/tasks";

interface TasksHeaderProps {
  currentProject: TaskProject | undefined;
  projects: TaskProject[];
  selectedProjectId: string;
  onProjectChange: (id: string) => void;
  onNewTask: () => void;
  onBack: () => void;
}

export const TasksHeader = ({
  currentProject,
  projects,
  selectedProjectId,
  onProjectChange,
  onNewTask,
  onBack,
}: TasksHeaderProps) => (
  <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono-soft uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-3"
      >
        <ArrowLeft className="size-3.5" />
        voltar para projetos
      </button>
      <h1 className="font-display text-4xl text-[hsl(38_32%_92%)] text-balance">
        Quadro <span className="italic text-primary">Kanban</span>
      </h1>
      <p className="text-muted-foreground mt-2">
        {currentProject ? (
          <>
            Trabalhando em{" "}
            <span className="text-foreground font-medium">{currentProject.title}</span>
          </>
        ) : (
          "Selecione um projeto para começar"
        )}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      {projects.length > 0 && (
        <Select value={selectedProjectId} onValueChange={onProjectChange}>
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

      <Button
        disabled={!selectedProjectId}
        onClick={onNewTask}
        className="h-11 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] ring-copper gap-2"
      >
        <Plus className="size-4" />
        Nova tarefa
      </Button>
    </div>
  </header>
);
