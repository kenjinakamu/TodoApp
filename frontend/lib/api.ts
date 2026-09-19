import type { Todo, TodoInput } from "@/types/todo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const todoApi = {
  list: () => request<Todo[]>("/todo", { cache: "no-store" }),
  get: (id: number) => request<Todo>(`/todo/${id}`, { cache: "no-store" }),
  create: (input: TodoInput) => request<Todo>("/todo", {
    method: "POST",
    body: JSON.stringify({ ...input, isCompleted: input.isCompleted ?? false }),
  }),
  update: (id: number, input: TodoInput) => request<Todo>(`/todo/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  }),
  delete: (id: number) => request<void>(`/todo/${id}`, { method: "DELETE" }),
};
