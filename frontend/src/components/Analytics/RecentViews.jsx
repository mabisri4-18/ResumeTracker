function RecentViews({ views = [] }) {
  const safeViews = Array.isArray(views)
    ? views
    : [];

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString();
  };

  // =========================================================
  // SOURCE
  // =========================================================

  const getViewSource = (view) => {
    return (
      view?.referrer ||
      view?.source ||
      view?.origin ||
      "Direct visit"
    );
  };

  // =========================================================
  // DEVICE
  // =========================================================

  const getDevice = (view) => {
    if (view?.device) {
      return view.device;
    }

    if (view?.deviceType) {
      return view.deviceType;
    }

    if (view?.userAgent) {
      const userAgent =
        view.userAgent.toLowerCase();

      if (
        userAgent.includes("tablet") ||
        userAgent.includes("ipad")
      ) {
        return "Tablet";
      }

      if (
        userAgent.includes("mobile") ||
        userAgent.includes("android") ||
        userAgent.includes("iphone")
      ) {
        return "Mobile";
      }

      return "Desktop";
    }

    return "Unknown";
  };

  // =========================================================
  // IP
  // =========================================================

  const getIpAddress = (view) => {
    return (
      view?.ipAddress ||
      view?.ip ||
      view?.clientIp ||
      "Unknown"
    );
  };

  // =========================================================
  // RESUME NAME
  // =========================================================

  const getResumeName = (view) => {
    return (
      view?.resumeFileName ||
      view?.resumeName ||
      view?.originalFileName ||
      view?.fileName ||
      "Resume"
    );
  };

  // =========================================================
  // EMPTY
  // =========================================================

  if (safeViews.length === 0) {
    return (
      <section className="recent-views-section">

        <div className="recent-views-card">

          <div className="recent-views-header">

            <div>

              <span className="analytics-section-label">
                ACTIVITY
              </span>

              <h2>
                Recent Views
              </h2>

              <p>
                Latest visitors to your public resumes.
              </p>

            </div>

            <span className="view-count">
              0 views
            </span>

          </div>


          <div className="no-views">

            <div className="no-views-icon">
              👁
            </div>

            <h3>
              No resume views yet
            </h3>

            <p>
              When someone visits your public resume,
              their activity will appear here.
            </p>

          </div>

        </div>

      </section>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <section className="recent-views-section">

      <div className="recent-views-card">

        {/* HEADER */}

        <div className="recent-views-header">

          <div>

            <span className="analytics-section-label">
              ACTIVITY
            </span>

            <h2>
              Recent Views
            </h2>

            <p>
              Latest visitors to your public resumes.
            </p>

          </div>

          <span className="view-count">

            {safeViews.length}{" "}

            {safeViews.length === 1
              ? "view"
              : "views"}

          </span>

        </div>


        {/* TABLE */}

        <div className="recent-table-wrapper">

          <table className="recent-views-table">

            <thead>

              <tr>

                <th>
                  Visitor
                </th>

                <th>
                  Resume
                </th>

                <th>
                  Device
                </th>

                <th>
                  IP Address
                </th>

                <th>
                  Source
                </th>

                <th>
                  Viewed
                </th>

              </tr>

            </thead>


            <tbody>

              {safeViews.map(
                (view, index) => (

                  <tr
                    key={
                      view?.id ||
                      view?.viewId ||
                      `${view?.resumeId || "resume"}-${view?.viewedAt || index}`
                    }
                  >

                    {/* VISITOR */}

                    <td>

                      <div className="visitor-cell">

                        <div className="visitor-avatar">
                          👁
                        </div>

                        <div>

                          <strong>
                            Resume Visitor
                          </strong>

                          <span>
                            Public resume view
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* RESUME */}

                    <td>

                      <span
                        className="resume-name-cell"
                        title={getResumeName(view)}
                      >
                        {getResumeName(view)}
                      </span>

                    </td>


                    {/* DEVICE */}

                    <td>

                      <span className="device-badge">
                        {getDevice(view)}
                      </span>

                    </td>


                    {/* IP */}

                    <td>

                      <span className="ip-cell">
                        {getIpAddress(view)}
                      </span>

                    </td>


                    {/* SOURCE */}

                    <td>

                      <span
                        className="referrer-badge"
                        title={getViewSource(view)}
                      >
                        {getViewSource(view)}
                      </span>

                    </td>


                    {/* DATE */}

                    <td>

                      <span className="date-cell">
                        {formatDate(
                          view?.viewedAt ||
                          view?.createdAt ||
                          view?.timestamp
                        )}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

export default RecentViews;