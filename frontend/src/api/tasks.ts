// IMPORTS
import apiClient from './client'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface TaskResponse {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    projectId: string
    createdAt: string
    updateAt: string
}

export interface TaskRequest {
    title: string
    description?: string
}

export async function getTasks(projectId: string): Promise<TaskResponse[]> {
  const response = await apiClient.get<TaskResponse[]>(`/api/projects/${projectId}/tasks`)
  return response.data
}

export async function createTask(projectId: string, data: TaskRequest): Promise<TaskResponse> {
  const response = await apiClient.post<TaskResponse>(`/api/projects/${projectId}/tasks`, data)
  return response.data
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: TaskStatus
): Promise<TaskResponse> {
  const response = await apiClient.patch<TaskResponse>(
    `/api/projects/${projectId}/tasks/${taskId}/status`,
    { status }
  )
  return response.data
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`)
}