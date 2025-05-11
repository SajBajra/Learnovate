const Step4Mentor = ({ formData, handleChange }) => {
  const { areaOfExpertise, professionalTitle, yearsOfExperience, skills } = formData

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
}

export default Step4Mentor