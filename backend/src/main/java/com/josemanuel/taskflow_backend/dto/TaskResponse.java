package com.josemanuel.taskflow_backend.dto;

// IMPORTS
import com.josemanuel.taskflow_backend.model.TaskStatus;

import java.time.Instant;
import java.util.UUID;

public record TaskResponse(
    UUID id,
    String title,
    String description,
    TaskStatus status,
    UUID projectId,
    Instant createdAt,
    Instant updatedAt
) {}