import React from "react";
import "./SignupForm.css";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

const SignupForm = () => {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Welcome, Student</h2>

        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" placeholder="Full Name" />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" placeholder="Email Address" />
        </div>

        <div className="input-group">
          <FaPhone className="icon" />
          <input type="tel" placeholder="+91 0000000000" />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input type="password" placeholder="Password" />
        </div>

        <button className="signup-btn">Sign up</button>

        <p className="login-text">
          Already have account? <Link to="/login">Login</Link>
        </p>

        <div className="divider">OR</div>

        <button className="google-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="google"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
