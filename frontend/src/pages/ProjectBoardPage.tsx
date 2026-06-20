import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getProject, type ProjectResponse } from '../api/projects'
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  type TaskResponse,
  type TaskStatus,
} from '../api/tasks'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'Por hacer' },
  { status: 'IN_PROGRESS', label: 'En progreso' },
  { status: 'DONE', label: 'Hecho' },
]

function ProjectBoardPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!projectId) return
    loadData(projectId)
  }, [projectId])

  async function loadData(id: string) {
    setLoading(true)
    setError('')
    try {
      const [projectData, tasksData] = await Promise.all([
        getProject(id),
        getTasks(id),
      ])
      setProject(projectData)
      setTasks(tasksData)
    } catch {
      setError('No se pudo cargar el tablero')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!projectId || !newTitle.trim()) return
    setCreating(true)
    try {
      const created = await createTask(projectId, { title: newTitle })
      setTasks((prev) => [...prev, created])
      setNewTitle('')
    } catch {
      setError('No se pudo crear la tarea')
    } finally {
      setCreating(false)
    }
  }

  async function handleMove(task: TaskResponse, newStatus: TaskStatus) {
    if (!projectId) return
    try {
      const updated = await updateTaskStatus(projectId, task.id, newStatus)
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch {
      setError('No se pudo mover la tarea')
    }
  }

  async function handleDelete(task: TaskResponse) {
    if (!projectId) return
    try {
      await deleteTask(projectId, task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch {
      setError('No se pudo eliminar la tarea')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-slate-700">
        <button
          onClick={() => navigate('/board')}
          className="rounded-lg bg-slate-700 hover:bg-slate-600 px-3 py-2 text-sm transition-colors"
        >
          ← Proyectos
        </button>
        <h1 className="text-xl font-bold">{project ? project.name : 'Tablero'}</h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleCreateTask} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nueva tarea..."
            className="flex-1 rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-5 py-2 transition-colors"
          >
            {creating ? 'Añadiendo...' : 'Añadir tarea'}
          </button>
        </form>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loading ? (
          <p className="text-slate-400">Cargando tablero...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column.status)
              return (
                <div key={column.status} className="bg-slate-800 rounded-xl p-4">
                  <h2 className="font-semibold mb-3 flex items-center justify-between">
                    <span>{column.label}</span>
                    <span className="text-xs text-slate-400 bg-slate-700 rounded-full px-2 py-0.5">
                      {columnTasks.length}
                    </span>
                  </h2>
                  <div className="flex flex-col gap-2">
                    {columnTasks.length === 0 ? (
                      <p className="text-sm text-slate-500">Sin tareas</p>
                    ) : (
                      columnTasks.map((task) => (
                        <div key={task.id} className="bg-slate-700 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium">{task.title}</h3>
                            <button
                              onClick={() => handleDelete(task)}
                              className="text-slate-400 hover:text-red-400 text-sm shrink-0"
                              title="Eliminar tarea"
                            >
                              ✕
                            </button>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                          )}
                          <div className="flex gap-1 mt-3">
                            {COLUMNS.filter((c) => c.status !== task.status).map((c) => (
                              <button
                                key={c.status}
                                onClick={() => handleMove(task, c.status)}
                                className="text-xs rounded bg-slate-600 hover:bg-emerald-600 px-2 py-1 transition-colors"
                              >
                                → {c.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default ProjectBoardPage