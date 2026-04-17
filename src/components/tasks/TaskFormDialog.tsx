import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Status, TaskFormData } from "../../types/tasks";

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  formData: TaskFormData;
  onFormChange: (data: TaskFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const TaskFormDialog = ({
  isOpen,
  onOpenChange,
  editingId,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
}: TaskFormDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
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

      <form onSubmit={onSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground"
          >
            Título
          </Label>
          <Input
            id="title"
            placeholder="Nome da tarefa"
            value={formData.title}
            onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            className="h-11 bg-background/60"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground"
          >
            Descrição
          </Label>
          <Input
            id="description"
            placeholder="Descrição da tarefa"
            value={formData.description}
            onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            className="h-11 bg-background/60"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-xs font-mono-soft uppercase tracking-widest text-muted-foreground"
          >
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onFormChange({ ...formData, status: value as Status })}
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
          <Button type="button" variant="outline" onClick={onCancel}>
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
);
