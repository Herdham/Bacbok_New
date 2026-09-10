import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import { signup, login, forgotPassword } from "../api";
import { useNavigate } from "react-router-dom";

const Signup = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.terms) {
    alert("Please accept the Terms of Service and Privacy Policy.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const data = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    console.log("Signed up:", data);
    alert("Account created successfully! Please log in.");
     navigate("/login");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="auth-page">

      {/* LEFT BRAND PANEL */}
      <div className="auth-brand-panel">

        <div className="brand-logo-area">
          <div className="brand-icon">B</div>

          <div>
            <h1>BacBok</h1>
            <p>
              Connect. Share. <span>Belong.</span>
            </p>
          </div>
        </div>

        <div className="brand-visual">

          <div className="floating-icon heart-icon">
            ♥
          </div>

          <div className="floating-icon chat-icon">
            💬
          </div>

          <div className="phone">
            <div className="phone-notch"></div>

            <div className="phone-screen">

              <div className="fake-profile">
                <div className="fake-avatar"></div>
                <div className="fake-lines">
                  <span></span>
                  <span></span>
                </div>
              </div>

              <div className="fake-image">
                <div className="mountain"></div>
              </div>

              <div className="fake-lines bottom-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>
          </div>

          <div className="floating-icon people-icon">
            👥
          </div>

          <div className="floating-icon message-icon">
            💬
          </div>

        </div>

        <div className="brand-bottom">

          <div className="people-circle">
            👥
          </div>

          <div>
            <h3>Join millions on BacBok</h3>
            <p>
              Share your moments, connect
              <br />
              with friends and the world.
            </p>
          </div>

        </div>

      </div>


      {/* SIGNUP FORM */}
      <div className="auth-form-panel">

        <div className="signup-container">

          <div className="mobile-brand">
            <div className="brand-icon small">B</div>
            <h2>BacBok</h2>
          </div>

          <div className="form-heading">

            <h2>Create your account</h2>

            <div className="heading-line"></div>

            <p>
              Start your journey with BacBok <span>💜</span>
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* FIRST + LAST NAME */}
            <div className="name-row">

              <div className="input-group">

                <div className="input-wrapper">

                  <span className="input-icon">
                    ♙
                  </span>

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="input-group">

                <div className="input-wrapper">

                  <span className="input-icon">
                    ♙
                  </span>

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

            </div>


            {/* USERNAME */}
            <div className="input-group">

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="input-group">

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
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


            {/* CONFIRM PASSWORD */}
            <div className="input-group">

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>

              </div>

            </div>


            {/* TERMS */}
            <label className="terms">

              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <span className="custom-checkbox"></span>

              <span className="terms-text">
                I agree to the{" "}
                <a href="#">Terms of Service</a>{" "}
                and{" "}
                <a href="#">Privacy Policy</a>
              </span>

            </label>


            {/* SIGN UP BUTTON */}
            <button
              type="submit"
              className="primary-button"
            >
              <span>Sign Up</span>
              <span className="button-arrow">→</span>
            </button>

          </form>


          {/* DIVIDER */}
          <div className="divider">

            <span></span>

            <p>or continue with</p>

            <span></span>

          </div>


          {/* SOCIAL LOGIN */}
          <div className="social-buttons">

            <button className="social-button">
              <span className="google-icon">G</span>
              Google
            </button>

            <button className="social-button">
              <span className="apple-icon">●</span>
              Apple
            </button>

          </div>


          {/* LOGIN LINK */}
          <p className="switch-auth">
            Already have an account?{" "}
           <Link to="/login" style={{ textDecoration: "none" }}> Login </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;