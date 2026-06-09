package com.josemanuel.taskflow_backend.service;

//IMPORTS
import com.josemanuel.taskflow_backend.dto.ProjectRequest;
import com.josemanuel.taskflow_backend.dto.ProjectResponse;
import com.josemanuel.taskflow_backend.model.Project;
import com.josemanuel.taskflow_backend.model.User;
import com.josemanuel.taskflow_backend.repository.ProjectRepository;
import com.josemanuel.taskflow_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ProjectResponse create(ProjectRequest request, String userEmail) {
        User owner = getUser(userEmail);

        Project project = Project.builder()
            .name(request.name())
            .description(request.description())
            .owner(owner)
            .build();

        return toResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> findAll(String userEmail) {
        User owner = getUser(userEmail);
        return projectRepository.findByOwner(owner)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public ProjectResponse findById(UUID id, String userEmail) {
        User owner = getUser(userEmail);
        Project project = projectRepository.findByIdAndOwner(id, owner)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        return toResponse(project);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
            project.getId(),
            project.getName(),
            project.getDescription(),
            project.getCreatedAt(),
            project.getUpdatedAt()
        );
    }

}
