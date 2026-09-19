"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { todoApi } from "@/lib/api";
import type { Todo } from "@/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      setTodos(await todoApi.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Todo の取得に失敗しました。");
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !detail.trim()) return;

    try {
      await todoApi.create({ title: title.trim(), detail: detail.trim(), isCompleted: false });
      setTitle("");
      setDetail("");
      setShowForm(false);
      await loadTodos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "登録に失敗しました。");
    }
  }

  return (
    <main className="container">
      <div className="header">
        <div>
          <p className="eyebrow">Spring Boot 4.1.1 + Next.js</p>
          <h1>Todo List</h1>
        </div>
        <button className="primary" onClick={() => setShowForm((value) => !value)}>
          {showForm ? "閉じる" : "+ 新規登録"}
        </button>
      </div>

      {showForm && (
        <form className="card form" onSubmit={handleSubmit}>
          <label>
            件名
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            詳細
            <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} required />
          </label>
          <button className="primary" type="submit">登録</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      <div className="card tableWrap">
        <table>
          <thead>
            <tr><th>件名</th><th>詳細</th><th>状態</th></tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td><Link href={`/todo/${todo.id}`}>{todo.title}</Link></td>
                <td>{todo.detail}</td>
                <td>{todo.isCompleted ? "完了" : "未完了"}</td>
              </tr>
            ))}
            {todos.length === 0 && (
              <tr><td colSpan={3} className="empty">Todo はまだありません。</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
