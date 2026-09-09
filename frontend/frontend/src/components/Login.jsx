import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";

const Login = ({ onSignup,  onForgotPassword }) => {

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    remember: false,
  });


  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("Login data:", formData);

    // Later:
    //
    // fetch("http://127.0.0.1:8000/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });

  };


  return (

    <div className="auth-page">

      {/* LOGIN PANEL */}

      <div className="auth-form-panel login-panel">

        <div className="login-container">

          {/* LOGO */}

          <div className="login-brand">

            <div className="brand-icon small">
              B
            </div>

            <h2>BacBok</h2>

            <button className="theme-button">
              ☾
            </button>

          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h2>
              Welcome back <span>👋</span>
            </h2>

            <p>
              Glad to see you again! <span>💜</span>
            </p>

          </div>


          {/* BIG LOGO VISUAL */}

          <div className="login-visual">

            <div className="glow-circle"></div>

            <div className="big-b-logo">
              B
            </div>

            <div className="chat-bubble">
              •••
            </div>


            <div className="avatar avatar-1">
              👩
            </div>

            <div className="avatar avatar-2">
              👨
            </div>

            <div className="avatar avatar-3">
              👩
            </div>

            <div className="avatar avatar-4">
              👨
            </div>


            <div className="reaction reaction-heart">
              ♥
            </div>

            <div className="reaction reaction-like">
              👍
            </div>

            <div className="reaction reaction-message">
              💬
            </div>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>


            {/* EMAIL */}

            <div className="input-group">

              <div className="input-wrapper">

                <span className="input-icon">
                  ♙
                </span>

                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder="Email or username"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {/* REMEMBER + FORGOT */}

            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                <span className="custom-checkbox"></span>

                Remember me

              </label>


              <Link to="/forgot-password" className="forgot">
                  Forgot password?
              </Link>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="primary-button"
            >

              <span>Login</span>

              <span className="button-arrow">
                →
              </span>

            </button>

          </form>


          {/* DIVIDER */}

          <div className="divider">

            <span></span>

            <p>or continue with</p>

            <span></span>

          </div>


          {/* SOCIAL */}

          <div className="social-buttons">

            <button className="social-button">
              <span className="google-icon">
                G
              </span>

              Google
            </button>


            <button className="social-button">

              <span className="apple-icon">
                ●
              </span>

              Apple

            </button>

          </div>


          {/* SIGNUP */}

          <p className="switch-auth">

            Don't have an account?{" "}

            <Link to="/signup" style={{ textDecoration: "none" }}> Create an account</Link>

          </p>

        </div>

      </div>

    </div>

  );

};

export default Login;