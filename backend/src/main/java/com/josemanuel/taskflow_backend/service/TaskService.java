package com.josemanuel.taskflow_backend.service;

// IMPORTS
import com.josemanuel.taskflow_backend.dto.TaskRequest;
import com.josemanuel.taskflow_backend.dto.TaskResponse;
import com.josemanuel.taskflow_backend.dto.UpdateTaskStatusRequest;
import com.josemanuel.taskflow_backend.model.Project;
import com.josemanuel.taskflow_backend.model.Task;
import com.josemanuel.taskflow_backend.model.TaskStatus;
import com.josemanuel.taskflow_backend.model.User;
import com.josemanuel.taskflow_backend.repository.ProjectRepository;
import com.josemanuel.taskflow_backend.repository.TaskRepository;
import com.josemanuel.taskflow_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public TaskResponse create(UUID projectId, TaskRequest request, String userEmail) {
        Project project = getOwnedProject(projectId, userEmail);

        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .status(TaskStatus.TODO)
                .project(project)
                .build();

        return toResponse(taskRepository.save(task));
    }

    public List<TaskResponse> findByProject(UUID projectId, String userEmail) {
        Project project = getOwnedProject(projectId, userEmail);
        return taskRepository.findByProject(project)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse updateStatus(UUID projectId, UUID taskId,
                                     UpdateTaskStatusRequest request, String userEmail) {
        Project project = getOwnedProject(projectId, userEmail);
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        task.setStatus(request.status());
        return toResponse(taskRepository.save(task));
    }

    public void delete(UUID projectId, UUID taskId, String userEmail) {
        Project project = getOwnedProject(projectId, userEmail);
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        taskRepository.delete(task);
    }

    private Project getOwnedProject(UUID projectId, String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return projectRepository.findByIdAndOwner(projectId, owner)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getProject().getId(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}