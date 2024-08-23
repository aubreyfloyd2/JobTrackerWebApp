import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Tables.css';
import FormField from "../components/FormField.jsx"
import { handleError, handleSuccess } from "../Auth.js"

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contactForm, setContactForm] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    Relationship: "",
    Url: "",
    company: ""
  });
  const [editingContact, setEditingContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/contacts", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/contacts`, { withCredentials: true });
        setContacts(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleError("Please log in to view contacts", toast);
          navigate("/login");
        } else {
          handleError("Failed to fetch contacts", toast);
        }
      }
    };

    const fetchCompanies = async () => {
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/jobs", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/jobs`, { withCredentials: true });
        setCompanies(data);
      } catch (error) {
        handleError("Failed to fetch companies", toast);
      }
    };

    const checkAuth = async () => {
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/auth/check", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/auth/check`, { withCredentials: true });
        if (data.status !== true) {
          navigate("/login");
        } else {
          fetchContacts();
          fetchCompanies();
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };

  // Map company ID to company name
  const companyMap = companies.reduce((acc, company) => {
    acc[company._id] = company.company;
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        // Revert Heroku
        // await axios.put(`http://localhost:4001/contacts/${editingContact._id}`, contactForm, { withCredentials: true });
        await axios.put(`${process.env.REACT_APP_HEROKU_URL}/contacts/${editingContact._id}`, contactForm, { withCredentials: true });
        handleSuccess("Contact updated successfully", toast);
      } else {
        // Revert Heroku
        // await axios.post("http://localhost:4001/contacts", contactForm, { withCredentials: true });
        await axios.post(`${process.env.REACT_APP_HEROKU_URL}/contacts`, contactForm, { withCredentials: true });
        handleSuccess("Contact created successfully", toast);
      }
      setContactForm({
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        Relationship: "",
        Url: "",
        company: ""
      });
      setEditingContact(null);
      setModalOpen(false);
      // Revert Heroku
      // const { data } = await axios.get("http://localhost:4001/contacts", { withCredentials: true });
      const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/contacts`, { withCredentials: true });
      setContacts(data);
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "Contact validation failed: contact_name: Path `contact_name` is required.") {
        handleError("Please fill out Contact Name.", toast);
      } else {
        handleError("Failed to save contact", toast);
      }
    }
  };

  const handleEdit = (contact) => {
    setContactForm(contact);
    setEditingContact(contact);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      // Revert Heroku
      // await axios.delete(`http://localhost:4001/contacts/${id}`, { withCredentials: true });
      await axios.delete(`${process.env.REACT_APP_HEROKU_URL}/contacts/${id}`, { withCredentials: true });
      handleSuccess("Contact deleted successfully", toast);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.log(error);
      handleError("Failed to delete contact", toast);
    }
  };

  const openModal = () => {
    setEditingContact(null);
    setContactForm({
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      Relationship: "",
      Url: "",
      company: ""
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container">
      <button className="add_button" onClick={openModal}>Add Contact</button>
      {modalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h2>{editingContact ? "Edit Contact" : "Add New Contact"}</h2>
            <form onSubmit={handleSubmit}>
              <FormField labelFor="contact_name" labelText="Contact Name" typeText="text" inputVariable={contactForm.contact_name} placeholderText="Contact Name" changeFunction={handleChange} />
              <FormField labelFor="contact_email" labelText="Contact Email" typeText="email" inputVariable={contactForm.contact_email} placeholderText="Contact Email" changeFunction={handleChange} />
              <FormField labelFor="contact_phone" labelText="Contact Phone" typeText="text" inputVariable={contactForm.contact_phone} placeholderText="Contact Phone" changeFunction={handleChange} />
              <FormField labelFor="Relationship" labelText="Relationship" typeText="text" inputVariable={contactForm.Relationship} placeholderText="Relationship" changeFunction={handleChange} />
              <FormField labelFor="Url" labelText="URL" typeText="text" inputVariable={contactForm.Url} placeholderText="URL" changeFunction={handleChange} />
              <div>
                <label htmlFor="company">Company</label>
                <select name="company" value={contactForm.company} onChange={handleChange}>
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>{company.company}</option>
                  ))}
                </select>
              </div>
              <button type="submit">{editingContact ? "Update Contact" : "Create Contact"}</button>
              <button type="button" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}
      <h2 style={{ color: 'white' }}>Contacts List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Contact Name</th>
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Relationship</th>
            <th>URL</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(contacts) && contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.contact_name}</td>
                <td>{contact.contact_email}</td>
                <td>{contact.contact_phone}</td>
                <td>{contact.Relationship}</td>
                <td><a href={contact.Url} target="_blank" rel="noopener noreferrer">Link</a></td>
                <td>{contact.company ? companyMap[contact.company] : 'N/A'}</td>
                <td>
                  <button onClick={() => handleEdit(contact)}>Edit</button>
                  <button onClick={() => handleDelete(contact._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No contacts available</td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Contacts;
