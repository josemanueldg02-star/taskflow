import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { getProjects, createProject, type ProjectResponse } from '../api/projects'

function BoardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setLoading(true)
    setError('')
    try {
      const data = await getProjects()
      setProjects(data)
    } catch {
      setError('No se pudieron cargar los proyectos')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setError('')
    try {
      const created = await createProject({ name: newName, description: newDescription })
      setProjects((prev) => [...prev, created])
      setNewName('')
      setNewDescription('')
    } catch {
      setError('No se pudo crear el proyecto')
    } finally {
      setCreating(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">TaskFlow</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Mis proyectos</h2>

        <form
          onSubmit={handleCreate}
          className="bg-slate-800 rounded-xl p-5 mb-8 flex flex-col sm:flex-row gap-3 sm:items-end"
        >
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="newName" className="text-sm text-slate-300">Nombre del proyecto</label>
            <input
              id="newName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej. Rediseño de la web"
              className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="newDescription" className="text-sm text-slate-300">Descripción (opcional)</label>
            <input
              id="newDescription"
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Breve descripción"
              className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-5 py-2 transition-colors"
          >
            {creating ? 'Creando...' : 'Crear'}
          </button>
        </form>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loading ? (
          <p className="text-slate-400">Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p className="text-slate-400">Aún no tienes proyectos. ¡Crea el primero arriba!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/board/${project.id}`)}
                className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                <p className="text-sm text-slate-400">
                  {project.description || 'Sin descripción'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default BoardPage