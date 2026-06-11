import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function BoardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

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

      <main className="flex items-center justify-center py-20">
        <p className="text-slate-400">Aquí irá el tablero Kanban (próximamente)</p>
      </main>
    </div>
  )
}

export default BoardPage