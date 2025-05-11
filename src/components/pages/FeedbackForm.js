"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    category: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <section className="feedback-section" id="feedback">
      <div className="container">
        <div className="feedback-container">
          {!submitted ? (
            <>
              <div className="feedback-header">
                <h2>Share Your Feedback</h2>
                <p>We value your input to continuously improve our mentorship platform</p>
              </div>
              <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="feedback-form-row">
                  <div className="feedback-form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="feedback-input"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="feedback-form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="feedback-input"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="feedback-form-row">
                  <div className="feedback-form-group">
                    <label>How would you rate our platform?</label>
                    <div className="rating-stars-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={star <= formData.rating ? "active" : ""}
                          onClick={() => handleRatingClick(star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="feedback-form-group">
                    <label htmlFor="category">Feedback Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="feedback-input"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Feedback</option>
                      <option value="mentors">Mentors & Matching</option>
                      <option value="ui">User Interface</option>
                      <option value="features">Feature Requests</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>
                </div>

                <div className="feedback-form-group">
                  <label htmlFor="message">Your Feedback</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="feedback-input feedback-textarea"
                    required
                    placeholder="Please share your thoughts, suggestions, or experiences..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="feedback-submit"
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </motion.button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Thank You for Your Feedback!</h3>
              <p>
                We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve the
                Learnovate platform for everyone.
              </p>
              <motion.button
                className="btn btn-primary"
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    name: "",
                    email: "",
                    rating: 0,
                    category: "",
                    message: "",
                  })
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Another Response
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeedbackForm
