const Step5Mentor = ({ formData, handleChange }) => {
  const { agreedToTerms } = formData

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

export default Step5Mentor