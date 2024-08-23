import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Revert Heroku
        // const { data } = await axios.get("http://localhost:4001/auth/check", { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/auth/check`, { withCredentials: true });
        console.log("Auth check response:", data);
        if (data.status !== true) {
          console.log("User not authenticated, navigating to login...");
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        }
      } catch (error) {
        console.error("Error verifying authentication", error);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } finally {
        setLoading(false); // done loading
      }
    };

    verifyAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // loading indicator
  }

  return (
    <>
      <div className="home_page">
        <h4>
          Welcome to Job Tracker
        </h4>
        <p>
          Track your job applications and internships effortlessly. Use this tool to manage
          your progress and improve your chances of landing your dream job.
        </p>
        <button onClick={() => navigate("/jobs")}>Go to Jobs</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
