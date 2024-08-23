import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false); // for if auth check is complete
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Revert Heroku
        // const { data } = await axios.get('http://localhost:4001/auth/check', { withCredentials: true });
        const { data } = await axios.get(`${process.env.REACT_APP_HEROKU_URL}/auth/check`, { withCredentials: true });
        console.log("Auth check response:", data);
        if (data.status === true) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        setIsAuthenticated(false);
      } finally {
        setCheckedAuth(true); // auth check marked complete
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Revert Heroku
      // await axios.post('http://localhost:4001/logout', {}, { withCredentials: true });
      await axios.post(`${process.env.REACT_APP_HEROKU_URL}/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/login'); // redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!checkedAuth) {
    return null;
  }

  return (
    <header className="header">
      <h1><Link to="/" className="header-link">Job Tracker</Link></h1>
      <nav>
        <ul>
          {isAuthenticated ? (
            <>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/skills">Skills</Link></li>
              <li><Link to="/contacts">Contacts</Link></li>
              <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
