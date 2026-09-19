"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { todoApi } from "@/lib/api";

export function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void todoApi.get(id)
        .then((todo) => {
          setTitle(todo.title);
          setDetail(todo.detail);
          setIsCompleted(todo.isCompleted);
        })
        .catch((e: unknown) => setError(e instanceof Error ? e.message : "Todo の取得に失敗しました。"));
  }, [id]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await todoApi.update(id, {title: title.trim(), detail: detail.trim(), isCompleted});
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました。");
    }
  }

  async function handleDelete() {
    if (!window.confirm("削除してもよろしいですか？")) return;
    try {
      await todoApi.delete(id);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました。");
    }
  }

  return (
      <main className="container narrow">
        <Link className="back" href="/">← 一覧へ戻る</Link>
        <form className="card form" onSubmit={handleSubmit}>
          <h1>Todo 詳細</h1>
          {error && <p className="error">{error}</p>}
          <label>件名<input value={title} onChange={(e) => setTitle(e.target.value)} required/></label>
          <label>詳細<textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={6} required/></label>
          <label className="check"><input type="checkbox" checked={isCompleted}
                                          onChange={(e) => setIsCompleted(e.target.checked)}/> 完了</label>
          <div className="actions">
            <button className="primary" type="submit">更新</button>
            <button className="danger" type="button" onClick={handleDelete}>削除</button>
          </div>
        </form>
      </main>
  );
}
