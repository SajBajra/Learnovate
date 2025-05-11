"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "./Auth.css"

const Login = ({ setIsAuthenticated, setCurrentUser, users }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const user = users.find((user) => user.email === email && user.password === password)

      if (user) {
        setIsAuthenticated(true)
        setCurrentUser(user)
        toast.success("Login successful!")
        navigate("/dashboard")
      } else {
        toast.error("Invalid credentials")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Learnovate</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
        <div className="demo-accounts">
          <h3>Demo Accounts</h3>
          <div className="demo-account">
            <p>
              <strong>Mentor:</strong> john@example.com / password123
            </p>
          </div>
          <div className="demo-account">
            <p>
              <strong>Apprentice:</strong> mike@example.com / password123
            </p>
          </div>
          <div className="demo-account">
            <p>
              <strong>Admin:</strong> admin@example.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
