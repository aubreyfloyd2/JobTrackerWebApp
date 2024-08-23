const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  skill_name: {
    type: String,
    required: [true, "Skill name is required"],
  },
  skill_proficiency: {
    type: String,
    required: [true, "Skill proficiency is required"],
    enum: ["none", "beginner", "intermediate", "advanced"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Skill", skillSchema);
