"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import "./Profile.css"

const Profile = ({ currentUser, setCurrentUser, users, setUsers }) => {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.bio || "",
    skills: currentUser.skills ? currentUser.skills.join(", ") : "",
    availability: currentUser.availability || "Flexible",
    password: "",
    confirmPassword: "",
  })

  const [previewImage, setPreviewImage] = useState(currentUser.profilePicture)
  const [loading, setLoading] = useState(false)

  const { name, email, bio, skills, availability, password, confirmPassword } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Simulate file upload by creating a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
      toast.info("Image preview updated. Changes will be saved when you update profile.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...currentUser,
        name,
        email,
        bio,
        skills: skills.split(",").map((skill) => skill.trim()),
        ...(currentUser.role === "mentor" && { availability }),
        ...(password && { password }),
        profilePicture: previewImage,
      }

      // Update current user
      setCurrentUser(updatedUser)

      // Update users array
      const updatedUsers = users.map((user) => (user.id === currentUser.id ? updatedUser : user))
      setUsers(updatedUsers)

      toast.success("Profile updated successfully")
      setLoading(false)

      // Reset password fields
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  return (
    <div className="profile-container">
      <div className="container">
        <h1>My Profile</h1>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-image-container">
              <img src={previewImage || "/placeholder.svg"} alt={currentUser.name} className="profile-image" />
              <div className="profile-image-overlay">
                <label htmlFor="profile-image-upload" className="image-upload-label">
                  Change Photo
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
              </div>
            </div>

            <div className="profile-info">
              <h2>{currentUser.name}</h2>
              <p className="profile-role">{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</p>

              {currentUser.role === "mentor" && (
                <div className="profile-rating">
                  <span className="rating-stars">{"★".repeat(Math.floor(currentUser.rating || 0))}</span>
                  <span className="rating-number">{currentUser.rating || "No ratings yet"}</span>
                </div>
              )}

              <div className="profile-skills">
                <h3>Skills</h3>
                <div className="skills-list">
                  {currentUser.skills &&
                    currentUser.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-form-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form">
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
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
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
                  required
                />
              </div>

              {currentUser.role === "mentor" && (
                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <select
                    id="availability"
                    name="availability"
                    value={availability}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Flexible">Flexible</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Evenings">Evenings</option>
                    <option value="Mornings">Mornings</option>
                  </select>
                </div>
              )}

              <h3 className="password-section-title">Change Password</h3>
              <p className="password-section-info">Leave blank to keep current password</p>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="form-control"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
