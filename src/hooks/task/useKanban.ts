import { useState } from "react";
import { toast } from "sonner";
import { Status, Task } from "../../types/tasks";
import api from "../../services/api";

type Props = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export function useKanbanDnD({ tasks, setTasks }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const findTask = (id: string) => tasks.find((t) => t._id === id);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = findTask(active.id);
    if (!activeTask) return;

    const newStatus = over.data?.current?.status as Status;

    if (!newStatus || newStatus === activeTask.status) return;

    setTasks((prev) =>
      prev.map((t) =>
        t._id === activeTask._id ? { ...t, status: newStatus } : t
      )
    );

    try {
      await api.put(`/tasks/${activeTask._id}`, {
        status: newStatus,
      });
    } catch (e) {
      toast.error("Erro ao mover tarefa");
    }

    setActiveId(null);
  };

  return {
    handleDragStart,
    handleDragEnd,
  };
}