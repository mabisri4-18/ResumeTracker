import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./Login.css";

function Register({ onRegistered, onGoToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      console.log("Registration successful:", data);

      setSuccess(
        "Account created successfully. You can now login."
      );

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        if (onRegistered) {
          onRegistered();
        }
      }, 1000);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-background">
        <div className="background-circle circle-one"></div>
        <div className="background-circle circle-two"></div>
        <div className="background-circle circle-three"></div>
      </div>

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-info">

          <div className="brand">

            <div className="brand-logo">
              R
            </div>

            <span>
              Resume
              <span className="brand-highlight">
                Tracker
              </span>
            </span>

          </div>

          <div className="login-intro">

            <span className="eyebrow">
              RESUME ANALYTICS PLATFORM
            </span>

            <h1>
              Start tracking
              <br />
              your
              <span> resume.</span>
            </h1>

            <p>
              Create your account, upload your resume,
              share your public profile and track
              resume visitors.
            </p>

          </div>

          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Easy Registration
                </strong>

                <span>
                  Create your account in seconds
                </span>
              </div>

            </div>

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Public Resume
                </strong>

                <span>
                  Share your resume with recruiters
                </span>
              </div>

            </div>

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <div>
                <strong>
                  Resume Analytics
                </strong>

                <span>
                  Track who views your resume
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* REGISTER CARD */}

        <div className="login-card">

          <div className="login-card-header">

            <div className="mobile-logo">
              R
            </div>

            <h2>
              Create account
            </h2>

            <p>
              Join Resume Tracker
            </p>

          </div>


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* USERNAME */}

            <div className="form-group">

              <label htmlFor="register-username">
                Username
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  id="register-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  required
                  autoComplete="username"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="register-email">
                Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  •
                </span>

                <input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={6}
                  autoComplete="new-password"
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="login-error">

                <span>
                  !
                </span>

                {error}

              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div
                className="login-success"
                style={{
                  padding: "12px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  background: "#f0fdf4",
                  color: "#15803d",
                  fontSize: "13px",
                }}
              >
                ✓ {success}
              </div>
            )}


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span className="button-arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* LOGIN LINK */}

          <div
            style={{
              marginTop: "22px",
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >

            Already have an account?

            <button
              type="button"
              onClick={onGoToLogin}
              style={{
                marginLeft: "6px",
                border: "none",
                background: "none",
                color: "#6366f1",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Sign in
            </button>

          </div>


          <div className="login-divider">
            <span>
              Secure registration
            </span>
          </div>

          <p className="login-footer">
            Your account is protected with
            secure authentication.
          </p>

        </div>

      </div>

      <div className="login-copyright">
        © 2026 Resume Tracker. All rights reserved.
      </div>

    </div>
  );
}

export default Register;