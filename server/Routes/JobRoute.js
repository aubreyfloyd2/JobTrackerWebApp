const { createJob, getJobs, updateJob, deleteJob } = require("../Controllers/JobController");
const router = require("express").Router();

router.post("/jobs", createJob);
router.get("/jobs", getJobs);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

module.exports = router;
