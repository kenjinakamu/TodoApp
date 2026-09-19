package com.example.demo.service;

import com.example.demo.entity.Todo;
import com.example.demo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> findAll() {
        return todoRepository.findAll();
    }

    public Todo findOne(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    }

    public Todo create(Todo todo) {
        OffsetDateTime now = OffsetDateTime.now();
        return todoRepository.insert(
                todo.title(),
                todo.detail(),
                Boolean.TRUE.equals(todo.isCompleted()),
                now,
                now
        );
    }

    public Todo update(Long id, Todo todo) {
        return todoRepository.update(
                        id,
                        todo.title(),
                        todo.detail(),
                        Boolean.TRUE.equals(todo.isCompleted()),
                        OffsetDateTime.now()
                )
                .orElseThrow(() -> new NoSuchElementException("Todo not found: " + id));
    }

    public void delete(Long id) {
        if (todoRepository.deleteById(id) == 0) {
            throw new NoSuchElementException("Todo not found: " + id);
        }
    }
}
