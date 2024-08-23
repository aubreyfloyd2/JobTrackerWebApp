import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Tables.css';
import FormField from "../components/FormField.jsx";
import { handleError, handleSuccess, handleWarning } from "../Auth.js";

const jobStepsOptions = [
  "Coding Assessment",
  "Behavior Interview",
  "Phone Screener",
  "Interview",
  "Technical Interview",
];

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobForm, setJobForm] = useState({
    company: "",
    job_title: "",
    job_category: "Full-Time",
    job_description: "",
    date_applied: "",
    job_status: "Applied",
    job_url: "",
    notes: "",
    job_steps: [], // job steps for user
    skills: [], // user skills to jobs
  });
  const [editingJob, setEditingJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
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
          console.log("User authenticated, fetching jobs and skills...");
          fetchJobs();
          fetchSkills();
        }
      } catch (error) {
        console.log("Auth check error:", error);
        navigate("/login");
      }
    };

    const fetchJobs = async () => {
      console.log("Fetching jobs...");
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/jobs", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/jobs`, { withCredentials: true });
        console.log("Jobs fetch response:", data);
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          console.error("Expected array but received:", data);
        }
      } catch (error) {
        console.log("Fetch jobs error:", error);
        handleError("Failed to fetch jobs", toast);
      }
    };

    const fetchSkills = async () => {
      console.log("Fetching skills...");
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/skills", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/skills`, { withCredentials: true });
        console.log("Skills fetch response:", data);
        if (Array.isArray(data)) {
          setSkills(data);
        } else {
          console.error("Expected array but received:", data);
        }
      } catch (error) {
        console.log("Fetch skills error:", error);
        handleError("Failed to fetch skills", toast);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'job_steps') {
      const updatedSteps = e.target.checked
        ? [...jobForm.job_steps, value]
        : jobForm.job_steps.filter(step => step !== value);
      setJobForm(prevForm => ({
        ...prevForm,
        job_steps: updatedSteps,
      }));
    } else if (name === 'skills') {
      const updatedSkills = e.target.checked
        ? [...jobForm.skills, value]
        : jobForm.skills.filter(skill => skill !== value);
      setJobForm(prevForm => ({
        ...prevForm,
        skills: updatedSkills,
      }));
    } else {
      setJobForm({
        ...jobForm,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        // Revert Heroku
        // await axios.put(`http://localhost:4001/jobs/${editingJob._id}`, jobForm, { withCredentials: true });
        await axios.put(`${process.env.REACT_APP_HEROKU_URL}/jobs/${editingJob._id}`, jobForm, { withCredentials: true });
        handleSuccess("Job updated successfully", toast);
      } else {
        // Revert Heroku
        // await axios.post("http://localhost:4001/jobs", jobForm, { withCredentials: true });
        await axios.post(`${process.env.REACT_APP_HEROKU_URL}/jobs`, jobForm, { withCredentials: true });
        handleSuccess("Job created successfully", toast);
      }
      setJobForm({
        company: "",
        job_title: "",
        job_category: "Full-Time",
        job_description: "",
        date_applied: "",
        job_status: "Applied",
        job_url: "",
        notes: "",
        job_steps: [],
        skills: [],
      });
      setEditingJob(null);
      setModalOpen(false);
      // Revert Heroku
      // const { data } = await axios.get("http://localhost:4001/jobs", { withCredentials: true });
      const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/jobs`, { withCredentials: true });
      setJobs(data);
    } catch (error) {
      console.log("Error during submit:", error);
      if (error.response.data.message.includes("Job validation failed")) {
        handleError("Please fill out all required fields: Company Name, Job Title, Job Description.", toast);
      } else {
        handleError("Failed to save job.", toast);
      }
    }
  };

  const handleEdit = (job) => {
    handleWarning(`Editing the name of the company "${job.company}" will edit all of your contacts that have ${job.company}.`, toast);
    setJobForm(job);
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleDelete = async (id, companyToDelete) => {
    try {
      // Revert Heroku
      // await axios.delete(`http://localhost:4001/jobs/${id}`, { withCredentials: true });
      await axios.delete(`${process.env.REACT_APP_HEROKU_URL}/jobs/${id}`, { withCredentials: true });
      handleSuccess("Job deleted successfully", toast);
      handleWarning(`${companyToDelete} has been removed from your contacts.`, toast);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log("Error during delete:", error);
      handleError("Failed to delete job", toast);
    }
  };

  const openModal = () => {
    setEditingJob(null);
    setJobForm({
      company: "",
      job_title: "",
      job_category: "Full-Time",
      job_description: "",
      date_applied: "",
      job_status: "Applied",
      job_url: "",
      notes: "",
      job_steps: [],
      skills: []
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container">
      <button className="add_button" onClick={openModal}>Add Job</button>
      {modalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>
            <form onSubmit={handleSubmit}>
              <FormField labelFor="company" labelText="Company" typeText="text" inputVariable={jobForm.company} placeholderText="Company" changeFunction={handleChange} />
              <FormField labelFor="job_title" labelText="Job Title" typeText="text" inputVariable={jobForm.job_title} placeholderText="Job Title" changeFunction={handleChange} />
              <div>
                <label htmlFor="job_category">Category</label>
                <select
                  name="job_category"
                  value={jobForm.job_category}
                  onChange={handleChange}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label htmlFor="job_status">Status</label>
                <select
                  name="job_status"
                  value={jobForm.job_status}
                  onChange={handleChange}
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Waiting for Decision">Waiting for Decision</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label htmlFor="job_description">Description</label>
                <textarea
                  name="job_description"
                  value={jobForm.job_description}
                  placeholder="Job Description"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form_label">Skills</label>
                <div className="checkbox-group">
                {(Array.isArray(skills) && skills.length > 0) ? (
                  skills.map((skill) => (
                    <label key={skill._id} className="skill_label">
                      <input
                        type="checkbox"
                        name="skills"
                        value={skill._id}
                        checked={jobForm.skills.includes(skill._id)}
                        onChange={handleChange}
                      />
                      {skill.skill_name}
                    </label>
                    ))
                  ) : ("No skills available. Add skills on the Skills page.")
                }
                </div>
              </div>
              <FormField labelFor="job_url" labelText="Job URL" typeText="text" inputVariable={jobForm.job_url} placeholderText="Job URL" changeFunction={handleChange} />
              <FormField labelFor="date_applied" labelText="Date Applied" typeText="date" inputVariable={jobForm.date_applied} placeholderText="" changeFunction={handleChange} />
              <div>
                <label className="form_label">Job Steps</label>
                <div className="checkbox-group">
                  {jobStepsOptions.map((step) => (
                    <label key={step} className="job_step_label">
                      <input
                        type="checkbox"
                        name="job_steps"
                        value={step}
                        checked={jobForm.job_steps.includes(step)}
                        onChange={handleChange}
                      />
                      {step}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="notes">Notes</label>
                <textarea
                  name="notes"
                  value={jobForm.notes}
                  placeholder="Notes"
                  onChange={handleChange}
                />
              </div>
              <div className="form_buttons">
                <button type="submit">{editingJob ? "Update" : "Add"}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h2 style={{ color: 'white' }}>Manage Your Jobs</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Description</th>
            <th>Job Steps</th>
            <th>Skills</th>
            <th>URL</th>
            <th>Date Applied</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.company}</td>
              <td>{job.job_title}</td>
              <td>{job.job_category}</td>
              <td>{job.job_status}</td>
              <td>{job.job_description}</td>
              <td>{job.job_steps.map((jobStep) => {
                return <div style={{ margin: "8px" }}>{jobStep}</div>
              })}</td>
              <td>{job.skills.map((skillId) => {
                const skill = skills.find((skill) => skill._id === skillId);
                const displaySkill = skill ? skill.skill_name : "";
                return <div style={{ margin: "8px" }}>{displaySkill}</div>
              })}</td>
              <td><a href={job.job_url} target="_blank" rel="noopener noreferrer">Link</a></td>
              <td>{new Date(job.date_applied).toISOString().split("T")[0]}</td>
              <td>{job.notes}</td>
              <td>
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job._id, job.company)}>Delete</button>
              </td>
            </tr>
          )) 
        ) : (
            <tr><td colSpan="11">No jobs available</td></tr>
        )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Jobs;
