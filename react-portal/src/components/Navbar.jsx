import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">OfCourse</Link>
        <div className="navbar-links">
          <span className="navbar-user">{usuario?.nombre}</span>
          <Link to="/dashboard" className={isActive('/dashboard') && !isActive('/cursos') ? 'active' : ''}>
            Mis Cursos
          </Link>
          <Link to="/cursos" className={isActive('/cursos') ? 'active' : ''}>
            Catálogo
          </Link>
          <button onClick={handleLogout} className="btn btn-sm btn-danger">Salir</button>
        </div>
      </div>
    </nav>
  )
}
