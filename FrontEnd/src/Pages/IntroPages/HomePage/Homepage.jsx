import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../Assets/logo.png';
import './Homepage.css';

export default function Homepage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const flag = false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend for login
      const response = await axios.post('https://learn-to-bank-backend-7mtr.onrender.com/api/accounts/login', formData);
      const { token, message } = response.data;
      setMessage(message);

      // If login is successful, store the token and redirect to a different page
      if (token) {
        localStorage.setItem('authToken', token); // Store the token in localStorage
        navigate('/home'); // Redirect to the home page
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Show error message from the backend
      } else {
        setMessage('Login failed. Please try again.');
      }
    }
  };


  return (
    <div className="homepage">
  <header className="homepage-header">
    <img src={logo} alt="" />
    <p className="homepage-bank-title">Learn to Bank</p>
    <p className="homepage-bank-slogan">Where money pretends to grow</p>
  </header>
  <div className="bottom-container">
    <div className="homepage-content">
      {flag && <p>{message}</p>}
      <h1>Your first steps to the world of online banking</h1>
      <p>
        For those who want to learn how to perform online banking.
        <br /> Sign up in minutes!
      </p>
    </div>
    <div className="login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="login-fields">
          <p className="username">Username:</p>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <p className="password">Password:</p>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <p className="additional-text">{message}</p>
        <button className="login-button">Continue</button>
      </form>
      <div className="forgot-pass-container">
        <p className="forgot-password">
          Forgot password?{" "}
          <span>
            <Link to="/forgot-password" className="homepage-forgot-link">
              Click here.
            </Link>
          </span>
        </p>
      </div>
    </div>
  </div>
  <Link to="/signup">
    <button className="signup-button">Sign Up</button>
  </Link>
</div>

  );
};
