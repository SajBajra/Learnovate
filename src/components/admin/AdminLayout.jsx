"use client"

import { useState } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import "./AdminLayout.css"

const AdminLayout = ({ currentUser }) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className={`admin-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <i className="fas fa-shield-alt"></i>
            <span className="sidebar-text">Admin</span>
          </h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-chevron-${collapsed ? "right" : "left"}`}></i>
          </button>
        </div>

        <div className="sidebar-user">
          <img
            src={currentUser?.profilePicture || "/placeholder.svg?height=40&width=40"}
            alt={currentUser?.name}
            className="sidebar-user-image"
          />
          <div className="sidebar-user-info">
            <h3 className="sidebar-user-name">{currentUser?.name}</h3>
            <p className="sidebar-user-role">Administrator</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/admin" className={`sidebar-menu-link ${isActive("/admin") ? "active" : ""}`}>
                <i className="fas fa-tachometer-alt"></i>
                <span className="sidebar-text">Dashboard</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/admin/users" className={`sidebar-menu-link ${isActive("/admin/users") ? "active" : ""}`}>
                <i className="fas fa-users"></i>
                <span className="sidebar-text">Users</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/admin/feedback" className={`sidebar-menu-link ${isActive("/admin/feedback") ? "active" : ""}`}>
                <i className="fas fa-star"></i>
                <span className="sidebar-text">Feedback</span>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/dashboard" className="sidebar-menu-link">
                <i className="fas fa-arrow-left"></i>
                <span className="sidebar-text">Back to App</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-version">MentorLink v1.0</p>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
