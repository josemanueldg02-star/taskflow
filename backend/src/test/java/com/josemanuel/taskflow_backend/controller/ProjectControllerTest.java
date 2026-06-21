package com.josemanuel.taskflow_backend.controller;

// IMPORTS
import com.josemanuel.taskflow_backend.config.SecurityConfig;
import com.josemanuel.taskflow_backend.dto.ProjectResponse;
import com.josemanuel.taskflow_backend.security.JwtAuthenticationFilter;
import com.josemanuel.taskflow_backend.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
    controllers = ProjectController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = { SecurityConfig.class, JwtAuthenticationFilter.class }
    )
)
@AutoConfigureMockMvc(addFilters = false)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProjectService projectService;

    @Test
    @WithMockUser(username = "jose@test.com")
    void findAll_returnsListOfProjects() throws Exception {
        // Arrange: el servicio (mockeado) devuelve un proyecto
        ProjectResponse project = new ProjectResponse(
            UUID.randomUUID(),
            "Mi proyecto",
            "Una descripción",
            Instant.now(),
            Instant.now()
        );
        when(projectService.findAll("jose@test.com")).thenReturn(List.of(project));

        // Act + Assert: GET /api/projects responde 200 y el JSON esperado
        mockMvc.perform(get("/api/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Mi proyecto"))
            .andExpect(jsonPath("$[0].description").value("Una descripción"));
    }

    @Test
    @WithMockUser(username = "jose@test.com")
    void findById_whenServiceThrowsNotFound_returns404() throws Exception {
        // Arrange: el servicio lanza 404 (proyecto inexistente o ajeno)
        UUID projectId = UUID.randomUUID();
        when(projectService.findById(projectId, "jose@test.com"))
            .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        // Act + Assert: la API responde 404
        mockMvc.perform(get("/api/projects/" + projectId))
            .andExpect(status().isNotFound());
    }
}