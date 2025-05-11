const Step2 = ({ formData, handleChange }) => {
  const { role } = formData

  return (
    <>
      <h3>Select Your Role</h3>
      <div className="form-grid step-2">
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select a role</option>
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default Step2