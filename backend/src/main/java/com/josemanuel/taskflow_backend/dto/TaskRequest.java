package com.josemanuel.taskflow_backend.dto;

// IMPORTS
import jakarta.validation.constraints.NotBlank;

public record TaskRequest(
    @NotBlank(message = "Task title is required")
    String title,
    String description
) {}