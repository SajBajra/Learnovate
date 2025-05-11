const Step4Mentee = ({ formData, handleChange }) => {
  const { agreedToTerms } = formData

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

export default Step4Mentee