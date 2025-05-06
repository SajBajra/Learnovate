"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import "./SessionRequests.css"

const SessionRequests = ({ currentUser, sessionRequests, setSessionRequests, users, setFeedback }) => {
  const [feedbackData, setFeedbackData] = useState({
    sessionId: null,
    rating: 5,
    comment: "",
  })
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // Filter requests based on user role
  const userRequests = sessionRequests.filter((request) =>
    currentUser.role === "mentor" ? request.mentorId === currentUser.id : request.apprenticeId === currentUser.id,
  )

  // Group requests by status
  const pendingRequests = userRequests.filter((request) => request.status === "pending")
  const acceptedRequests = userRequests.filter((request) => request.status === "accepted")
  const completedRequests = userRequests.filter((request) => request.status === "completed")
  const rejectedRequests = userRequests.filter((request) => request.status === "rejected")

  const handleStatusChange = (requestId, newStatus) => {
    const updatedRequests = sessionRequests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request,
    )

    setSessionRequests(updatedRequests)

    const statusMessages = {
      accepted: "Session request accepted",
      rejected: "Session request rejected",
      completed: "Session marked as completed",
    }

    toast.success(statusMessages[newStatus] || "Status updated")

    if (newStatus === "completed" && currentUser.role === "apprentice") {
      // Show feedback modal for apprentice
      setFeedbackData({
        ...feedbackData,
        sessionId: requestId,
      })
      setShowFeedbackModal(true)
    }
  }

  const handleFeedbackChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.name === "rating" ? Number.parseInt(e.target.value) : e.target.value,
    })
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()

    const session = sessionRequests.find((request) => request.id === feedbackData.sessionId)

    const newFeedback = {
      id: Date.now(),
      sessionRequestId: feedbackData.sessionId,
      mentorId: session.mentorId,
      apprenticeId: currentUser.id,
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setFeedback((prevFeedback) => [...prevFeedback, newFeedback])
    setShowFeedbackModal(false)
    setFeedbackData({
      sessionId: null,
      rating: 5,
      comment: "",
    })

    toast.success("Feedback submitted successfully")
  }

  const getOtherUser = (request) => {
    return users.find((user) =>
      currentUser.role === "mentor" ? user.id === request.apprenticeId : user.id === request.mentorId,
    )
  }

  const renderRequestList = (requests, title) => {
    if (requests.length === 0) {
      return null
    }

    return (
      <div className="request-section">
        <h2>{title}</h2>
        <div className="request-list">
          {requests.map((request) => {
            const otherUser = getOtherUser(request)

            return (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <img
                    src={otherUser?.profilePicture || "/placeholder.svg"}
                    alt={otherUser?.name}
                    className="user-image"
                  />
                  <div className="request-info">
                    <h3>{request.topic}</h3>
                    <p>
                      with <strong>{otherUser?.name}</strong>
                    </p>
                    <p className="request-date">
                      {request.date} at {request.time}
                    </p>
                  </div>
                </div>

                <div className="request-message">
                  <p>{request.message}</p>
                </div>

                <div className="request-actions">
                  {currentUser.role === "mentor" && request.status === "pending" && (
                    <>
                      <button className="btn btn-success" onClick={() => handleStatusChange(request.id, "accepted")}>
                        Accept
                      </button>
                      <button className="btn btn-danger" onClick={() => handleStatusChange(request.id, "rejected")}>
                        Decline
                      </button>
                    </>
                  )}

                  {request.status === "accepted" && (
                    <>
                      <Link to={`/messages/${otherUser?.id}`} className="btn btn-primary">
                        Message
                      </Link>
                      <button className="btn btn-outline" onClick={() => handleStatusChange(request.id, "completed")}>
                        Mark Completed
                      </button>
                    </>
                  )}

                  {request.status === "completed" && currentUser.role === "apprentice" && (
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setFeedbackData({
                          ...feedbackData,
                          sessionId: request.id,
                        })
                        setShowFeedbackModal(true)
                      }}
                    >
                      Leave Feedback
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="session-requests">
      <div className="container">
        <h1>Session Requests</h1>

        {userRequests.length === 0 ? (
          <div className="no-requests">
            <p>You don't have any session requests yet.</p>
            {currentUser.role === "apprentice" && (
              <Link to="/mentors" className="btn btn-primary">
                Find Mentors
              </Link>
            )}
          </div>
        ) : (
          <div className="requests-container">
            {renderRequestList(pendingRequests, "Pending Requests")}
            {renderRequestList(acceptedRequests, "Upcoming Sessions")}
            {renderRequestList(completedRequests, "Completed Sessions")}
            {renderRequestList(rejectedRequests, "Declined Requests")}
          </div>
        )}

        {showFeedbackModal && (
          <div className="modal-overlay">
            <div className="feedback-modal">
              <h2>Leave Feedback</h2>
              <form onSubmit={handleFeedbackSubmit}>
                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="rating-label">
                        <input
                          type="radio"
                          name="rating"
                          value={value}
                          checked={feedbackData.rating === value}
                          onChange={handleFeedbackChange}
                        />
                        <span className={`rating-star ${value <= feedbackData.rating ? "active" : ""}`}>★</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Comments</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={feedbackData.comment}
                    onChange={handleFeedbackChange}
                    className="form-control"
                    rows="4"
                    placeholder="Share your experience with this mentor..."
                    required
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    Submit Feedback
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowFeedbackModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionRequests
