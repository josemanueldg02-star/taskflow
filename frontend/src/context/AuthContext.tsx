import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  function setToken(newToken: string) {
    localStorage.setItem('token', newToken)
    setTokenState(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setTokenState(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: token !== null, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}