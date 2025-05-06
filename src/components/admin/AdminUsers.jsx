"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import "./Admin.css"

const AdminUsers = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = !filterRole || user.role === filterRole

    return matchesSearch && matchesRole
  })

  // Count users by role
  const mentorCount = users.filter((user) => user.role === "mentor").length
  const apprenticeCount = users.filter((user) => user.role === "apprentice").length
  const adminCount = users.filter((user) => user.role === "admin").length

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      toast.success("User deleted successfully")
    }
  }

  return (
    <div className="admin-users">
      <div className="container">
        <h1>User Management</h1>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Mentors</h3>
            <p className="stat-number">{mentorCount}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Apprentices</h3>
            <p className="stat-number">{apprenticeCount}</p>
          </div>
          <div className="admin-stat-card">
            <h3>Admins</h3>
            <p className="stat-number">{adminCount}</p>
          </div>
        </div>

        <div className="admin-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="role-filter">
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="form-control">
              <option value="">All Roles</option>
              <option value="mentor">Mentors</option>
              <option value="apprentice">Apprentices</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="user-name-cell">
                      <img
                        src={user.profilePicture || "/placeholder.svg"}
                        alt={user.name}
                        className="user-table-image"
                      />
                      {user.name}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="skills-cell">
                      {user.skills ? (
                        user.skills.map((skill, index) => (
                          <span key={index} className="skill-badge">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="no-skills">N/A</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.role === "admin"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-results">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
