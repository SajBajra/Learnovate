"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "../common/PageTransition"
import "./MentorDirectory.css"

const MentorDirectory = ({ users, currentUser, sessionRequests, setSessionRequests, simulateLoading }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isFiltering, setIsFiltering] = useState(false)
  const navigate = useNavigate()

  // Get all mentors
  const mentors = users.filter((user) => user.role === "mentor")

  // Domain categories
  const domainCategories = {
    "Web & Mobile": ["Web Development", "Mobile Development", "Frontend Development", "Backend Development"],
    "Data & AI": ["Data Science", "Machine Learning", "Artificial Intelligence", "Big Data"],
    Design: ["UI/UX Design", "Graphic Design", "Product Design"],
    "DevOps & Cloud": ["DevOps", "Cloud Computing", "System Administration"],
    Security: ["Cybersecurity", "Network Security", "Ethical Hacking"],
    Other: ["Game Development", "Blockchain", "IoT", "Embedded Systems"],
  }

  // Get all unique domains from mentors
  const uniqueDomains = [...new Set(mentors.map((mentor) => mentor.domain).filter(Boolean))]

  // Filter mentors based on search term and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mentor.domain && mentor.domain.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDomain = !selectedDomain || mentor.domain === selectedDomain
    const matchesCategory =
      !selectedCategory ||
      (mentor.domain &&
        Object.entries(domainCategories).some(
          ([category, domains]) => category === selectedCategory && domains.includes(mentor.domain),
        ))

    return matchesSearch && (matchesDomain || matchesCategory)
  })

  // Animation when filters change
  useEffect(() => {
    setIsFiltering(true)
    const timer = setTimeout(() => {
      setIsFiltering(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedDomain, selectedCategory])

  const handleViewProfile = (mentor) => {
    navigate(`/mentor/${mentor.id}`)
  }

  const handleViewSchedule = (mentor) => {
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
                placeholder="Search by name, skill, or domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                autoFocus
              />
            </div>

            <div className="filters">
              <div className="domain-categories">
                <button
                  className={`category-btn ${selectedCategory === "" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory("")
                    setSelectedDomain("")
                  }}
                >
                  <i className="fas fa-globe"></i>
                  All Categories
                </button>

                {Object.keys(domainCategories).map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCategory(category)
                      setSelectedDomain("")
                    }}
                  >
                    <i
                      className={`fas ${
                        category === "Web & Mobile"
                          ? "fa-laptop-code"
                          : category === "Data & AI"
                            ? "fa-brain"
                            : category === "Design"
                              ? "fa-paint-brush"
                              : category === "DevOps & Cloud"
                                ? "fa-cloud"
                                : category === "Security"
                                  ? "fa-shield-alt"
                                  : "fa-code-branch"
                      }`}
                    ></i>
                    {category}
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <div className="domain-filter">
                  <div className="domain-label">
                    <i className="fas fa-filter"></i>
                    <span>Filter by Domain:</span>
                  </div>
                  <div className="domain-options">
                    <button
                      className={`domain-option ${selectedDomain === "" ? "active" : ""}`}
                      onClick={() => setSelectedDomain("")}
                    >
                      All {selectedCategory} Domains
                    </button>
                    {domainCategories[selectedCategory].map((domain) => (
                      <button
                        key={domain}
                        className={`domain-option ${selectedDomain === domain ? "active" : ""}`}
                        onClick={() => setSelectedDomain(domain)}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              key={`${searchTerm}-${selectedDomain}-${selectedCategory}`}
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
                        {mentor.domain && (
                          <div className="domain-badge">
                            <i className="fas fa-globe"></i> {mentor.domain}
                          </div>
                        )}
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
                        onClick={() => handleViewSchedule(mentor)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="fas fa-calendar-alt"></i>
                        Book Session
                      </motion.button>
                      <motion.button
                        className="btn btn-outline"
                        onClick={() => navigate(`/schedule?mentorId=${mentor.id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className="fas fa-calendar-check"></i>
                        View Schedule
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
                      setSelectedDomain("")
                      setSelectedCategory("")
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
