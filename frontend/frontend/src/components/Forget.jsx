import { useState } from "react";
import "./Auth.css"
import { Link } from "react-router-dom";

function Forget({ onLogin }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Reset link requested for:", email);

    // Later:
    // fetch("http://127.0.0.1:8000/auth/forgot-password", ...)
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-left">

          <div className="brand">
            <div className="brand-logo">B</div>

            <div>
              <h2>BacBok</h2>
              <p>
                Connect. Share. <span>Belong.</span>
              </p>
            </div>
          </div>

          <div className="auth-illustration">
            <div className="big-b">B</div>

            <div className="floating-icon icon-1">
              ♥
            </div>

            <div className="floating-icon icon-2">
              💬
            </div>

            <div className="floating-icon icon-3">
              👥
            </div>

            <div className="floating-icon icon-4">
              💜
            </div>
          </div>

          <div className="auth-left-footer">
            <h3>Stay connected on BacBok</h3>

            <p>
              Your people, your conversations,
              your community — all in one place.
            </p>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="auth-right">

          <div className="forgot-card">

            <div className="form-header">

              <h1>Forgot password?</h1>

              <div className="header-line"></div>

              <p>
                No worries. Enter your email address and
                we'll help you reset your password 💜
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

              </div>


              <button
                type="submit"
                className="auth-submit"
              >
                Send reset link
                <span>→</span>
              </button>

            </form>


            <div className="auth-footer">

              <span>
                Remember your password?
              </span>

              <Link to="/login" style={{ textDecoration: "none" }}> Login </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Forget;