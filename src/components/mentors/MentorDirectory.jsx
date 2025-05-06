"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "../common/PageTransition"
import "./MentorDirectory.css"

const MentorDirectory = ({ users, currentUser, sessionRequests, setSessionRequests, simulateLoading }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)
  const navigate = useNavigate()

  // Get all mentors
  const mentors = users.filter((user) => user.role === "mentor")

  // Get all unique skills from mentors
  const allSkills = [...new Set(mentors.flatMap((mentor) => mentor.skills || []))]

  // Filter mentors based on search term and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSkill = !selectedSkill || mentor.skills.includes(selectedSkill)

    return matchesSearch && matchesSkill
  })

  // Animation when filters change
  useEffect(() => {
    setIsFiltering(true)
    const timer = setTimeout(() => {
      setIsFiltering(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedSkill])

  const handleViewProfile = (mentor) => {
    navigate(`/mentor/${mentor.id}`)
  }

  const handleViewAvailability = (mentor) => {
    navigate(`/schedule?mentorId=${mentor.id}`)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <PageTransition>
      <div className="mentor-directory">
        <div className="container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Find a Mentor
          </motion.h1>

          <motion.div
            className="search-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                autoFocus
              />
            </div>

            <div className="filters">
              <div className="filter">
                <label htmlFor="skill-filter">
                  <i className="fas fa-tag filter-icon"></i>
                  Filter by Skill
                </label>
                <div className="skill-filter-options">
                  <button
                    className={`skill-filter-btn ${selectedSkill === "" ? "active" : ""}`}
                    onClick={() => setSelectedSkill("")}
                  >
                    <i className="fas fa-globe-americas"></i>
                    All
                  </button>
                  {allSkills.map((skill, index) => (
                    <button
                      key={index}
                      className={`skill-filter-btn ${selectedSkill === skill ? "active" : ""}`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <i className="fas fa-code"></i>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mentors-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <i className="fas fa-users"></i>
            <p>Found {filteredMentors.length} mentors</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchTerm}-${selectedSkill}`}
              className="mentors-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor, index) => (
                  <motion.div key={mentor.id} className="mentor-card" variants={itemVariants} custom={index} layout>
                    <div className="mentor-header">
                      <img
                        src={mentor.profilePicture || "/placeholder.svg?height=80&width=80"}
                        alt={mentor.name}
                        className="mentor-image"
                      />
                      <div className="mentor-info">
                        <h2>{mentor.name}</h2>
                        <div className="mentor-rating">
                          <span className="rating-stars">{"★".repeat(Math.floor(mentor.rating || 0))}</span>
                          <span className="rating-number">{mentor.rating || "No ratings"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mentor-bio">
                      <p>{mentor.bio}</p>
                    </div>

                    <div className="mentor-skills">
                      {mentor.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">
                          <i className="fas fa-code"></i>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mentor-actions">
                      <motion.button
                        className="btn btn-primary"
                        onClick={() => handleViewAvailability(mentor)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="fas fa-calendar-alt"></i>
                        View Availability
                      </motion.button>
                      <motion.button
                        className="btn btn-outline"
                        onClick={() => handleViewProfile(mentor)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="fas fa-user"></i>
                        View Profile
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="no-mentors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p>No mentors found matching your criteria.</p>
                  <motion.button
                    className="btn btn-outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedSkill("")
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-sync-alt"></i>
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

export default MentorDirectory
