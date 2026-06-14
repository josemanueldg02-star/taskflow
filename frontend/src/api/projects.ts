// IMPORTS
import apiClient from "./client";

export interface ProjectResponse {
    id: string
    name: string
    description: string | null
    createdAt: string
    updateAt: string
}

export interface ProjectRequest {
    name: string
    description: string
}

export async function getProjects(): Promise<ProjectResponse[]> {
    const response = await apiClient.get<ProjectResponse[]>('/api/projects')
    return response.data
}

export async function createProject(data: ProjectRequest): Promise<ProjectResponse> {
    const response = await apiClient.post<ProjectResponse>('/api/projects', data)
    return response.data
}