const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  contact_name: { type: String, required: true },
  contact_email: { type: String },
  contact_phone: { type: String },
  Relationship: { type: String },
  Url: { type: String },
  company: { type: mongoose.Schema.Types.Mixed, ref: 'Job', required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model("Contact", contactSchema);
