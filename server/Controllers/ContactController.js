const Contact = require("../Models/ContactModel");
const { CatchError, createData, readData, updateData, deleteData } = require("./ControllerMethods.js");

// Create a new contact
module.exports.createContact = async (req, res) => {
  try {
    await createData(Contact, req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Get all contacts
module.exports.getContacts = async (req, res) => {
  try {
    await readData(Contact, req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Update a contact by ID
module.exports.updateContact = async (req, res) => {
  try {
    await updateData(Contact, "Contact", req, res);  
  } catch (error) {
    CatchError(error, res);
  }
};

// Delete a contact by ID
module.exports.deleteContact = async (req, res) => {
  try {
    await deleteData(Contact, "Contact", req, res);
  } catch (error) {
    CatchError(error, res);
  }
};
