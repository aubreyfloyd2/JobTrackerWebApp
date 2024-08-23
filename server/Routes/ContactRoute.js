const { createContact, getContacts, updateContact, deleteContact } = require("../Controllers/ContactController");
const router = require("express").Router();

router.post("/contacts", createContact);
router.get("/contacts", getContacts);
router.put("/contacts/:id", updateContact);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
