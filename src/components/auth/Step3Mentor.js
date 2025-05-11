const Step3Mentor = ({ formData, handleChange }) => {
  const { bio, phoneNumber, sessionPrice } = formData

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
}

export default Step3Mentor