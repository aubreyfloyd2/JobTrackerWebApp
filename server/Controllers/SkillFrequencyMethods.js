const Job = require("../Models/JobModel");
const mongoose = require("mongoose");
const { jwtDecode } = require('jwt-decode');

const DecodedTokenId = (req) => {
    // Decode cookie to get user id for getJobs
    const decodedToken = jwtDecode(req.cookies.token, { header: false });  // retrieve req.cookies via cookie-parser
    const userId = decodedToken.id;
    return userId;
}

// SELECT all the user's jobs whose skills include the skill whose id is passed in the request.
module.exports.skillUserJobs = async (req) => {
    const data = await Job.find({user: DecodedTokenId(req), skills: new mongoose.Types.ObjectId(req.params.id)});
    return data;
}

// Count # of Jobs where userId
module.exports.totalUserJobs = async (req) => {
    const data = await Job.countDocuments({ user: DecodedTokenId(req) });
    return data;
}

// % frequency by dividing Count of "Jobs with Skill & User ID" / Count of "Total Jobs with User ID" 
module.exports.calculateSkillFrequency = (skillJobs, countTotal) => {
    const countSkill = skillJobs.length;
    const percentConverter = 100;
    const data = (countSkill * percentConverter) / countTotal;
    return data;
}


