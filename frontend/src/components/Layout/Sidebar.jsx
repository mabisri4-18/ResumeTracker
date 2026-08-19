import "./Layout.css";

function Sidebar({ activePage, onNavigate, onLogout }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "▦",
    },
    {
      id: "resume",
      label: "My Resume",
      icon: "▤",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "◔",
    },
  ];

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">

        <div className="brand-logo">
          R
        </div>

        <div className="brand-text">

          <h2>
            Resume<span>Track</span>
          </h2>

          <p>
            Resume Intelligence
          </p>

        </div>

      </div>


      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => (

          <button
            key={item.id}
            type="button"
            className={`nav-item ${
              activePage === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              onNavigate?.(item.id)
            }
          >

            <span className="nav-icon">
              {item.icon}
            </span>

            <span className="nav-label">
              {item.label}
            </span>

            {activePage === item.id && (
              <span className="active-indicator" />
            )}

          </button>

        ))}

      </nav>


      {/* Bottom section */}
      <div className="sidebar-bottom">

        {/* Help */}
        <div className="sidebar-help">

          <div className="help-icon">
            ?
          </div>

          <div className="help-content">

            <strong>
              Need help?
            </strong>

            <p>
              Manage your resume analytics
            </p>

          </div>

        </div>


        {/* Logout */}
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >

          <span className="logout-icon">
            ⇥
          </span>

          <span>
            Logout
          </span>

        </button>


        {/* Version */}
        <div className="sidebar-version">
          ResumeTrack v1.0
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;