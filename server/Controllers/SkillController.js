const Skill = require("../Models/SkillModel");
const { skillUserJobs, totalUserJobs, calculateSkillFrequency } = require("./SkillFrequencyMethods.js");
const { CatchError, createData, readData, updateData, deleteData } = require("./ControllerMethods.js");

// Create a new skill
module.exports.createSkill = async (req, res) => {
  try {
    await createData(Skill, req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Get all skills
module.exports.getSkills = async (req, res) => {
  try {
    await readData(Skill, req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Update a skill by ID
module.exports.updateSkill = async (req, res) => {
  try {
    await updateData(Skill, "Skill", req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Delete a skill by ID
module.exports.deleteSkill = async (req, res) => {
  try {
    await deleteData(Skill, "Skill", req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Get the frequency of a skill by ID
module.exports.getSkillFrequency = async (req, res) => {
  try {
      const returnSkillUserJobs = await skillUserJobs(req) 
      const countTotalUserJobs = await totalUserJobs(req)
      const skillFrequency = calculateSkillFrequency(returnSkillUserJobs, countTotalUserJobs)
      const data = { returnSkillUserJobs, countTotalUserJobs, skillFrequency };
      res.status(201).json({ success: true, data });
  } catch (error) {
    CatchError(error, res);
  }
}
