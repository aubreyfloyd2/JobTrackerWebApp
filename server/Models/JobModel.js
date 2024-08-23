const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company name is required"],
  },
  job_title: {
    type: String,
    required: [true, "Job title is required"],
  },
  job_category: {
    type: String,
    required: [true, "Job category is required"],
  },
  job_description: {
    type: String,
    required: [true, "Job description is required"],
  },
  date_applied: {
    type: Date,
  },
  job_status: {
    type: String,
    required: [true, "Job status is required"],
  },
  job_steps: {
    type: [String],
  },
  notes: {
    type: String,
  },
  job_url: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  }]
});

module.exports = mongoose.model("Job", jobSchema);
