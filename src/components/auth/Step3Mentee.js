const Step3Mentee = ({ formData, handleChange }) => {
  const { phoneNumber, currentStatus, interestArea } = formData

  return (
    <>
      <h3>Mentee Profile</h3>
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

export default Step3Mentee