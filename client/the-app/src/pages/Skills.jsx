import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Tables.css';
import FormField from "../components/FormField.jsx"
import { handleError, handleSuccess, handleWarning } from "../Auth.js"

const Skills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState({
    skill_name: "",
    skill_proficiency: "",
  });
  const [editingSkill, setEditingSkill] = useState(null);
  const [previousSkill, setPreviousSkill] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      console.log("Fetching skills...");
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/skills", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/skills`, { withCredentials: true });
        console.log("Skills fetch response:", data);
        // Check if the data is an array
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          console.error("Expected array but received:", data);
          setSkills([]); // Ensure skills is an empty array if the data is not valid
        }
      } catch (error) {
        console.log("Error fetching skills:", error);
        if (error.response && error.response.status === 401) {
          handleError("Please log in to view skills", toast);
          navigate("/login");
        } else {
          handleError("Failed to fetch skills", toast);
        }
      }
    };

    const checkAuth = async () => {
      console.log("Checking authentication...");
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/auth/check", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/auth/check`, { withCredentials: true });
        console.log("Auth check response:", data);

        if (data.status !== true) {
          console.log("User not authenticated, navigating to login...");
          navigate("/login");
        } else {
          console.log("User authenticated, fetching skills...");
          fetchSkills();
        }
      } catch (error) {
        console.log("Auth check error:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillForm({
      ...skillForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const previousSkillName = previousSkill.skill_name;
        // Revert Heroku
        // await axios.put(`http://localhost:4001/skills/${editingSkill._id}`, skillForm, { withCredentials: true });
        await axios.put(`${process.env.REACT_APP_HEROKU_URL}/skills/${editingSkill._id}`, skillForm, { withCredentials: true });
        handleSuccess("Skill updated successfully", toast);
        if (previousSkillName !== skillForm.skill_name) {
          handleWarning(`Jobs with ${previousSkillName} have been updated to ${skillForm.skill_name}.`, toast);
        }
      } else {
        // Revert Heroku
        // await axios.post("http://localhost:4001/skills", skillForm, { withCredentials: true });
        await axios.post(`${process.env.REACT_APP_HEROKU_URL}/skills`, skillForm, { withCredentials: true });
        handleSuccess("Skill created successfully", toast);
      }
      setSkillForm({
        skill_name: "",
        skill_proficiency: "",
      });
      setEditingSkill(null);
      setModalOpen(false);
      // Revert Heroku
      // const { data } = await axios.get("http://localhost:4001/skills", { withCredentials: true });
      const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/skills`, { withCredentials: true });
      setSkills(data);
    } catch (error) {
      console.log("Error during submit:", error);
      if (error.response.data.message.includes("Skill validation failed")) {
        handleError("Please fill out Skill Name & Skill Proficiency.", toast);
      } else {
        handleError("Failed to save skill.", toast);
      }
    }
  };

  const handleEdit = (skill) => {
    handleWarning(`Editing the name of the skill "${skill.skill_name}" will edit all of your jobs that have ${skill.skill_name}.`, toast);
    setPreviousSkill(skill);
    setSkillForm(skill);
    setEditingSkill(skill);
    setModalOpen(true);
  };

  const handleDelete = async (id, skillToDelete) => {
    try {
      // Revert Heroku
      // await axios.delete(`http://localhost:4001/skills/${id}`, { withCredentials: true });
      await axios.delete(`${process.env.REACT_APP_HEROKU_URL}/skills/${id}`, { withCredentials: true });
      handleSuccess("Skill deleted successfully", toast);
      handleWarning(`${skillToDelete} has been removed from your jobs.`, toast);
      setSkills(skills.filter((skill) => skill._id !== id));
    } catch (error) {
      console.log("Error during delete:", error);
      handleError("Failed to delete skill", toast);
    }
  };

  // Given the skill id retrieved, pass into an axios request for skill frequency.
  const handleSkill = async (id, name) => {
    try {
      // Revert Heroku
      // const { data } = await axios.get(`http://localhost:4001/skills/frequency/${id}`, { withCredentials: true });
      const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/skills/frequency/${id}`, { withCredentials: true });
      handleSuccess(`${data.data.skillFrequency.toFixed()}% of your jobs use ${name}`, toast);
    } catch (error) {
      console.log("Error during calculation:", error);
      handleError("Failed to calculate skill frequency.", toast);
    }
  }

  const openModal = () => {
    setEditingSkill(null);
    setSkillForm({
      skill_name: "",
      skill_proficiency: "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container">
      <button className="add_button" onClick={openModal}>Add Skill</button>
      {modalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h2>{editingSkill ? "Edit Skill" : "Add New Skill"}</h2>
            <form onSubmit={handleSubmit}>
              <FormField labelFor="skill_name" labelText="Skill Name" typeText="text" inputVariable={skillForm.skill_name} placeholderText="Skill Name" changeFunction={handleChange} />              
              <div>
                <label htmlFor="skill_proficiency">Skill Proficiency</label>
                <select
                  name="skill_proficiency"
                  value={skillForm.skill_proficiency}
                  onChange={handleChange}
                >
                  <option value="">Select Proficiency</option>
                  <option value="none">None</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button type="submit">{editingSkill ? "Update Skill" : "Create Skill"}</button>
              <button type="button" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}
      <h2 style={{ color: 'white' }}>Manage Your Skills</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Skill Proficiency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill) => (
              <tr key={skill._id}>
                <td>{skill.skill_name}</td>
                <td>{skill.skill_proficiency}</td>
                <td>
                  <button onClick={() => handleSkill(skill._id, skill.skill_name)}>Frequency</button>
                  <button onClick={() => handleEdit(skill)}>Edit</button>
                  <button onClick={() => handleDelete(skill._id, skill.skill_name)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No skills available</td></tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Skills;
