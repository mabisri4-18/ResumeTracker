
import { useEffect, useState } from "react";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";

import Dashboard from "./components/Dashboard/Dashboard";
import Analytics from "./components/Analytics/Analytics";

import ResumeCard from "./components/Resume/ResumeCard";
import ResumeUpload from "./components/Resume/ResumeUpload";

import { apiRequest } from "./services/api";

import "./App.css";
import "./components/Layout/Layout.css";


function App() {

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [authPage, setAuthPage] = useState("login");


  // =========================================================
  // APPLICATION NAVIGATION
  // =========================================================

  const [activePage, setActivePage] =
    useState("dashboard");


  // =========================================================
  // USER
  // =========================================================

  const [username, setUsername] =
    useState(
      localStorage.getItem("username") || "User"
    );


  // =========================================================
  // RESUME DATA
  // =========================================================

  const [resumeData, setResumeData] =
    useState(null);

  const [resumeLoading, setResumeLoading] =
    useState(false);

  const [resumeError, setResumeError] =
    useState("");


  // =========================================================
  // GET USERNAME FROM JWT
  //
  // Fallback only.
  // =========================================================

  const getUsernameFromToken = (currentToken) => {

    if (!currentToken) {
      return "User";
    }

    try {

      const parts =
        currentToken.split(".");

      if (parts.length !== 3) {
        return "User";
      }

      const payload =
        JSON.parse(
          atob(
            parts[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );

      const name =
        payload.name ||
        payload.username ||
        payload.fullName ||
        payload.email ||
        payload.sub;

      return name || "User";

    } catch (error) {

      console.warn(
        "Unable to read username from JWT:",
        error
      );

      return "User";
    }
  };


  // =========================================================
  // LOAD USER INFORMATION
  // =========================================================

  const loadUserInformation = async () => {

    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      return;
    }


    // -------------------------------------------------------
    // FIRST: GET FALLBACK FROM JWT
    // -------------------------------------------------------

    const tokenUsername =
      getUsernameFromToken(currentToken);

    if (
      tokenUsername &&
      tokenUsername !== "User"
    ) {

      setUsername(tokenUsername);

      localStorage.setItem(
        "username",
        tokenUsername
      );
    }


    // -------------------------------------------------------
    // SECOND: GET REAL USER DATA
    //
    // apiRequest automatically:
    // - uses VITE_API_BASE_URL
    // - adds Authorization header
    // - handles JSON
    // - handles errors
    // -------------------------------------------------------

    try {

      const dashboard =
        await apiRequest(
          "/api/dashboard"
        );

      console.log(
        "User information:",
        dashboard
      );


      const serverUsername =
        dashboard?.name ||
        dashboard?.username ||
        dashboard?.fullName ||
        dashboard?.user?.name ||
        dashboard?.user?.username;


      if (
        serverUsername &&
        String(serverUsername).trim()
      ) {

        const cleanUsername =
          String(serverUsername).trim();

        setUsername(cleanUsername);

        localStorage.setItem(
          "username",
          cleanUsername
        );

        return;
      }


      // -----------------------------------------------------
      // FALLBACK TO EMAIL
      // -----------------------------------------------------

      if (
        dashboard?.email &&
        String(dashboard.email).trim()
      ) {

        const emailUsername =
          String(dashboard.email).trim();

        setUsername(emailUsername);

        localStorage.setItem(
          "username",
          emailUsername
        );
      }

    } catch (error) {

      console.warn(
        "Unable to load user information:",
        error
      );

    }
  };


  // =========================================================
  // LOAD USER WHEN LOGGED IN
  // =========================================================

  useEffect(() => {

    if (token) {
      loadUserInformation();
    }

  }, [token]);


  // =========================================================
  // LOAD RESUME DATA
  // =========================================================

  const loadResumeData = async () => {

    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      return;
    }


    setResumeLoading(true);
    setResumeError("");


    try {

      // =====================================================
      // IMPORTANT
      //
      // DO NOT use:
      //
      // fetch("http://localhost:8080/...")
      //
      // Use apiRequest so Vercel uses:
      //
      // VITE_API_BASE_URL
      //
      // =====================================================

      const data =
        await apiRequest(
          "/api/dashboard"
        );


      console.log(
        "Resume dashboard data:",
        data
      );


      // =====================================================
      // AUTHENTICATION CHECK
      // =====================================================

      if (!localStorage.getItem("token")) {

        setToken(null);

        setResumeData(null);

        setUsername("User");

        return;
      }


      // =====================================================
      // NO RESUME
      //
      // Backend dashboard may return:
      //
      // {
      //   hasResume: false,
      //   resumes: []
      // }
      //
      // In that case we want the empty state.
      // =====================================================

      if (
        data &&
        data.hasResume === false
      ) {

        setResumeData(null);

        return;
      }


      // =====================================================
      // SUCCESS
      // =====================================================

      setResumeData(data);


      // -----------------------------------------------------
      // UPDATE USERNAME FROM DASHBOARD
      // -----------------------------------------------------

      const serverUsername =
        data?.name ||
        data?.username ||
        data?.fullName ||
        data?.user?.name ||
        data?.user?.username;


      if (
        serverUsername &&
        String(serverUsername).trim()
      ) {

        const cleanUsername =
          String(serverUsername).trim();

        setUsername(cleanUsername);

        localStorage.setItem(
          "username",
          cleanUsername
        );

      } else if (
        data?.email &&
        String(data.email).trim()
      ) {

        const emailUsername =
          String(data.email).trim();

        setUsername(emailUsername);

        localStorage.setItem(
          "username",
          emailUsername
        );
      }

    } catch (error) {

      console.error(
        "Resume data error:",
        error
      );


      // =====================================================
      // SESSION EXPIRED
      // =====================================================

      if (
        !localStorage.getItem("token")
      ) {

        setToken(null);

        setUsername("User");

        setResumeData(null);

        setResumeError("");

        return;
      }


      // =====================================================
      // OTHER ERROR
      // =====================================================

      setResumeError(
        error?.message ||
        "Unable to load resume information."
      );

    } finally {

      setResumeLoading(false);

    }
  };


  // =========================================================
  // LOAD RESUME WHEN RESUME PAGE OPENS
  // =========================================================

  useEffect(() => {

    if (
      token &&
      activePage === "resume"
    ) {

      loadResumeData();

    }

  }, [token, activePage]);


  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = (jwt) => {

    localStorage.setItem(
      "token",
      jwt
    );

    setToken(jwt);


    // -------------------------------------------------------
    // GET USERNAME FROM JWT IMMEDIATELY
    // -------------------------------------------------------

    const tokenUsername =
      getUsernameFromToken(jwt);


    if (
      tokenUsername &&
      tokenUsername !== "User"
    ) {

      setUsername(tokenUsername);

      localStorage.setItem(
        "username",
        tokenUsername
      );

    } else {

      setUsername("User");

      localStorage.removeItem(
        "username"
      );
    }


    // -------------------------------------------------------
    // GO TO DASHBOARD
    // -------------------------------------------------------

    setActivePage("dashboard");

    setResumeData(null);

    setResumeError("");
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    setToken(null);

    setUsername("User");

    setResumeData(null);

    setResumeError("");

    setActivePage("dashboard");

    setAuthPage("login");
  };


  // =========================================================
  // NOT LOGGED IN
  // =========================================================

  if (!token) {

    if (authPage === "register") {

      return (
        <Register
          onRegistered={() =>
            setAuthPage("login")
          }

          onGoToLogin={() =>
            setAuthPage("login")
          }
        />
      );
    }


    return (
      <Login
        onLogin={handleLogin}

        onGoToRegister={() =>
          setAuthPage("register")
        }
      />
    );
  }


  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (

    <div className="app-layout">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />


      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <div className="main-area">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <Topbar
          username={username}

          pageTitle={
            activePage === "dashboard"
              ? "Dashboard"
              : activePage === "analytics"
                ? "Analytics"
                : activePage === "resume"
                  ? "My Resume"
                  : "Dashboard"
          }

          pageDescription={
            activePage === "dashboard"
              ? "Overview of your resume performance"
              : activePage === "analytics"
                ? "Track your resume visibility and performance"
                : activePage === "resume"
                  ? "Manage your resume and public sharing link"
                  : "Overview of your resume performance"
          }
        />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="page-content">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          {activePage === "dashboard" && (
            <Dashboard />
          )}


          {/* =================================================
              ANALYTICS
          ================================================= */}

          {activePage === "analytics" && (
            <Analytics />
          )}


          {/* =================================================
              MY RESUME
          ================================================= */}

          {activePage === "resume" && (

            <div className="resume-page">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="resume-page-header">

                <div>

                  <span className="section-label">
                    MY RESUME
                  </span>

                  <h1>
                    Resume Management
                  </h1>

                  <p>
                    Manage your resume and public
                    sharing link.
                  </p>

                </div>


                <button
                  type="button"
                  className="resume-refresh-button"
                  onClick={loadResumeData}
                  disabled={resumeLoading}
                >

                  {resumeLoading
                    ? "Loading..."
                    : "↻ Refresh"}

                </button>

              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

              {resumeError && (

                <div className="resume-page-error">

                  <span>
                    !
                  </span>

                  {resumeError}

                </div>

              )}


              {/* =================================================
                  LOADING
              ================================================= */}

              {resumeLoading &&
                !resumeData && (

                  <div className="resume-page-loading">

                    <div className="page-spinner"></div>

                    <p>
                      Loading your resume...
                    </p>

                  </div>

                )}


              {/* =================================================
                  RESUME EXISTS
              ================================================= */}

              {!resumeLoading &&
                resumeData && (

                  <>

                    <ResumeCard
                      dashboard={resumeData}
                    />

                    <ResumeUpload
                      onUploadSuccess={
                        async () => {
                          await loadResumeData();
                        }
                      }
                    />

                  </>

                )}


              {/* =================================================
                  NO RESUME
              ================================================= */}

              {!resumeLoading &&
                !resumeData &&
                !resumeError && (

                  <div className="resume-empty-state">

                    <div className="empty-icon">
                      📄
                    </div>

                    <h2>
                      No resume found
                    </h2>

                    <p>
                      You haven't uploaded a resume
                      yet.
                    </p>

                    <ResumeUpload
                      onUploadSuccess={
                        async () => {
                          await loadResumeData();
                        }
                      }
                    />

                  </div>

                )}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}


export default App;
