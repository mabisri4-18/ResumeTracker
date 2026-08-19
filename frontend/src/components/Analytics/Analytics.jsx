import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../services/api";
import RecentViews from "./RecentViews";

import "./Analytics.css";

function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [recentViews, setRecentViews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [viewsLoading, setViewsLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD DASHBOARD + RECENT VIEWS
  // =========================================================

  const loadAnalytics = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setViewsLoading(true);
      setError("");

      // =====================================================
      // LOAD DASHBOARD DATA
      // =====================================================

      const dashboardData = await apiRequest("/api/dashboard");

      console.log(
        "======================================"
      );

      console.log(
        "FULL ANALYTICS DASHBOARD:",
        dashboardData
      );

      console.log(
        "======================================"
      );

      setDashboard(dashboardData);

      // =====================================================
      // LOAD ALL RESUME VIEWS
      // =====================================================

      try {
        const viewsData = await apiRequest(
          "/api/dashboard/views"
        );

        console.log(
          "======================================"
        );

        console.log(
          "ANALYTICS VIEWS RESPONSE:",
          viewsData
        );

        console.log(
          "ANALYTICS VIEWS COUNT:",
          Array.isArray(viewsData)
            ? viewsData.length
            : 0
        );

        console.log(
          "======================================"
        );

        if (Array.isArray(viewsData)) {
          setRecentViews(viewsData);
        } else {
          setRecentViews([]);
        }

      } catch (viewsError) {
        console.error(
          "Unable to load recent views:",
          viewsError
        );

        // Do not break the whole Analytics page
        // if only recent views fail.
        setRecentViews([]);
      }

    } catch (err) {
      console.error(
        "Analytics loading error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load analytics."
      );

      setDashboard(null);
      setRecentViews([]);

    } finally {
      setLoading(false);
      setViewsLoading(false);
    }
  }, []);

  // =========================================================
  // LOAD WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // =========================================================
  // RESUMES
  // =========================================================

  const resumes = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    return Array.isArray(dashboard.resumes)
      ? dashboard.resumes
      : [];
  }, [dashboard]);

  // =========================================================
  // CALCULATE ANALYTICS
  // =========================================================

  const analytics = useMemo(() => {
    if (!dashboard) {
      return {
        totalViews: 0,
        todayViews: 0,
        weekViews: 0,
        monthViews: 0,
        totalResumes: 0,
      };
    }

    const calculatedTotalViews =
      resumes.reduce(
        (total, resume) =>
          total +
          Number(resume?.totalViews || 0),
        0
      );

    const calculatedTodayViews =
      resumes.reduce(
        (total, resume) =>
          total +
          Number(resume?.todayViews || 0),
        0
      );

    const calculatedWeekViews =
      resumes.reduce(
        (total, resume) =>
          total +
          Number(resume?.weekViews || 0),
        0
      );

    const calculatedMonthViews =
      resumes.reduce(
        (total, resume) =>
          total +
          Number(resume?.monthViews || 0),
        0
      );

    return {
      totalViews:
        dashboard.totalViews !== undefined &&
        dashboard.totalViews !== null
          ? Number(dashboard.totalViews)
          : calculatedTotalViews,

      todayViews:
        dashboard.todayViews !== undefined &&
        dashboard.todayViews !== null
          ? Number(dashboard.todayViews)
          : calculatedTodayViews,

      weekViews:
        dashboard.weekViews !== undefined &&
        dashboard.weekViews !== null
          ? Number(dashboard.weekViews)
          : calculatedWeekViews,

      monthViews:
        dashboard.monthViews !== undefined &&
        dashboard.monthViews !== null
          ? Number(dashboard.monthViews)
          : calculatedMonthViews,

      totalResumes:
        dashboard.totalResumes !== undefined &&
        dashboard.totalResumes !== null
          ? Number(dashboard.totalResumes)
          : dashboard.resumeCount !== undefined &&
            dashboard.resumeCount !== null
            ? Number(dashboard.resumeCount)
            : resumes.length,
    };
  }, [dashboard, resumes]);

  // =========================================================
  // SORTED RESUMES
  // =========================================================

  const sortedResumes = useMemo(() => {
    return [...resumes].sort((a, b) => {
      const dateA = a?.uploadedAt
        ? new Date(a.uploadedAt).getTime()
        : 0;

      const dateB = b?.uploadedAt
        ? new Date(b.uploadedAt).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [resumes]);

  // =========================================================
  // LATEST RESUME
  // =========================================================

  const latestResume = useMemo(() => {
    if (!dashboard) {
      return null;
    }

    if (dashboard.currentResume) {
      return dashboard.currentResume;
    }

    if (dashboard.latestResume) {
      return dashboard.latestResume;
    }

    return sortedResumes[0] || null;
  }, [
    dashboard,
    sortedResumes,
  ]);

  // =========================================================
  // SORT RECENT VIEWS
  // =========================================================

  const sortedRecentViews = useMemo(() => {
    return [...recentViews]
      .sort((a, b) => {
        const dateA = new Date(
          a?.viewedAt ||
          a?.createdAt ||
          a?.timestamp ||
          0
        ).getTime();

        const dateB = new Date(
          b?.viewedAt ||
          b?.createdAt ||
          b?.timestamp ||
          0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 20);
  }, [recentViews]);

  // =========================================================
  // BAR PERCENTAGES
  // =========================================================

  const percentages = useMemo(() => {
    const total = analytics.totalViews;

    if (total <= 0) {
      return {
        today: 0,
        week: 0,
        month: 0,
      };
    }

    return {
      today: Math.min(
        (analytics.todayViews / total) * 100,
        100
      ),

      week: Math.min(
        (analytics.weekViews / total) * 100,
        100
      ),

      month: Math.min(
        (analytics.monthViews / total) * 100,
        100
      ),
    };
  }, [analytics]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="analytics-page">

        <div className="analytics-state">

          <div className="analytics-state-icon">
            📊
          </div>

          <h2>
            Loading analytics...
          </h2>

          <p>
            Fetching your resume performance.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="analytics-page">

        <div className="analytics-state">

          <div className="analytics-state-icon">
            ⚠️
          </div>

          <h2>
            Unable to load analytics
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="analytics-retry-button"
            onClick={loadAnalytics}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // NO DATA
  // =========================================================

  if (!dashboard) {
    return (
      <div className="analytics-page">

        <div className="analytics-state">

          <div className="analytics-state-icon">
            📊
          </div>

          <h2>
            No analytics data
          </h2>

          <p>
            The server did not return analytics data.
          </p>

          <button
            type="button"
            className="analytics-retry-button"
            onClick={loadAnalytics}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="analytics-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="analytics-header">

        <div>

          <span className="page-eyebrow">
            INSIGHTS
          </span>

          <h1>
            Resume Analytics
          </h1>

          <p>
            Track how recruiters and visitors
            interact with all your resumes.
          </p>

        </div>

        <div className="analytics-header-actions">

          <div className="analytics-status">

            <span className="status-dot"></span>

            Tracking Active

          </div>

          <button
            type="button"
            className="analytics-refresh-button"
            onClick={loadAnalytics}
            disabled={loading}
          >
            ↻{" "}
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="analytics-stats-grid">

        {/* TOTAL */}

        <div className="analytics-stat-card total">

          <div className="analytics-stat-top">

            <div className="analytics-stat-icon">
              👁️
            </div>

            <span className="analytics-stat-label">
              Total Views
            </span>

          </div>

          <div className="analytics-stat-value">
            {analytics.totalViews}
          </div>

          <p>
            All-time views across all resumes
          </p>

        </div>


        {/* TODAY */}

        <div className="analytics-stat-card today">

          <div className="analytics-stat-top">

            <div className="analytics-stat-icon">
              📅
            </div>

            <span className="analytics-stat-label">
              Today
            </span>

          </div>

          <div className="analytics-stat-value">
            {analytics.todayViews}
          </div>

          <p>
            Views across all resumes today
          </p>

        </div>


        {/* WEEK */}

        <div className="analytics-stat-card week">

          <div className="analytics-stat-top">

            <div className="analytics-stat-icon">
              📈
            </div>

            <span className="analytics-stat-label">
              This Week
            </span>

          </div>

          <div className="analytics-stat-value">
            {analytics.weekViews}
          </div>

          <p>
            Views across all resumes this week
          </p>

        </div>


        {/* MONTH */}

        <div className="analytics-stat-card month">

          <div className="analytics-stat-top">

            <div className="analytics-stat-icon">
              🚀
            </div>

            <span className="analytics-stat-label">
              This Month
            </span>

          </div>

          <div className="analytics-stat-value">
            {analytics.monthViews}
          </div>

          <p>
            Views across all resumes this month
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div className="analytics-content-grid">

        {/* ===================================================
            VIEW OVERVIEW
        =================================================== */}

        <section className="analytics-overview-card">

          <div className="section-heading">

            <div>

              <span className="analytics-section-label">
                PERFORMANCE
              </span>

              <h2>
                View Overview
              </h2>

              <p>
                A quick summary of your resume visibility.
              </p>

            </div>

          </div>


          <div className="overview-content">

            <div className="overview-main">

              <span>
                Total Resume Views
              </span>

              <strong>
                {analytics.totalViews}
              </strong>

              <p>

                Your resumes have received{" "}

                <strong>
                  {analytics.totalViews}
                </strong>{" "}

                {analytics.totalViews === 1
                  ? "view"
                  : "views"}{" "}

                in total.

              </p>

            </div>


            <div className="overview-bars">

              {/* TODAY */}

              <div className="overview-bar-item">

                <div className="bar-label">

                  <span>
                    Today
                  </span>

                  <strong>
                    {analytics.todayViews}
                  </strong>

                </div>

                <div className="bar-track">

                  <div
                    className="bar-fill"
                    style={{
                      width:
                        `${percentages.today}%`,
                    }}
                  />

                </div>

              </div>


              {/* WEEK */}

              <div className="overview-bar-item">

                <div className="bar-label">

                  <span>
                    This Week
                  </span>

                  <strong>
                    {analytics.weekViews}
                  </strong>

                </div>

                <div className="bar-track">

                  <div
                    className="bar-fill"
                    style={{
                      width:
                        `${percentages.week}%`,
                    }}
                  />

                </div>

              </div>


              {/* MONTH */}

              <div className="overview-bar-item">

                <div className="bar-label">

                  <span>
                    This Month
                  </span>

                  <strong>
                    {analytics.monthViews}
                  </strong>

                </div>

                <div className="bar-track">

                  <div
                    className="bar-fill"
                    style={{
                      width:
                        `${percentages.month}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            RESUME SUMMARY
        =================================================== */}

        <section className="analytics-resume-card">

          <div className="section-heading">

            <div>

              <span className="analytics-section-label">
                RESUMES
              </span>

              <h2>
                Resume Summary
              </h2>

              <p>
                Your currently uploaded resumes.
              </p>

            </div>

          </div>


          <div className="analytics-resume-count">

            <div className="analytics-resume-count-icon">
              📄
            </div>

            <div>

              <strong>
                {analytics.totalResumes}
              </strong>

              <span>
                {analytics.totalResumes === 1
                  ? "Resume uploaded"
                  : "Resumes uploaded"}
              </span>

            </div>

          </div>


          {latestResume ? (

            <div className="resume-preview">

              <div className="resume-icon">
                PDF
              </div>

              <div className="resume-preview-info">

                <h3
                  title={
                    latestResume.originalFileName ||
                    "resume.pdf"
                  }
                >
                  {latestResume.originalFileName ||
                    "resume.pdf"}
                </h3>

                <span>
                  Resume ID:{" "}
                  {latestResume.resumeId ||
                    latestResume.id ||
                    "-"}
                </span>

              </div>

            </div>

          ) : (

            <div className="resume-empty">

              <div className="resume-empty-icon">
                📄
              </div>

              <h3>
                No Resume Uploaded
              </h3>

              <p>
                Upload a resume to start
                tracking views and analytics.
              </p>

            </div>

          )}


          {latestResume && (

            <div className="resume-analytics-details">

              <div>

                <span>
                  Status
                </span>

                <strong className="active-status">
                  Active
                </strong>

              </div>

              <div>

                <span>
                  Visibility
                </span>

                <strong>
                  Public
                </strong>

              </div>

            </div>

          )}

        </section>

      </div>


      {/* =====================================================
          INDIVIDUAL RESUME PERFORMANCE
      ===================================================== */}

      {resumes.length > 0 && (

        <section className="analytics-resume-performance">

          <div className="section-heading">

            <div>

              <span className="analytics-section-label">
                BREAKDOWN
              </span>

              <h2>
                Resume Performance
              </h2>

              <p>
                Performance of each uploaded resume.
              </p>

            </div>

          </div>


          <div className="analytics-resume-list">

            {sortedResumes.map(
              (resume, index) => {

                const resumeName =
                  resume?.originalFileName ||
                  "Unnamed Resume";

                const resumeId =
                  resume?.resumeId ||
                  resume?.id ||
                  "-";

                return (

                  <div
                    className="analytics-resume-item"
                    key={
                      resume?.id ||
                      resume?.resumeSlug ||
                      index
                    }
                  >

                    <div className="analytics-resume-item-left">

                      <div className="analytics-resume-pdf">
                        PDF
                      </div>

                      <div>

                        <strong title={resumeName}>
                          {resumeName}
                        </strong>

                        <span>
                          Resume ID: {resumeId}
                        </span>

                      </div>

                    </div>


                    <div className="analytics-resume-item-stats">

                      <div>

                        <span>
                          Total
                        </span>

                        <strong>
                          {resume?.totalViews ?? 0}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Today
                        </span>

                        <strong>
                          {resume?.todayViews ?? 0}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Week
                        </span>

                        <strong>
                          {resume?.weekViews ?? 0}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Month
                        </span>

                        <strong>
                          {resume?.monthViews ?? 0}
                        </strong>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </section>

      )}


      {/* =====================================================
          RECENT VIEWS
      ===================================================== */}

      <RecentViews
        views={sortedRecentViews}
      />

      {/* =====================================================
          RECENT VIEWS STATUS
      ===================================================== */}

      {viewsLoading && (
        <p
          style={{
            textAlign: "center",
            marginTop: "12px",
            color: "#888",
            fontSize: "12px",
          }}
        >
          Loading recent views...
        </p>
      )}

    </div>
  );
}

export default Analytics;