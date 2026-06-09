package com.josemanuel.taskflow_backend.repository;

// IMPORTS
import com.josemanuel.taskflow_backend.model.Project;
import com.josemanuel.taskflow_backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProject(Project project);

    Optional<Task> findByIdAndProject(UUID id, Project project);
}
