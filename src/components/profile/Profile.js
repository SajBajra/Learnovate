"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import "./Profile.css"

const Profile = ({ currentUser, setCurrentUser, users, setUsers, simulateLoading }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    bio: currentUser?.bio || "",
    skills: currentUser?.skills?.join(", ") || "",
    email: currentUser?.email || "",
    availability: currentUser?.availability || "Flexible",
    domain: currentUser?.domain || "",
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        skills: currentUser.skills?.join(", ") || "",
        email: currentUser.email || "",
        availability: currentUser.availability || "Flexible",
        domain: currentUser.domain || "",
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        email: formData.email,
        availability: formData.availability,
        domain: formData.domain,
      }

      setCurrentUser(updatedUser)

      // Update user in the users array
      const updatedUsers = users.map((user) => (user.id === currentUser.id ? updatedUser : user))
      setUsers(updatedUsers)

      setIsEditing(false)
      setLoading(false)
      toast.success("Profile updated successfully!")
    }, 1000)
  }

  const cancelEdit = () => {
    setFormData({
      name: currentUser.name,
      bio: currentUser.bio,
      skills: currentUser.skills.join(", "),
      email: currentUser.email,
      availability: currentUser.availability || "Flexible",
      domain: currentUser.domain || "",
    })
    setIsEditing(false)
  }

  if (!currentUser) return null

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar">
            <img src={currentUser.profilePicture || "/placeholder.svg?height=150&width=150"} alt={currentUser.name} />
          </div>
        </div>
        <div className="profile-info">
          <h1>{currentUser.name}</h1>
          <div className="profile-badges">
            <span className="profile-role-badge">{currentUser.role === "mentor" ? "Mentor" : "Apprentice"}</span>
            {currentUser.domain && <span className="profile-domain-badge">{currentUser.domain}</span>}
          </div>
          {!isEditing && (
            <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <i className="fas fa-user"></i> Overview
          </button>
          <button
            className={`tab-button ${activeTab === "skills" ? "active" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <i className="fas fa-tools"></i> Skills
          </button>
          {currentUser.role === "mentor" && (
            <button
              className={`tab-button ${activeTab === "availability" ? "active" : ""}`}
              onClick={() => setActiveTab("availability")}
            >
              <i className="fas fa-calendar-alt"></i> Availability
            </button>
          )}
          <button
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === "overview" && (
            <div className="tab-pane">
              <div className="profile-section">
                <div className="section-header">
                  <h2>About Me</h2>
                  {!isEditing && (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
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
                        value={formData.email}
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
                        value={formData.bio}
                        onChange={handleChange}
                        className="form-control"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="domain">Domain</label>
                      <input
                        type="text"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="skills">Skills (comma separated)</label>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skills}
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
                          value={formData.availability}
                          onChange={handleChange}
                          className="form-control"
                        >
                          <option value="Flexible">Flexible</option>
                          <option value="Weekdays">Weekdays</option>
                          <option value="Weekends">Weekends</option>
                          <option value="Evenings">Evenings</option>
                          <option value="Limited">Limited</option>
                        </select>
                      </div>
                    )}
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner"></span> Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-bio">
                    <p>{currentUser.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="tab-pane">
              <div className="profile-section">
                <div className="section-header">
                  <h2>Skills & Expertise</h2>
                </div>
                <div className="skills-container">
                  {currentUser.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "availability" && currentUser.role === "mentor" && (
            <div className="tab-pane">
              <div className="profile-section">
                <div className="section-header">
                  <h2>Availability</h2>
                </div>
                <div className="availability-info">
                  <p>
                    <strong>Current Availability:</strong> {currentUser.availability || "Flexible"}
                  </p>
                  <div className="availability-calendar">
                    <h3>Weekly Schedule</h3>
                    <div className="calendar-placeholder">
                      <p>Your calendar will appear here once you set your schedule.</p>
                      <button className="btn btn-outline">
                        <i className="fas fa-calendar-plus"></i> Set Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="tab-pane">
              <div className="profile-section">
                <div className="section-header">
                  <h2>Account Settings</h2>
                </div>
                <div className="settings-options">
                  <div className="settings-group">
                    <h3>Account</h3>
                    <div className="settings-item">
                      <div className="settings-item-info">
                        <h4>Change Password</h4>
                        <p>Update your account password</p>
                      </div>
                      <div className="settings-item-control">
                        <button className="btn btn-outline btn-sm">Change Password</button>
                      </div>
                    </div>
                    <div className="settings-item danger-zone">
                      <div className="settings-item-info">
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all data</p>
                      </div>
                      <div className="settings-item-control">
                        <button className="btn btn-danger btn-sm">Delete Account</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
