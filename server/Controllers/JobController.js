const Job = require("../Models/JobModel");
const { CatchError, createData, readData, updateData, deleteData } = require("./ControllerMethods.js");

// Create a new job
module.exports.createJob = async (req, res) => {
  try {
    await createData(Job, req, res);
  } catch (error) {
    CatchError(error, res);  
  }
};

// Get all jobs
module.exports.getJobs = async (req, res) => {
  try {
    await readData(Job, req, res);
  } catch (error) {
    CatchError(error, res);
  }
};

// Update a job by ID
module.exports.updateJob = async (req, res) => {
  try {
    await updateData(Job, "Job", req, res);
  } catch (error) {
    CatchError(error, res);
  }
};

// Delete a job by ID
module.exports.deleteJob = async (req, res) => {
  try {
    await deleteData(Job, "Job", req, res);
  } catch (error) {
    CatchError(error, res);
  }
};
