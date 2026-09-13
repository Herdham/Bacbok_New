import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api";
import "./Auth.css";

const Forget = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const data = await forgotPassword({ email });
      setSent(true);
      console.log(data.message);
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
            <rect x="4" y="10" width="16" height="10" rx="2" stroke="white" strokeWidth="1.8" />
            <path
              d="M8 10V7a4 4 0 118 0v3"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="sc-brand">Bacbok</h1>
        <p className="sc-tagline">
          {sent
            ? "Check your inbox for a link to reset your password."
            : "Enter your email and we'll send you a link to reset your password."}
        </p>

        {!sent && (
          <form onSubmit={handleSubmit} className="sc-form">
            <div className="sc-field">
              <label>Email address</label>
              <div className="sc-input-wrap">
                <span className="sc-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="sc-submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
              <span className="sc-arrow">→</span>
            </button>
          </form>
        )}

        <p className="sc-switch">
          Remembered it? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Forget;
