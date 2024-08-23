const { createSkill, getSkills, getSkillFrequency, updateSkill, deleteSkill } = require("../Controllers/SkillController");
const router = require("express").Router();

router.post("/skills", createSkill);
router.get("/skills", getSkills);
router.put("/skills/:id", updateSkill);
router.delete("/skills/:id", deleteSkill);

router.get("/skills/frequency/:id", getSkillFrequency);

module.exports = router;
