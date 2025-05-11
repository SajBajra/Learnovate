"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import PageTransition from "../common/PageTransition"
import "./Challenges.css"

const Challenges = ({ currentUser, users, mockChallenges, setMockChallenges }) => {
  // State for filtering and viewing challenges
  const [view, setView] = useState(currentUser.role === "mentor" ? "created" : "available")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [isViewingDetail, setIsViewingDetail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for challenge creation form
  const [challengeForm, setChallengeForm] = useState({
    title: "",
    description: "",
    difficulty: "Intermediate",
    domain: currentUser.domain || "Web Development",
    skills: [],
    requirements: [""],
    resources: [{ title: "", url: "" }],
    expectedDeliverable: "",
    timeframe: "1 week",
  })

  // State for challenge submission form
  const [submissionForm, setSubmissionForm] = useState({
    submissionUrl: "",
    comments: "",
  })

  // Get all domains from users who are mentors
  const uniqueDomains = [...new Set(users.filter((user) => user.role === "mentor").map((user) => user.domain))]

  // Filter challenges based on view and filters
  const filteredChallenges = mockChallenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesDomain = !selectedDomain || challenge.domain === selectedDomain
    const matchesDifficulty = !selectedDifficulty || challenge.difficulty === selectedDifficulty

    // Filter based on view
    if (view === "created" && currentUser.role === "mentor") {
      return challenge.mentorId === currentUser.id && matchesSearch && matchesDomain && matchesDifficulty
    } else if (view === "available" && currentUser.role === "apprentice") {
      return matchesSearch && matchesDomain && matchesDifficulty
    } else if (view === "submitted" && currentUser.role === "apprentice") {
      return (
        challenge.submissions.some((submission) => submission.apprenticeId === currentUser.id) &&
        matchesSearch &&
        matchesDomain &&
        matchesDifficulty
      )
    } else if (view === "submissions" && currentUser.role === "mentor") {
      return (
        challenge.mentorId === currentUser.id &&
        challenge.submissions.length > 0 &&
        matchesSearch &&
        matchesDomain &&
        matchesDifficulty
      )
    }

    return false
  })

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setChallengeForm({
      ...challengeForm,
      [name]: value,
    })
  }

  // Handle adding a requirement
  const handleAddRequirement = () => {
    setChallengeForm({
      ...challengeForm,
      requirements: [...challengeForm.requirements, ""],
    })
  }

  // Handle updating a requirement
  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...challengeForm.requirements]
    updatedRequirements[index] = value
    setChallengeForm({
      ...challengeForm,
      requirements: updatedRequirements,
    })
  }

  // Handle removing a requirement
  const handleRemoveRequirement = (index) => {
    const updatedRequirements = challengeForm.requirements.filter((_, i) => i !== index)
    setChallengeForm({
      ...challengeForm,
      requirements: updatedRequirements,
    })
  }

  // Handle adding a resource
  const handleAddResource = () => {
    setChallengeForm({
      ...challengeForm,
      resources: [...challengeForm.resources, { title: "", url: "" }],
    })
  }

  // Handle updating a resource
  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...challengeForm.resources]
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    }
    setChallengeForm({
      ...challengeForm,
      resources: updatedResources,
    })
  }

  // Handle removing a resource
  const handleRemoveResource = (index) => {
    const updatedResources = challengeForm.resources.filter((_, i) => i !== index)
    setChallengeForm({
      ...challengeForm,
      resources: updatedResources,
    })
  }

  // Handle skill input
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim())
    setChallengeForm({
      ...challengeForm,
      skills: skillsArray.filter((skill) => skill !== ""),
    })
  }

  // Handle creating a new challenge
  const handleCreateChallenge = (e) => {
    e.preventDefault()

    // Validate form
    if (
      !challengeForm.title ||
      !challengeForm.description ||
      !challengeForm.expectedDeliverable ||
      challengeForm.requirements.some((req) => !req) ||
      challengeForm.resources.some((res) => !res.title || !res.url)
    ) {
      toast.error("Please fill in all fields")
      return
    }

    const newChallenge = {
      id: mockChallenges.length + 1,
      mentorId: currentUser.id,
      title: challengeForm.title,
      description: challengeForm.description,
      difficulty: challengeForm.difficulty,
      domain: challengeForm.domain,
      skills: challengeForm.skills,
      requirements: challengeForm.requirements,
      resources: challengeForm.resources,
      expectedDeliverable: challengeForm.expectedDeliverable,
      timeframe: challengeForm.timeframe,
      createdAt: new Date().toISOString().split("T")[0],
      submissions: [],
    }

    setMockChallenges([...mockChallenges, newChallenge])
    toast.success("Challenge created successfully!")
    setIsCreatingChallenge(false)

    // Reset form
    setChallengeForm({
      title: "",
      description: "",
      difficulty: "Intermediate",
      domain: currentUser.domain || "Web Development",
      skills: [],
      requirements: [""],
      resources: [{ title: "", url: "" }],
      expectedDeliverable: "",
      timeframe: "1 week",
    })
  }

  // Handle submitting a challenge
  const handleSubmitChallenge = (e) => {
    e.preventDefault()

    if (!submissionForm.submissionUrl || !submissionForm.comments) {
      toast.error("Please fill in all fields")
      return
    }

    const newSubmission = {
      id: selectedChallenge.submissions.length + 1,
      apprenticeId: currentUser.id,
      submissionUrl: submissionForm.submissionUrl,
      comments: submissionForm.comments,
      status: "submitted",
      submittedAt: new Date().toISOString().split("T")[0],
      feedback: null,
    }

    const updatedChallenges = mockChallenges.map((challenge) => {
      if (challenge.id === selectedChallenge.id) {
        return {
          ...challenge,
          submissions: [...challenge.submissions, newSubmission],
        }
      }
      return challenge
    })

    setMockChallenges(updatedChallenges)
    toast.success("Challenge submitted successfully!")
    setIsSubmitting(false)
    setIsViewingDetail(false)

    // Reset form
    setSubmissionForm({
      submissionUrl: "",
      comments: "",
    })
  }

  // Handle providing feedback on a submission
  const handleProvideFeedback = (challenge, submission, rating, comments) => {
    const updatedChallenges = mockChallenges.map((c) => {
      if (c.id === challenge.id) {
        const updatedSubmissions = c.submissions.map((s) => {
          if (s.id === submission.id) {
            return {
              ...s,
              status: rating >= 3 ? "approved" : "rejected",
              feedback: {
                rating,
                comments,
                providedAt: new Date().toISOString().split("T")[0],
              },
            }
          }
          return s
        })
        return {
          ...c,
          submissions: updatedSubmissions,
        }
      }
      return c
    })

    setMockChallenges(updatedChallenges)
    toast.success("Feedback provided successfully!")
  }

  // Handle cancelling challenge creation
  const handleCancelCreate = () => {
    setIsCreatingChallenge(false)
    setChallengeForm({
      title: "",
      description: "",
      difficulty: "Intermediate",
      domain: currentUser.domain || "Web Development",
      skills: [],
      requirements: [""],
      resources: [{ title: "", url: "" }],
      expectedDeliverable: "",
      timeframe: "1 week",
    })
  }

  // Function to get mentor name by ID
  const getMentorName = (mentorId) => {
    const mentor = users.find((user) => user.id === mentorId)
    return mentor ? mentor.name : "Unknown Mentor"
  }

  // Function to get mentor profile picture by ID
  const getMentorProfilePicture = (mentorId) => {
    const mentor = users.find((user) => user.id === mentorId)
    return mentor ? mentor.profilePicture : "/placeholder.svg?height=30&width=30"
  }

  // Function to get apprentice name by ID
  const getApprenticeName = (apprenticeId) => {
    const apprentice = users.find((user) => user.id === apprenticeId)
    return apprentice ? apprentice.name : "Unknown Apprentice"
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

  // Render create challenge form
  const renderCreateChallengeForm = () => {
    return (
      <div className="create-challenge-form">
        <div className="form-header">
          <h2>Create a New Challenge</h2>
          <p>Design a challenge to help apprentices develop their skills and showcase their abilities.</p>
        </div>

        <form onSubmit={handleCreateChallenge}>
          <div className="form-section">
            <h3>Challenge Details</h3>
            <div className="form-group">
              <label htmlFor="title">
                <i className="fas fa-heading"></i> Challenge Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="e.g., Build a React Weather App"
                value={challengeForm.title}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                <i className="fas fa-align-left"></i> Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Describe the challenge in detail..."
                value={challengeForm.description}
                onChange={handleFormChange}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficulty">
                  <i className="fas fa-signal"></i> Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="form-control"
                  value={challengeForm.difficulty}
                  onChange={handleFormChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="domain">
                  <i className="fas fa-globe"></i> Domain
                </label>
                <select
                  id="domain"
                  name="domain"
                  className="form-control"
                  value={challengeForm.domain}
                  onChange={handleFormChange}
                >
                  {uniqueDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timeframe">
                  <i className="fas fa-clock"></i> Timeframe
                </label>
                <select
                  id="timeframe"
                  name="timeframe"
                  className="form-control"
                  value={challengeForm.timeframe}
                  onChange={handleFormChange}
                >
                  <option value="1 day">1 day</option>
                  <option value="3 days">3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">
                <i className="fas fa-tags"></i> Skills (comma separated)
              </label>
              <input
                type="text"
                id="skills"
                className="form-control"
                placeholder="e.g., React, API Integration, CSS"
                value={challengeForm.skills.join(", ")}
                onChange={handleSkillsChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Requirements</h3>
            <p>List the specific requirements that apprentices must fulfill.</p>

            <div className="requirements-list">
              {challengeForm.requirements.map((requirement, index) => (
                <div key={index} className="requirement-item">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Must use React Hooks"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    required
                  />
                  {challengeForm.requirements.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveRequirement(index)}>
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="add-item-btn" onClick={handleAddRequirement}>
              <i className="fas fa-plus"></i> Add Requirement
            </button>
          </div>

          <div className="form-section">
            <h3>Resources</h3>
            <p>Provide helpful resources for apprentices to complete the challenge.</p>

            <div className="resources-list">
              {challengeForm.resources.map((resource, index) => (
                <div key={index} className="resource-item">
                  <div className="form-row">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Resource Title"
                      value={resource.title}
                      onChange={(e) => handleResourceChange(index, "title", e.target.value)}
                      required
                    />
                    <input
                      type="url"
                      className="form-control"
                      placeholder="URL (https://...)"
                      value={resource.url}
                      onChange={(e) => handleResourceChange(index, "url", e.target.value)}
                      required
                    />
                    {challengeForm.resources.length > 1 && (
                      <button type="button" className="remove-item-btn" onClick={() => handleRemoveResource(index)}>
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="add-item-btn" onClick={handleAddResource}>
              <i className="fas fa-plus"></i> Add Resource
            </button>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="expectedDeliverable">
                <i className="fas fa-file-code"></i> Expected Deliverable
              </label>
              <input
                type="text"
                id="expectedDeliverable"
                name="expectedDeliverable"
                className="form-control"
                placeholder="e.g., GitHub repository with working code and README"
                value={challengeForm.expectedDeliverable}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={handleCancelCreate}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Challenge
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Render challenge cards
  const renderChallengeCards = () => {
    if (filteredChallenges.length === 0) {
      return (
        <div className="no-challenges">
          <h2>No challenges found</h2>
          {view === "created" && currentUser.role === "mentor" ? (
            <>
              <p>You haven't created any challenges yet. Create your first challenge to help apprentices grow!</p>
              <button className="btn btn-primary" onClick={() => setIsCreatingChallenge(true)}>
                <i className="fas fa-plus"></i> Create Challenge
              </button>
            </>
          ) : (
            <p>No challenges match your current filters. Try adjusting your search criteria.</p>
          )}
        </div>
      )
    }

    return (
      <motion.div className="challenges-grid" variants={containerVariants} initial="hidden" animate="visible">
        {filteredChallenges.map((challenge) => {
          // Get submission status if the user is an apprentice
          let submissionStatus = null
          if (currentUser.role === "apprentice") {
            const submission = challenge.submissions.find((sub) => sub.apprenticeId === currentUser.id)
            if (submission) {
              submissionStatus = submission.status
            }
          }

          return (
            <motion.div key={challenge.id} className="challenge-card" variants={itemVariants}>
              <div className="challenge-card-header">
                <span
                  className={`challenge-difficulty difficulty-${challenge.difficulty.toLowerCase()}`}
                  title="Difficulty Level"
                >
                  {challenge.difficulty}
                </span>
                <h3 className="challenge-title">{challenge.title}</h3>
                <div className="challenge-info">
                  <div className="challenge-mentor">
                    <img
                      src={getMentorProfilePicture(challenge.mentorId) || "/placeholder.svg"}
                      alt={getMentorName(challenge.mentorId)}
                      className="challenge-mentor-image"
                    />
                    <span>{getMentorName(challenge.mentorId)}</span>
                  </div>
                  <span className="challenge-domain">
                    <i className="fas fa-globe"></i>
                    {challenge.domain}
                  </span>
                </div>
              </div>

              <div className="challenge-card-body">
                <p className="challenge-description">{challenge.description}</p>

                <div className="challenge-skills">
                  {challenge.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="challenge-timeframe">
                  <i className="fas fa-clock"></i>
                  <span>Timeframe: {challenge.timeframe}</span>
                </div>
              </div>

              <div className="challenge-card-footer">
                {view === "submissions" && currentUser.role === "mentor" ? (
                  <div className="submission-count">
                    <i className="fas fa-file-code"></i>{" "}
                    <span>{challenge.submissions.length} submission(s) to review</span>
                  </div>
                ) : (
                  <div className="submission-status">
                    {submissionStatus && (
                      <>
                        <i
                          className={`fas ${
                            submissionStatus === "approved"
                              ? "fa-check-circle"
                              : submissionStatus === "rejected"
                                ? "fa-times-circle"
                                : "fa-clock"
                          }`}
                        ></i>
                        <span className={`status-${submissionStatus}`}>
                          {submissionStatus.charAt(0).toUpperCase() + submissionStatus.slice(1)}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="challenge-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedChallenge(challenge)
                      setIsViewingDetail(true)
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    {view === "submissions" ? "Review Submissions" : "View Details"}
                  </button>

                  {view === "created" && currentUser.role === "mentor" && (
                    <button className="btn btn-outline">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    )
  }

  // Render challenge detail modal
  const renderChallengeDetail = () => {
    if (!selectedChallenge) return null

    const userSubmission =
      currentUser.role === "apprentice"
        ? selectedChallenge.submissions.find((sub) => sub.apprenticeId === currentUser.id)
        : null

    return (
      <div className="modal-overlay" onClick={() => setIsViewingDetail(false)}>
        <div className="challenge-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <span
              className={`challenge-difficulty difficulty-${selectedChallenge.difficulty.toLowerCase()}`}
              title="Difficulty Level"
            >
              {selectedChallenge.difficulty}
            </span>
            <h2>{selectedChallenge.title}</h2>
            <div className="challenge-info">
              <div className="challenge-mentor">
                <img
                  src={getMentorProfilePicture(selectedChallenge.mentorId) || "/placeholder.svg"}
                  alt={getMentorName(selectedChallenge.mentorId)}
                  className="challenge-mentor-image"
                />
                <span>
                  Created by <strong>{getMentorName(selectedChallenge.mentorId)}</strong> on{" "}
                  {selectedChallenge.createdAt}
                </span>
              </div>
            </div>
            <button className="close-modal" onClick={() => setIsViewingDetail(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-body">
            {/* Challenge details tab content */}
            <div className="challenge-detail-section">
              <h3>
                <i className="fas fa-align-left"></i> Description
              </h3>
              <p>{selectedChallenge.description}</p>
            </div>

            <div className="challenge-detail-section">
              <h3>
                <i className="fas fa-clipboard-list"></i> Requirements
              </h3>
              <ul className="challenge-requirements">
                {selectedChallenge.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="challenge-detail-section">
              <h3>
                <i className="fas fa-tags"></i> Skills
              </h3>
              <div className="challenge-skills">
                {selectedChallenge.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="challenge-detail-section">
              <h3>
                <i className="fas fa-book"></i> Resources
              </h3>
              <ul className="challenge-resources">
                {selectedChallenge.resources.map((resource, index) => (
                  <li key={index}>
                    <i className="fas fa-link"></i>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="challenge-detail-section">
              <h3>
                <i className="fas fa-file-code"></i> Expected Deliverable
              </h3>
              <p>{selectedChallenge.expectedDeliverable}</p>
            </div>

            <div className="challenge-detail-section">
              <h3>
                <i className="fas fa-clock"></i> Timeframe
              </h3>
              <p>{selectedChallenge.timeframe}</p>
            </div>

            {currentUser.role === "mentor" && view === "submissions" && selectedChallenge.submissions.length > 0 && (
              <div className="challenge-submissions">
                <h3>
                  <i className="fas fa-file-alt"></i> Submissions
                </h3>
                {selectedChallenge.submissions.map((submission) => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <h4>
                        Submission by {getApprenticeName(submission.apprenticeId)} on {submission.submittedAt}
                      </h4>
                      <span className={`status-${submission.status}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    <div className="submission-details">
                      <p>
                        <strong>Submission URL:</strong>{" "}
                        <a href={submission.submissionUrl} target="_blank" rel="noopener noreferrer">
                          {submission.submissionUrl}
                        </a>
                      </p>
                      <p>
                        <strong>Comments:</strong> {submission.comments}
                      </p>

                      {submission.feedback ? (
                        <div className="submission-feedback">
                          <h5>Your Feedback</h5>
                          <p>
                            <strong>Rating:</strong> {submission.feedback.rating}/5
                          </p>
                          <p>
                            <strong>Comments:</strong> {submission.feedback.comments}
                          </p>
                          <p>
                            <strong>Provided on:</strong> {submission.feedback.providedAt}
                          </p>
                        </div>
                      ) : (
                        <div className="submission-actions">
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              handleProvideFeedback(selectedChallenge, submission, 5, "Great work! Well done.")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleProvideFeedback(
                                selectedChallenge,
                                submission,
                                2,
                                "Needs improvement. Please review the requirements.",
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentUser.role === "apprentice" && !userSubmission && !isSubmitting && (
              <div className="challenge-detail-section">
                <button className="btn btn-primary" onClick={() => setIsSubmitting(true)}>
                  <i className="fas fa-file-upload"></i> Submit Solution
                </button>
              </div>
            )}

            {currentUser.role === "apprentice" && userSubmission && (
              <div className="submission-card">
                <div className="submission-header">
                  <h4>Your Submission</h4>
                  <span className={`status-${userSubmission.status}`}>
                    {userSubmission.status.charAt(0).toUpperCase() + userSubmission.status.slice(1)}
                  </span>
                </div>
                <div className="submission-details">
                  <p>
                    <strong>Submission URL:</strong>{" "}
                    <a href={userSubmission.submissionUrl} target="_blank" rel="noopener noreferrer">
                      {userSubmission.submissionUrl}
                    </a>
                  </p>
                  <p>
                    <strong>Comments:</strong> {userSubmission.comments}
                  </p>
                  <p>
                    <strong>Submitted on:</strong> {userSubmission.submittedAt}
                  </p>

                  {userSubmission.feedback && (
                    <div className="submission-feedback">
                      <h5>Mentor Feedback</h5>
                      <p>
                        <strong>Rating:</strong> {userSubmission.feedback.rating}/5
                      </p>
                      <p>
                        <strong>Comments:</strong> {userSubmission.feedback.comments}
                      </p>
                      <p>
                        <strong>Provided on:</strong> {userSubmission.feedback.providedAt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isSubmitting && (
              <div className="submission-form">
                <h3>Submit Your Solution</h3>
                <form onSubmit={handleSubmitChallenge}>
                  <div className="form-group">
                    <label htmlFor="submissionUrl">
                      <i className="fas fa-link"></i> Submission URL
                    </label>
                    <input
                      type="url"
                      id="submissionUrl"
                      className="form-control"
                      placeholder="e.g., GitHub repository URL"
                      value={submissionForm.submissionUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, submissionUrl: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="comments">
                      <i className="fas fa-comment"></i> Comments
                    </label>
                    <textarea
                      id="comments"
                      className="form-control"
                      placeholder="Add any comments about your solution..."
                      value={submissionForm.comments}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, comments: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={() => setIsSubmitting(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Solution
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => setIsViewingDetail(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="challenges-container">
        <div className="container">
          <div className="challenges-header">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {currentUser.role === "mentor" ? "Manage Challenges" : "Coding Challenges"}
            </motion.h1>

            {currentUser.role === "mentor" ? (
              <div className="view-toggle">
                <button
                  className={`view-button ${view === "created" ? "active" : ""}`}
                  onClick={() => setView("created")}
                >
                  My Challenges
                </button>
                <button
                  className={`view-button ${view === "submissions" ? "active" : ""}`}
                  onClick={() => setView("submissions")}
                >
                  Submissions
                </button>
              </div>
            ) : (
              <div className="view-toggle">
                <button
                  className={`view-button ${view === "available" ? "active" : ""}`}
                  onClick={() => setView("available")}
                >
                  Available
                </button>
                <button
                  className={`view-button ${view === "submitted" ? "active" : ""}`}
                  onClick={() => setView("submitted")}
                >
                  Submitted
                </button>
              </div>
            )}
          </div>

          {!isCreatingChallenge && (
            <motion.div
              className="challenges-filters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="challenge-search">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="challenge-filters">
                <div className="filter-group">
                  <label htmlFor="domain-filter">
                    <i className="fas fa-globe filter-icon"></i>
                    Domain
                  </label>
                  <div className="domain-buttons">
                    <button
                      className={`domain-button ${selectedDomain === "" ? "active" : ""}`}
                      onClick={() => setSelectedDomain("")}
                    >
                      <i className="fas fa-globe-americas"></i>
                      All
                    </button>
                    {uniqueDomains.map((domain) => (
                      <button
                        key={domain}
                        className={`domain-button ${selectedDomain === domain ? "active" : ""}`}
                        onClick={() => setSelectedDomain(domain)}
                      >
                        <i className="fas fa-code-branch"></i>
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label htmlFor="difficulty-filter">
                    <i className="fas fa-signal filter-icon"></i>
                    Difficulty
                  </label>
                  <select
                    id="difficulty-filter"
                    className="filter-select"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {currentUser.role === "mentor" && view === "created" && (
                  <div className="filter-actions">
                    <button className="btn btn-primary" onClick={() => setIsCreatingChallenge(true)}>
                      <i className="fas fa-plus"></i> Create Challenge
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {isCreatingChallenge ? renderCreateChallengeForm() : renderChallengeCards()}

          {isViewingDetail && renderChallengeDetail()}
        </div>
      </div>
    </PageTransition>
  )
}

export default Challenges
