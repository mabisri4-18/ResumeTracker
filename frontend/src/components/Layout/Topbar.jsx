function Topbar({
  pageTitle = "Dashboard",
  pageDescription = "Overview of your resume performance",
  username = "User",
}) {

  // =========================================================
  // SAFE USERNAME
  // =========================================================

  const displayName =
    username &&
    String(username).trim()
      ? String(username).trim()
      : "User";


  // =========================================================
  // USER INITIAL
  // =========================================================

  const initial =
    displayName
      .charAt(0)
      .toUpperCase() || "U";


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <header className="topbar">

      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="topbar-left">

        <div className="page-heading">

          <h1>
            {pageTitle}
          </h1>

          <p>
            {pageDescription}
          </p>

        </div>

      </div>


      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="topbar-right">

        {/* ===================================================
            USER PROFILE
        =================================================== */}

        <button
          type="button"
          className="user-profile"
          aria-label={`User profile for ${displayName}`}
        >

          {/* AVATAR */}

          <div className="user-avatar">

            {initial}

          </div>


          {/* USER INFORMATION */}

          <div className="user-info">

            <strong>
              {displayName}
            </strong>

            <span>

              <span
                className="online-dot"
                aria-hidden="true"
              />

              Online

            </span>

          </div>


          {/* ARROW */}

          <span
            className="profile-arrow"
            aria-hidden="true"
          >
            ▾
          </span>

        </button>

      </div>

    </header>

  );
}

export default Topbar;