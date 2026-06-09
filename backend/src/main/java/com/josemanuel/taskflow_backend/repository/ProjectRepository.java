package com.josemanuel.taskflow_backend.repository;

// IMPORTS
import com.josemanuel.taskflow_backend.model.Project;
import com.josemanuel.taskflow_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByOwner(User owner);

    Optional<Project> findByIdAndOwner(UUID id, User owner);
}
