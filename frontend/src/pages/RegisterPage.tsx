import { Link } from 'react-router'

function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
      <h1 className="text-3xl font-bold">Registro</h1>
      <p className="text-slate-400">Aquí irá el formulario de registro</p>
      <Link to="/login" className="text-emerald-400 underline">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </div>
  )
}

export default RegisterPage