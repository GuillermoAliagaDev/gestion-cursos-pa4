import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cursos from './pages/Cursos'
import CursoDetalle from './pages/CursoDetalle'
import Footer from './components/Footer'

export default function App() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cursos" element={<ProtectedRoute><Cursos /></ProtectedRoute>} />
          <Route path="/cursos/:id" element={<ProtectedRoute><CursoDetalle /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      {!isLogin && <Footer />}
    </div>
  )
}
