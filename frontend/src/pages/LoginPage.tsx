import { Link } from 'react-router'

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="text-slate-400">Aquí irá el formulario de inicio de sesión</p>
      <Link to="/register" className="text-emerald-400 underline">
        ¿No tienes cuenta? Regístrate
      </Link>
    </div>
  )
}

export default LoginPage