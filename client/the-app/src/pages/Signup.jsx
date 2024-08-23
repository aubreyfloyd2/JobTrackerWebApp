import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import FormField from "../components/FormField.jsx"
import { handleError, handleSuccess } from "../Auth.js"

const Signup = () => {
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Revert Heroku
      const { data } = await axios.post(
        `${process.env.REACT_APP_HEROKU_URL}/signup`,
        // "http://localhost:4001/signup",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      console.log("data = ", data)
      if (success) {
        handleSuccess(message, toast);
        setTimeout(() => {
          window.location.replace("/"); // to reload header with user auth
        }, 1000);
      } else {
        handleError(message, toast);
      }
    } catch (error) {
      console.log(error);
      handleError(error.response.data.message, toast);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="form_container">
      <h2>Account Signup</h2>
      <form onSubmit={handleSubmit}>
        <FormField labelFor="email" labelText="Email" typeText="email" inputVariable={email} placeholderText="Enter email" changeFunction={handleOnChange} />
        <FormField labelFor="username" labelText="Username" typeText="text" inputVariable={username} placeholderText="Enter username" changeFunction={handleOnChange} />
        <FormField labelFor="password" labelText="Password" typeText="password" inputVariable={password} placeholderText="Enter password" changeFunction={handleOnChange} />
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
