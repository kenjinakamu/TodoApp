package com.example.demo.entity;

import jakarta.validation.constraints.NotBlank;

import java.time.OffsetDateTime;

public record Todo(
        Long id,
        @NotBlank String title,
        @NotBlank String detail,
        Boolean isCompleted,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
