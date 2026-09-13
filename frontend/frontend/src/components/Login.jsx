import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await login({
        identifier: formData.emailOrUsername,
        password: formData.password,
      });
      navigate("/home");
    } catch (err) {
      if (err.message.toLowerCase().includes("verify")) {
        const typedEmail = formData.emailOrUsername.includes("@")
          ? formData.emailOrUsername
          : "";
        navigate("/verify-email", { state: typedEmail ? { email: typedEmail } : undefined });
      } else {
        alert(err.message);
      }
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
              d="M21 11.5a8.5 8.5 0 01-12.3 7.6L3 20l1.1-5.4A8.5 8.5 0 1121 11.5z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="sc-brand">Bacbok</h1>
        <p className="sc-tagline">
          Sign in to connect with your friends and family
        </p>

        <form onSubmit={handleSubmit} className="sc-form">
          <div className="sc-field">
            <label>Email address</label>
            <div className="sc-input-wrap">
              <span className="sc-icon">✉</span>
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Enter your email"
                value={formData.emailOrUsername}
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sc-options-row">
            <label className="sc-show-passwords">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="sc-checkbox" />
              Show password
            </label>

            <Link to="/forgot-password" className="sc-forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="sc-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            <span className="sc-arrow">→</span>
          </button>
        </form>

        <p className="sc-switch">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
