package com.josemanuel.taskflow_backend.dto;

// IMPORTS
import com.josemanuel.taskflow_backend.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(
    @NotNull(message = "Status is required")
    TaskStatus status
) {}