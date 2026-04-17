import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Edit2, Trash2 } from "lucide-react";
import type { Task, Status } from "../../types/tasks";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  index: number;
  borderClass: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
}

export const TaskCard = ({
  task,
  index,
  borderClass,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group surface rounded-2xl border border-border border-l-4 ${borderClass} p-4 transition-all hover:-translate-y-0.5 hover:border-[hsl(22_82%_52%/0.30)]`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-mono-soft text-muted-foreground tracking-tight">
          TSK-{String(index + 1).padStart(3, "0")}
        </span>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(task)}
            className="size-7 rounded-md grid place-items-center hover:bg-muted/60"
          >
            <Edit2 className="size-3" />
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task._id)}
            className="size-7 rounded-md grid place-items-center hover:bg-destructive/10"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-medium text-[hsl(38_32%_92%)] mb-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground/70">
          {new Date(task.createdAt).toLocaleDateString("pt-BR")}
        </span>

        <Select
          value={task.status}
          onValueChange={(v) => onStatusChange(task._id, v as Status)}
        >
          <SelectTrigger
            onPointerDown={(e) => e.stopPropagation()}
            className="h-7 w-auto px-2 text-[10px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A Fazer">A Fazer</SelectItem>
            <SelectItem value="Fazendo">Fazendo</SelectItem>
            <SelectItem value="Feito">Feito</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </article>
  );
};