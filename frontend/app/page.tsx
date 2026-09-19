"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
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
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
      <Stack spacing={3}>
        <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
            }}
        >
          <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700 }}
          >
            Todo List
          </Typography>

          <Button
              variant="contained"
              onClick={() => setShowForm((value) => !value)}
          >
            {showForm ? "閉じる" : "+ 新規登録"}
          </Button>
        </Stack>

        {showForm && (
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Stack spacing={2.5}>
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
                rows={4}
              />
              <Box>
                <Button variant="contained" type="submit">
                  登録
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>件名</TableCell>
                <TableCell>詳細</TableCell>
                <TableCell width={120}>状態</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo.id} hover>
                  <TableCell>
                    <Typography
                        component={Link}
                        href={`/todo/${todo.id}`}
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                    >
                      {todo.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{todo.detail}</TableCell>
                  <TableCell>
                    <Chip
                      label={todo.isCompleted ? "完了" : "未完了"}
                      color={todo.isCompleted ? "primary" : "default"}
                      variant={todo.isCompleted ? "filled" : "outlined"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {todos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5, color: "text.secondary" }}>
                    Todo はまだありません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
