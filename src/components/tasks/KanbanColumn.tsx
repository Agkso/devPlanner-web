import { CheckCircle2, CircleDashed, Timer } from "lucide-react";
import { TaskCard } from "./TaskCard";
import type { Task, Status } from "../../types/tasks";
import { useDroppable } from "@dnd-kit/core";

type ToneKey = "muted" | "copper" | "moss";

interface ColumnDef {
  status: Status;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: ToneKey;
}

const toneClasses: Record<
  ToneKey,
  { dot: string; counter: string; border: string; iconColor: string }
> = {
  muted: {
    dot: "bg-muted-foreground/40",
    counter: "bg-muted text-muted-foreground border-border",
    border: "border-l-border",
    iconColor: "text-muted-foreground",
  },
  copper: {
    dot: "bg-primary shadow-[0_0_10px_hsl(22_82%_52%)]",
    counter:
      "bg-gradient-to-r from-[hsl(22_82%_52%)] to-[hsl(24_70%_60%)] text-[hsl(38_45%_96%)] border-transparent",
    border: "border-l-primary",
    iconColor: "text-primary",
  },
  moss: {
    dot: "bg-[hsl(150_32%_42%)]",
    counter:
      "bg-[hsl(150_32%_42%/0.20)] text-[hsl(150_32%_42%)] border-[hsl(150_32%_42%/0.30)]",
    border: "border-l-[hsl(150_32%_42%)]",
    iconColor: "text-[hsl(150_32%_42%)]",
  },
};

export const COLUMNS: ColumnDef[] = [
  { status: "A Fazer", subtitle: "aguardando", icon: CircleDashed, tone: "muted" },
  { status: "Fazendo", subtitle: "em progresso", icon: Timer, tone: "copper" },
  { status: "Feito", subtitle: "concluídas", icon: CheckCircle2, tone: "moss" },
];

interface KanbanColumnProps {
  column: ColumnDef;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (taskId: string, newStatus: Status) => void;
}

export const KanbanColumn = ({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: KanbanColumnProps) => {
  const { status, subtitle, icon: Icon, tone } = column;
  const t = toneClasses[tone];

  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
    data: {
      status: column.status,
    },
  });

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* HEADER (NÃO é droppable) */}
      <div className="flex items-end justify-between px-1">
        <div className="flex items-center gap-3">
          <span className={`size-2 rounded-full ${t.dot}`} />
          <div>
            <h2 className="font-display text-xl text-[hsl(38_32%_92%)] leading-tight flex items-center gap-2">
              <Icon className={`size-4 ${t.iconColor}`} />
              {status}
            </h2>
            <p className="text-[10px] font-mono-soft uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <span
          className={`size-7 rounded-full grid place-items-center text-[10px] font-mono-soft font-bold border ${t.counter}`}
        >
          {tasks.length.toString().padStart(2, "0")}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[120px] transition-all rounded-xl ${
          isOver ? "bg-muted/30 p-2" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs font-mono-soft text-muted-foreground/60">
            nenhuma tarefa
          </div>
        ) : (
          tasks.map((task, idx) => (
            <TaskCard
              key={task._id}
              task={task}
              index={idx}
              borderClass={t.border}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};