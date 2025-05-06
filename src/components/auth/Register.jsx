"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "./Auth.css"

const Register = ({ setIsAuthenticated, setCurrentUser, users, setUsers }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "apprentice",
    bio: "",
    skills: "",
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const { name, email, password, confirmPassword, role, bio, skills } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
      toast.error("Email already registered")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role,
        bio,
        skills: skills.split(",").map((skill) => skill.trim()),
        profilePicture: "/placeholder.svg?height=200&width=200",
        ...(role === "mentor" && { availability: "Flexible", rating: 0 }),
      }

      setUsers([...users, newUser])
      setIsAuthenticated(true)
      setCurrentUser(newUser)
      toast.success("Registration successful!")
      navigate("/dashboard")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for MentorLink</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
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
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">I want to be a:</label>
            <select id="role" name="role" value={role} onChange={handleChange} className="form-control" required>
              <option value="apprentice">Apprentice</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Tell us about yourself..."
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={skills}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. JavaScript, React, CSS"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
