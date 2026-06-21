package com.josemanuel.taskflow_backend.service;

// IMPORTS
import com.josemanuel.taskflow_backend.dto.ProjectRequest;
import com.josemanuel.taskflow_backend.dto.ProjectResponse;
import com.josemanuel.taskflow_backend.model.Project;
import com.josemanuel.taskflow_backend.model.User;
import com.josemanuel.taskflow_backend.repository.ProjectRepository;
import com.josemanuel.taskflow_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    private final String userEmail = "jose@test.com";
    private User owner;

    @BeforeEach
    void setUp() {
        owner = mock(User.class);
    }

    @Test
    void create_whenUserExists_savesAndReturnsProject() {
        // Preparación.
        ProjectRequest request = new ProjectRequest("Mi proyecto", "Una descripción");
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(owner));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        // Ejecución.
        ProjectResponse response = projectService.create(request, userEmail);

        // Comprobación.
        assertThat(response.name()).isEqualTo("Mi proyecto");
        assertThat(response.description()).isEqualTo("Una descripción");
        verify(projectRepository).save(any(Project.class));
    }

   @Test
    void findById_whenProjectBelongsToUser_returnsProject() {
        // Arrange
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder()
            .id(projectId)
            .name("Proyecto existente")
            .description("desc")
            .owner(owner)
            .build();
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(owner));
        when(projectRepository.findByIdAndOwner(projectId, owner)).thenReturn(Optional.of(project));

        // Act
        ProjectResponse response = projectService.findById(projectId, userEmail);

        // Assert
        assertThat(response.id()).isEqualTo(projectId);
        assertThat(response.name()).isEqualTo("Proyecto existente");
    }

    @Test
    void findById_whenProjectNotFoundForUser_throwsNotFound() {
        // Arrange: el repositorio no encuentra el proyecto para ESTE dueño
        UUID projectId = UUID.randomUUID();
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(owner));
        when(projectRepository.findByIdAndOwner(projectId, owner)).thenReturn(Optional.empty());

        // Act + Assert: debe lanzar 404, no devolver el proyecto de otro
        assertThatThrownBy(() -> projectService.findById(projectId, userEmail))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("Project not found");
    }

    @Test
    void create_whenUserNotFound_throwsUnauthorized() {
        // Arrange
        ProjectRequest request = new ProjectRequest("Mi proyecto", "desc");
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> projectService.create(request, userEmail))
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("User not found");
        verify(projectRepository, never()).save(any());
    }
}