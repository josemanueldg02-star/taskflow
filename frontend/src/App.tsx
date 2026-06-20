// IMPORTS
import { Routes, Route, Navigate } from 'react-router'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage from './pages/BoardPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProjectBoardPage from './pages/ProjectBoardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/board"
        element={
          <ProtectedRoute>
            <BoardPage />
          </ProtectedRoute>
        }
      />
      <Route
      path="/board/:projectId"
      element={
        <ProtectedRoute>
          <ProjectBoardPage />
        </ProtectedRoute>
      }
      />
    </Routes>
  )
}

export default App