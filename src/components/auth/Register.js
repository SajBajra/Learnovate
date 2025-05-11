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
    role: "mentee",
    bio: "",
    phoneNumber: "",
    sessionPrice: "",
    areaOfExpertise: "",
    professionalTitle: "",
    yearsOfExperience: "",
    skills: "",
    profilePicture: null,
    documents: null,
    currentStatus: "",
    interestArea: "",
    agreedToTerms: false,
  })
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const {
    name,
    email,
    password,
    role,
    bio,
    phoneNumber,
    sessionPrice,
    areaOfExpertise,
    professionalTitle,
    yearsOfExperience,
    skills,
    profilePicture,
    documents,
    currentStatus,
    interestArea,
    agreedToTerms,
  } = formData

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        [e.target.name]: file || null,
      })
    } else if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.checked,
      })
    } else if (e.target.name === "skills") {
      setFormData({ ...formData, skills: e.target.value })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (step < (role === "mentor" ? 4 : 3)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSkip = () => {
    if (step === 2 && role === "mentee") {
      setStep(3) // Skip to final registration for mentee
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (users.some((user) => user.email === email)) {
      toast.error("Email already registered")
      return
    }

    if (!agreedToTerms) {
      toast.error("You must agree to the Terms & Conditions and Policy to register.")
      return
    }

    setLoading(true)

    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role,
        ...(role === "mentor" && {
          bio,
          phoneNumber,
          sessionPrice,
          areaOfExpertise,
          professionalTitle,
          yearsOfExperience,
          skills,
          profilePicture,
          documents,
          availability: "Flexible",
          rating: 0,
        }),
        ...(role === "mentee" && {
          phoneNumber,
          profilePicture,
          currentStatus,
          interestArea,
        }),
      }

      setUsers([...users, newUser])
      setIsAuthenticated(true)
      setCurrentUser(newUser)
      toast.success("Registration successful!")
      navigate("/profile")
      setLoading(false)
    }, 1000)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
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
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="mentee">Mentee</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
            </div>
          </>
        )
      case 2:
        if (role === "mentor") {
          return (
            <>
              <h3>Additional Information</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={bio}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your short description"
                    rows="4"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sessionPrice">Session Price</label>
                  <input
                    type="text"
                    id="sessionPrice"
                    name="sessionPrice"
                    value={sessionPrice}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter session price per hour"
                  />
                </div>
              </div>
            </>
          )
        } else {
          return (
            <>
              <h3>Complete Your Profile</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Add your profile</label>
                  <div className="profile-upload">
                    <div className="profile-placeholder">👤</div>
                    <button
                      type="button"
                      className="btn-upload"
                      onClick={() => document.getElementById("profilePicture").click()}
                    >
                      Upload photo
                    </button>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      className="form-control"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentStatus">Current Status</label>
                  <select
                    id="currentStatus"
                    name="currentStatus"
                    value={currentStatus}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select status</option>
                    <option value="Student">Student</option>
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Early Professional">Early Professional</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="interestArea">Interest Area</label>
                  <select
                    id="interestArea"
                    name="interestArea"
                    value={interestArea}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select interest</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
            </>
          )
        }
      case 3:
        if (role === "mentor") {
          return (
            <>
              <h3>Professional Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="areaOfExpertise">Area of Expertise</label>
                  <select
                    id="areaOfExpertise"
                    name="areaOfExpertise"
                    value={areaOfExpertise}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select an area</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="professionalTitle">Professional Title</label>
                  <input
                    type="text"
                    id="professionalTitle"
                    name="professionalTitle"
                    value={professionalTitle}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Eg: Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="yearsOfExperience">Years of Experience</label>
                  <select
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={yearsOfExperience}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select range</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="3+">3+ years</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="skills">Skills</label>
                  <select
                    id="skills"
                    name="skills"
                    value={skills}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select a skill</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                  </select>
                </div>
              </div>
            </>
          )
        } else {
          return (
            <>
              <h3>Registration Complete</h3>
              <p>No additional information required for mentees.</p>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={agreedToTerms}
                    onChange={handleChange}
                    className="form-control"
                  />{" "}
                  I agree to the Terms & Conditions and Policy
                </label>
              </div>
            </>
          )
        }
      case 4:
        if (role === "mentor") {
          return (
            <>
              <h3>Document Uploads</h3>
              <div className="form-grid single-column">
                <div className="form-group">
                  <label>Add your profile</label>
                  <div className="profile-upload">
                    <div className="profile-placeholder">👤</div>
                    <button
                      type="button"
                      className="btn-upload"
                      onClick={() => document.getElementById("profilePicture").click()}
                    >
                      Upload photo
                    </button>
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      onChange={handleChange}
                      className="form-control"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Add relevant documents (for verification)</label>
                  <div className="document-upload-wrapper">
                    <div className="document-upload">
                      <span className="cloud-icon">☁</span>
                      <span>Browse Files</span>
                      <span>Drag and drop files here</span>
                    </div>
                    <input
                      type="file"
                      id="documents"
                      name="documents"
                      onChange={handleChange}
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={agreedToTerms}
                    onChange={handleChange}
                    className="form-control"
                  />{" "}
                  I agree to the Terms & Conditions and Policy
                </label>
              </div>
            </>
          )
        }
        return null
      default:
        return null
    }
  }

  return (
    <div className="auth-container">
      <div className={`auth-card ${step > 1 ? "auth-card-wide" : ""}`}>
        <h2>Register for Learnovate</h2>
        {step > 1 && (
          <div className="stepper">
            {role === "mentor" ? (
              <>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  <span className="step-number">1</span> Additional Information
                </div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  <span className="step-number">2</span> Professional Information
                </div>
                <div className={`step ${step >= 4 ? "active" : ""}`}>
                  <span className="step-number">3</span> Document Uploads
                </div>
              </>
            ) : (
              <>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  <span className="step-number">1</span> Mentee Profile
                </div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  <span className="step-number">2</span> Registration Complete
                </div>
              </>
            )}
          </div>
        )}
        <form onSubmit={step === (role === "mentor" ? 4 : 3) ? handleSubmit : handleNext}>
          {renderStep()}
          <div className="form-navigation">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (step === (role === "mentor" ? 4 : 3) && !agreedToTerms)}
            >
              {loading ? "Processing..." : step === (role === "mentor" ? 4 : 3) ? "Register" : "Next"}
            </button>
            {step === 2 && role === "mentee" && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip
              </button>
            )}
          </div>
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