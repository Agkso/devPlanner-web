export type Status = "A Fazer" | "Fazendo" | "Feito";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: Status;
  projectId: string;
  createdAt: string;
}

export interface TaskProject {
  _id: string;
  title: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: Status;
}
