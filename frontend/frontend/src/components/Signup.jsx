import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-page theme-login">
      <div className="sc-card">
        <div className="sc-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-3.9 3.1-7 7-7 1.35 0 2.6.37 3.68 1.02M16 8h4M18 6v4"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="sc-brand">Bacbok</h1>
        <p className="sc-tagline">
          Create your account and connect with friends &amp; family
        </p>

        <form onSubmit={handleSubmit} className="sc-form">
          <div className="sc-field-row">
            <div className="sc-field">
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sc-field">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sc-field">
            <label>Email address</label>
            <div className="sc-input-wrap">
              <span className="sc-icon">✉</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sc-field">
            <label>Username</label>
            <div className="sc-input-wrap">
              <span className="sc-icon">@</span>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sc-field">
            <label>Password</label>
            <div className="sc-input-wrap">
              <span className="sc-icon">🔒</span>
              <input
                type={showPasswords ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sc-field">
            <label>Confirm password</label>
            <div className="sc-input-wrap">
              <span className="sc-icon">🔒</span>
              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className="sc-show-passwords">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
            />
            <span className="sc-checkbox" />
            Show passwords
          </label>

          <p className="sc-terms">
            By clicking Join, you agree to our{" "}
            <a href="#">Terms &amp; Conditions</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>

          <button type="submit" className="sc-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            <span className="sc-arrow">→</span>
          </button>
        </form>

        <p className="sc-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
