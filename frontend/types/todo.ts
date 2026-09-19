export type Todo = {
  id: number;
  title: string;
  detail: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoInput = {
  title: string;
  detail: string;
  isCompleted?: boolean;
};
