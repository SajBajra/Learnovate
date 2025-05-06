"use client"

import { useState } from "react"
import "./Admin.css"

const AdminFeedback = ({ feedback, users }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState("")

  // Filter feedback based on search term and rating filter
  const filteredFeedback = feedback.filter((item) => {
    const mentor = users.find((user) => user.id === item.mentorId)
    const apprentice = users.find((user) => user.id === item.apprenticeId)

    const matchesSearch =
      (mentor && mentor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apprentice && apprentice.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating = !filterRating || item.rating === Number.parseInt(filterRating)

    return matchesSearch && matchesRating
  })

  // Sort feedback by date (newest first)
  filteredFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="admin-feedback">
      <div className="container">
        <h1>Feedback Management</h1>

        <div className="admin-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="rating-filter">
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="form-control">
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {filteredFeedback.length > 0 ? (
          <div className="feedback-list">
            {filteredFeedback.map((item) => {
              const mentor = users.find((user) => user.id === item.mentorId)
              const apprentice = users.find((user) => user.id === item.apprenticeId)

              return (
                <div key={item.id} className="feedback-card">
                  <div className="feedback-header">
                    <div className="feedback-users">
                      <div className="feedback-user">
                        <img
                          src={apprentice?.profilePicture || "/placeholder.svg"}
                          alt={apprentice?.name}
                          className="feedback-user-image"
                        />
                        <div>
                          <h3>{apprentice?.name}</h3>
                          <p>Apprentice</p>
                        </div>
                      </div>
                      <div className="feedback-arrow">→</div>
                      <div className="feedback-user">
                        <img
                          src={mentor?.profilePicture || "/placeholder.svg"}
                          alt={mentor?.name}
                          className="feedback-user-image"
                        />
                        <div>
                          <h3>{mentor?.name}</h3>
                          <p>Mentor</p>
                        </div>
                      </div>
                    </div>
                    <div className="feedback-rating">
                      <span className="rating-stars">{"★".repeat(item.rating)}</span>
                      <span className="rating-number">{item.rating}/5</span>
                    </div>
                  </div>

                  <div className="feedback-content">
                    <p>{item.comment}</p>
                  </div>

                  <div className="feedback-footer">
                    <p className="feedback-date">Submitted on {item.createdAt}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="no-feedback">
            <p>No feedback found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminFeedback
