import "./Auth.css"

const Stepper = ({ step, role }) => {
  return (
    <div className="stepper">
      {role === "mentor" ? (
        <>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">1</span> Additional Information
          </div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>
            <span className="step-number">2</span> Professional Information
          </div>
          <div className={`step ${step >= 5 ? "active" : ""}`}>
            <span className="step-number">3</span> Document Uploads
          </div>
        </>
      ) : (
        <>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">1</span> Mentee Profile
          </div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>
            <span className="step-number">2</span> Registration Complete
          </div>
        </>
      )}
    </div>
  )
}

export default Stepper