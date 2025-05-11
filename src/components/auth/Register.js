import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Auth.css"
import Stepper from "./Stepper"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3Mentor from "./Step3Mentor"
import Step3Mentee from "./Step3Mentee"
import Step4Mentor from "./Step4Mentor"
import Step4Mentee from "./Step4Mentee"
import Step5Mentor from "./Step5Mentor"

const Register = ({ setIsAuthenticated, setCurrentUser, users, setUsers }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
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
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match")
        return
      }
    }
    if (step < (formData.role === "mentor" ? 5 : 4)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSkip = () => {
    if (step === 3 && formData.role === "mentee") {
      setStep(4) // Skip to final registration for mentee
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (users.some((user) => user.email === formData.email)) {
      alert("Email already registered")
      return
    }

    if (!formData.agreedToTerms) {
      alert("You must agree to the Terms & Conditions and Policy to register.")
      return
    }

    setLoading(true)

    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "mentor" && {
          bio: formData.bio,
          phoneNumber: formData.phoneNumber,
          sessionPrice: formData.sessionPrice,
          areaOfExpertise: formData.areaOfExpertise,
          professionalTitle: formData.professionalTitle,
          yearsOfExperience: formData.yearsOfExperience,
          skills: formData.skills,
          profilePicture: formData.profilePicture,
          documents: formData.documents,
          availability: "Flexible",
          rating: 0,
        }),
        ...(formData.role === "mentee" && {
          phoneNumber: formData.phoneNumber,
          profilePicture: formData.profilePicture,
          currentStatus: formData.currentStatus,
          interestArea: formData.interestArea,
        }),
      }

      setUsers([...users, newUser])
      setIsAuthenticated(true)
      setCurrentUser(newUser)
      alert("Registration successful!")
      navigate("/profile")
      setLoading(false)
    }, 1000)
  }

  const handleGoogleSignup = () => {
    setLoading(true)
    setTimeout(() => {
      alert("Google Sign-Up functionality is not implemented in this demo.")
      setLoading(false)
    }, 1000)
  }

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} handleChange={handleChange} />
      case 2:
        return <Step2 formData={formData} handleChange={handleChange} />
      case 3:
        return formData.role === "mentor" ? (
          <Step3Mentor formData={formData} handleChange={handleChange} />
        ) : formData.role === "mentee" ? (
          <Step3Mentee formData={formData} handleChange={handleChange} />
        ) : null
      case 4:
        return formData.role === "mentor" ? (
          <Step4Mentor formData={formData} handleChange={handleChange} />
        ) : formData.role === "mentee" ? (
          <Step4Mentee formData={formData} handleChange={handleChange} />
        ) : null
      case 5:
        return formData.role === "mentor" ? (
          <Step5Mentor formData={formData} handleChange={handleChange} />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="auth-container">
      <div className={`auth-card ${step > 2 ? "auth-card-wide" : ""}`}>
        <h2>Register for Learnovate</h2>
        {step > 2 && <Stepper step={step} role={formData.role} />}
        <form onSubmit={step === (formData.role === "mentor" ? 5 : 4) ? handleSubmit : handleNext}>
          {renderStepComponent()}
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
              disabled={loading || (step === (formData.role === "mentor" ? 5 : 4) && !formData.agreedToTerms) || (step === 2 && !formData.role)}
            >
              {loading ? "Processing..." : step === (formData.role === "mentor" ? 5 : 4) ? "Register" : "Next"}
            </button>
            {step === 3 && formData.role === "mentee" && (
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
        {step === 1 && (
          <div className="google-signup-container">
            <div className="google-signup">
              <button
                type="button"
                className="btn btn-google"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                Sign Up with Google
              </button>
            </div>
          </div>
        )}
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