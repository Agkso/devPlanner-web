import { Button } from "../ui/button";
import { FolderOpen, Plus } from "lucide-react";

interface ProjectEmptyStateProps {
  onCreateClick: () => void;
}

export const ProjectEmptyState = ({ onCreateClick }: ProjectEmptyStateProps) => (
  <div className="surface rounded-3xl border border-dashed border-border p-12 text-center relative overflow-hidden">
    <div className="absolute inset-0 grain opacity-20 pointer-events-none" />
    <div className="relative">
      <div className="size-16 mx-auto rounded-2xl bg-[hsl(22_82%_52%/0.10)] grid place-items-center mb-4">
        <FolderOpen className="size-7 text-primary" />
      </div>
      <h3 className="font-display text-2xl text-[hsl(38_32%_92%)] mb-2">
        Nenhum projeto ainda
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-6">
        Crie seu primeiro projeto para começar a organizar tarefas no Kanban.
      </p>
      <Button
        onClick={onCreateClick}
        className="h-11 px-5 bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] gap-2"
      >
        <Plus className="size-4" />
        Criar primeiro projeto
      </Button>
    </div>
  </div>
);
