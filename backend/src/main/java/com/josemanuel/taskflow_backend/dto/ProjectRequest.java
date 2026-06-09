package com.josemanuel.taskflow_backend.dto;

// IMPORTS
import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
    @NotBlank(message = "Project name is required")
    String name,
    String description
) {}
