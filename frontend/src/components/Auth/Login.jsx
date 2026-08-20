// import { useState } from "react";
// import { login } from "../../services/authService";
// import "./Login.css";

// function Login({ onLogin, onGoToRegister }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // =========================================
//   // LOGIN
//   // =========================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const data = await login(
//         username,
//         password
//       );

//       console.log(
//         "Login successful:",
//         data
//       );

//       // =========================================
//       // GET JWT TOKEN
//       // =========================================

//       const jwt =
//         data?.token ||
//         data?.jwt ||
//         data?.accessToken;

//       if (!jwt) {
//         throw new Error(
//           "Login succeeded, but no JWT token was returned."
//         );
//       }

//       // Send JWT to App.jsx
//       onLogin(jwt);

//     } catch (error) {

//       console.error(
//         "Login error:",
//         error
//       );

//       setError(
//         error.message ||
//         "Unable to connect to the server."
//       );

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (
//     <div className="login-page">

//       {/* =====================================
//           BACKGROUND
//       ===================================== */}

//       <div className="login-background">

//         <div className="background-circle circle-one"></div>

//         <div className="background-circle circle-two"></div>

//         <div className="background-circle circle-three"></div>

//       </div>


//       <div className="login-container">

//         {/* =====================================
//             LEFT INFORMATION SECTION
//         ===================================== */}

//         <div className="login-info">

//           {/* BRAND */}

//           <div className="brand">

//             <div className="brand-logo">
//               R
//             </div>

//             <span>
//               Resume
//               <span className="brand-highlight">
//                 Tracker
//               </span>
//             </span>

//           </div>


//           {/* INTRO */}

//           <div className="login-intro">

//             <span className="eyebrow">
//               RESUME ANALYTICS PLATFORM
//             </span>

//             <h1>

//               Know who is

//               <br />

//               viewing your

//               <span>
//                 {" "}resume.
//               </span>

//             </h1>

//             <p>
//               Upload your resume, share your public
//               profile and track every interaction
//               from one powerful dashboard.
//             </p>

//           </div>


//           {/* =====================================
//               FEATURES
//           ===================================== */}

//           <div className="feature-list">


//             {/* FEATURE 1 */}

//             <div className="feature-item">

//               <div className="feature-icon">
//                 ✓
//               </div>

//               <div>

//                 <strong>
//                   Resume Analytics
//                 </strong>

//                 <span>
//                   Track profile and resume views
//                 </span>

//               </div>

//             </div>


//             {/* FEATURE 2 */}

//             <div className="feature-item">

//               <div className="feature-icon">
//                 ✓
//               </div>

//               <div>

//                 <strong>
//                   Public Resume Link
//                 </strong>

//                 <span>
//                   Share your professional profile
//                 </span>

//               </div>

//             </div>


//             {/* FEATURE 3 */}

//             <div className="feature-item">

//               <div className="feature-icon">
//                 ✓
//               </div>

//               <div>

//                 <strong>
//                   Detailed Insights
//                 </strong>

//                 <span>
//                   Understand your resume reach
//                 </span>

//               </div>

//             </div>


//           </div>

//         </div>


//         {/* =====================================
//             LOGIN CARD
//         ===================================== */}

//         <div className="login-card">


//           {/* =====================================
//               CARD HEADER
//           ===================================== */}

//           <div className="login-card-header">

//             <div className="mobile-logo">
//               R
//             </div>

//             <h2>
//               Welcome back
//             </h2>

//             <p>
//               Sign in to your Resume Tracker
//             </p>

//           </div>


//           {/* =====================================
//               LOGIN FORM
//           ===================================== */}

//           <form
//             className="login-form"
//             onSubmit={handleSubmit}
//           >


//             {/* =================================
//                 USERNAME
//             ================================= */}

//             <div className="form-group">

//               <label htmlFor="username">
//                 Username
//               </label>

//               <div className="input-wrapper">

//                 <span className="input-icon">
//                   @
//                 </span>

//                 <input
//                   id="username"
//                   type="text"
//                   placeholder="Enter your username"
//                   value={username}
//                   onChange={(event) =>
//                     setUsername(
//                       event.target.value
//                     )
//                   }
//                   required
//                   autoComplete="username"
//                 />

//               </div>

//             </div>


//             {/* =================================
//                 PASSWORD
//             ================================= */}

//             <div className="form-group">

//               <div className="label-row">

//                 <label htmlFor="password">
//                   Password
//                 </label>

//                 <button
//                   type="button"
//                   className="forgot-password"
//                   onClick={() => {

//                     alert(
//                       "Password reset will be available soon."
//                     );

//                   }}
//                 >
//                   Forgot password?
//                 </button>

//               </div>


//               <div className="input-wrapper">

//                 <span className="input-icon">
//                   •
//                 </span>

//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(event) =>
//                     setPassword(
//                       event.target.value
//                     )
//                   }
//                   required
//                   autoComplete="current-password"
//                 />

//               </div>

//             </div>


//             {/* =================================
//                 ERROR
//             ================================= */}

//             {error && (

//               <div className="login-error">

//                 <span>
//                   !
//                 </span>

//                 <span>
//                   {error}
//                 </span>

//               </div>

//             )}


//             {/* =================================
//                 LOGIN BUTTON
//             ================================= */}

//             <button
//               type="submit"
//               className="login-button"
//               disabled={loading}
//             >

//               {loading ? (

//                 <>
//                   <span className="spinner"></span>

//                   Signing in...
//                 </>

//               ) : (

//                 <>
//                   Sign in

//                   <span className="button-arrow">
//                     →
//                   </span>
//                 </>

//               )}

//             </button>

//           </form>


//           {/* =====================================
//               REGISTER LINK
//           ===================================== */}

//           <div
//             className="register-link-container"
//           >

//             <span>
//               Don't have an account?
//             </span>

//             <button
//               type="button"
//               className="register-link-button"
//               onClick={onGoToRegister}
//             >
//               Create account
//             </button>

//           </div>


//           {/* =====================================
//               DIVIDER
//           ===================================== */}

//           <div className="login-divider">

//             <span>
//               Secure access
//             </span>

//           </div>


//           {/* =====================================
//               FOOTER TEXT
//           ===================================== */}

//           <p className="login-footer">

//             Your account and resume analytics
//             are protected with secure authentication.

//           </p>

//         </div>

//       </div>


//       {/* =====================================
//           COPYRIGHT
//       ===================================== */}

//       <div className="login-copyright">

//         © 2026 Resume Tracker. All rights reserved.

//       </div>

//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { login } from "../../services/authService";
import "./Login.css";

function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // LOGIN
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(
        email,
        password
      );

      console.log(
        "Login successful:",
        data
      );

      // =========================================
      // GET JWT TOKEN
      // =========================================

      const jwt =
        data?.token ||
        data?.jwt ||
        data?.accessToken;

      if (!jwt) {
        throw new Error(
          "Login succeeded, but no JWT token was returned."
        );
      }

      // Send JWT to App.jsx
      onLogin(jwt);

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-page">

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="login-background">

        <div className="background-circle circle-one"></div>

        <div className="background-circle circle-two"></div>

        <div className="background-circle circle-three"></div>

      </div>


      <div className="login-container">

        {/* =====================================
            LEFT INFORMATION SECTION
        ===================================== */}

        <div className="login-info">

          {/* BRAND */}

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


          {/* INTRO */}

          <div className="login-intro">

            <span className="eyebrow">
              RESUME ANALYTICS PLATFORM
            </span>

            <h1>

              Know who is

              <br />

              viewing your

              <span>
                {" "}resume.
              </span>

            </h1>

            <p>
              Upload your resume, share your public
              profile and track every interaction
              from one powerful dashboard.
            </p>

          </div>


          {/* =====================================
              FEATURES
          ===================================== */}

          <div className="feature-list">

            {/* FEATURE 1 */}

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <div>

                <strong>
                  Resume Analytics
                </strong>

                <span>
                  Track profile and resume views
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <div>

                <strong>
                  Public Resume Link
                </strong>

                <span>
                  Share your professional profile
                </span>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="feature-item">

              <div className="feature-icon">
                ✓
              </div>

              <div>

                <strong>
                  Detailed Insights
                </strong>

                <span>
                  Understand your resume reach
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================
            LOGIN CARD
        ===================================== */}

        <div className="login-card">

          {/* =====================================
              CARD HEADER
          ===================================== */}

          <div className="login-card-header">

            <div className="mobile-logo">
              R
            </div>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to your Resume Tracker
            </p>

          </div>


          {/* =====================================
              LOGIN FORM
          ===================================== */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* =================================
                EMAIL
            ================================= */}

            <div className="form-group">

              <label htmlFor="email">
                Email
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
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="email"
                />

              </div>

            </div>


            {/* =================================
                PASSWORD
            ================================= */}

            <div className="form-group">

              <div className="label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {

                    alert(
                      "Password reset will be available soon."
                    );

                  }}
                >
                  Forgot password?
                </button>

              </div>


              <div className="input-wrapper password-input-wrapper">

                <span className="input-icon">
                  •
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="current-password"
                />

                {/* SHOW / HIDE PASSWORD */}

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◉"}
                </button>

              </div>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

              <div className="login-error">

                <span>
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>

            )}


            {/* =================================
                LOGIN BUTTON
            ================================= */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="spinner"></span>

                  Signing in...
                </>

              ) : (

                <>
                  Sign in

                  <span className="button-arrow">
                    →
                  </span>
                </>

              )}

            </button>

          </form>


          {/* =====================================
              REGISTER LINK
          ===================================== */}

          <div
            className="register-link-container"
          >

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              className="register-link-button"
              onClick={onGoToRegister}
            >
              Create account
            </button>

          </div>


          {/* =====================================
              DIVIDER
          ===================================== */}

          <div className="login-divider">

            <span>
              Secure access
            </span>

          </div>


          {/* =====================================
              FOOTER TEXT
          ===================================== */}

          <p className="login-footer">

            Your account and resume analytics
            are protected with secure authentication.

          </p>

        </div>

      </div>


      {/* =====================================
          COPYRIGHT
      ===================================== */}

      <div className="login-copyright">

        © 2026 Resume Tracker. All rights reserved.

      </div>

    </div>
  );
}

export default Login;