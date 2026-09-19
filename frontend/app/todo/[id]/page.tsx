"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { todoApi } from "@/lib/api";

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void todoApi
      .get(id)
      .then((todo) => {
        setTitle(todo.title);
        setDetail(todo.detail);
        setIsCompleted(todo.isCompleted);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Todo の取得に失敗しました。"),
      );
  }, [id]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await todoApi.update(id, {
        title: title.trim(),
        detail: detail.trim(),
        isCompleted,
      });
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
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      <Stack spacing={2.5}>
        <Button component={Link} href="/" variant="text" sx={{ alignSelf: "flex-start" }}>
          ← 一覧へ戻る
        </Button>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Todo 詳細
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="件名"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="詳細"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              required
              fullWidth
              multiline
              rows={6}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                />
              }
              label="完了"
            />
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" type="submit">
                更新
              </Button>
              <Button variant="outlined" color="error" type="button" onClick={handleDelete}>
                削除
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
