import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendCode } from "../api";
import "./Auth.css";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [emailConfirmed, setEmailConfirmed] = useState(!!location.state?.email);

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Whenever this page loads with a known email, make sure a fresh code is on its way —
    // covers both "just signed up" and "redirected here from a blocked login" cases.
    if (emailConfirmed && email) {
      resendCode({ email }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const data = await resendCode({ email });
      alert(data.message);
      setEmailConfirmed(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const focusBox = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1); // only last digit typed
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusBox(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = pasted.split("");
    while (next.length < 6) next.push("");
    setDigits(next);
    focusBox(Math.min(pasted.length, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      alert("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail({ email, code });
      alert("Email verified! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const data = await resendCode({ email });
      alert(data.message);
    } catch (err) {
      alert(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="sc-page theme-login">
      <div className="sc-card">
        <div className="sc-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="1.8" />
            <path
              d="M3 7l9 6 9-6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="sc-brand">Bacbok</h1>

        {!emailConfirmed ? (
          <>
            <p className="sc-tagline">
              Enter the email you signed up with to continue verification.
            </p>
            <form onSubmit={handleEmailSubmit} className="sc-form">
              <div className="sc-field">
                <label>Email address</label>
                <div className="sc-input-wrap">
                  <span className="sc-icon">✉</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="sc-submit" disabled={loading}>
                {loading ? "Sending code..." : "Continue"}
                <span className="sc-arrow">→</span>
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="sc-tagline">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="sc-form">
              <div className="sc-otp-row" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="sc-otp-box"
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  />
                ))}
              </div>

              <button type="submit" className="sc-submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
                <span className="sc-arrow">→</span>
              </button>
            </form>

            <p className="sc-switch">
              Didn't get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="sc-forgot-link"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {resending ? "Resending..." : "Resend code"}
              </button>
            </p>
          </>
        )}

        <p className="sc-switch">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
