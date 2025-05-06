"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import "./Navbar.css"

const Navbar = ({ isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    toast.success("Logged out successfully")
    navigate("/")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">LEARNOVATE</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "text-primary" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/mentors"
              className={`nav-link ${isActive("/mentors") ? "text-primary" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Mentors
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard") ? "text-primary" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/schedule"
                  className={`nav-link ${isActive("/schedule") ? "text-primary" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Schedule
                </Link>
              </li>

              {currentUser?.role === "mentor" && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/requests"
                      className={`nav-link ${isActive("/requests") ? "text-primary" : ""}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Session Requests
                    </Link>
                  </li>
                </>
              )}

              {currentUser?.role === "admin" && (
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className={`nav-link ${isActive("/admin") ? "text-primary" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <Link
                  to="/profile"
                  className={`nav-link ${isActive("/profile") ? "text-primary" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>

              <li className="nav-item">
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  to="/login"
                  className={`nav-link ${isActive("/login") ? "text-primary" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-btn" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
