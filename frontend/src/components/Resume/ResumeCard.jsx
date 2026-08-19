import { useEffect, useState } from "react";
import "./Resume.css";

// =========================================================
// API BASE URL
// =========================================================
//
// Local development:
// VITE_API_BASE_URL=http://localhost:8080
//
// Production/Vercel:
// VITE_API_BASE_URL=https://resumetracker-b3a2.onrender.com
//
// =========================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");


function ResumeCard({ dashboard, onResumeDeleted }) {

  // =========================================================
  // STATE
  // =========================================================

  const [copiedSlug, setCopiedSlug] = useState(null);

  const [resumes, setResumes] = useState([]);

  const [deletingResumeId, setDeletingResumeId] = useState(null);

  const [deleteError, setDeleteError] = useState("");


  // =========================================================
  // SYNC RESUMES WITH DASHBOARD
  // =========================================================

  useEffect(() => {

    if (
      dashboard &&
      Array.isArray(dashboard.resumes)
    ) {

      setResumes(dashboard.resumes);

    } else {

      setResumes([]);

    }

  }, [dashboard]);


  // =========================================================
  // NO DASHBOARD
  // =========================================================

  if (!dashboard) {

    return null;

  }


  // =========================================================
  // USER EMAIL
  // =========================================================

  const email =
    dashboard.email || "-";


  // =========================================================
  // COPY PUBLIC LINK
  // =========================================================

  const handleCopyLink = async (
    url,
    resumeId
  ) => {

    if (!url) {

      return;

    }


    try {

      await navigator.clipboard.writeText(
        url
      );


      setCopiedSlug(resumeId);


      setTimeout(() => {

        setCopiedSlug(null);

      }, 1800);

    } catch (error) {

      console.error(
        "Failed to copy resume link:",
        error
      );


      // -----------------------------------------------------
      // FALLBACK COPY
      // -----------------------------------------------------

      try {

        const textArea =
          document.createElement(
            "textarea"
          );


        textArea.value = url;


        textArea.style.position =
          "fixed";

        textArea.style.left =
          "-999999px";


        document.body.appendChild(
          textArea
        );


        textArea.focus();

        textArea.select();


        document.execCommand(
          "copy"
        );


        document.body.removeChild(
          textArea
        );


        setCopiedSlug(resumeId);


        setTimeout(() => {

          setCopiedSlug(null);

        }, 1800);

      } catch (fallbackError) {

        console.error(
          "Copy fallback failed:",
          fallbackError
        );

      }

    }

  };


  // =========================================================
  // DELETE RESUME
  // =========================================================

  const handleDeleteResume =
    async (resume) => {

      if (!resume) {

        return;

      }


      // -----------------------------------------------------
      // GET RESUME ID
      // -----------------------------------------------------

      const resumeId =
        resume.resumeId ??
        resume.id;


      // -----------------------------------------------------
      // VALIDATE ID
      // -----------------------------------------------------

      if (
        resumeId === undefined ||
        resumeId === null ||
        resumeId === ""
      ) {

        setDeleteError(
          "Unable to delete this resume because the Resume ID is missing."
        );

        return;

      }


      // -----------------------------------------------------
      // PREVENT DOUBLE DELETE
      // -----------------------------------------------------

      if (
        deletingResumeId !== null
      ) {

        return;

      }


      // -----------------------------------------------------
      // RESUME NAME
      // -----------------------------------------------------

      const resumeName =
        resume.originalFileName ||
        "this resume";


      // -----------------------------------------------------
      // CONFIRM DELETE
      // -----------------------------------------------------

      const confirmed =
        window.confirm(

          `Are you sure you want to delete "${resumeName}"?\n\n` +

          "This action cannot be undone. The resume, public link, " +

          "and its associated resume data will be removed."

        );


      if (!confirmed) {

        return;

      }


      setDeletingResumeId(
        resumeId
      );

      setDeleteError("");


      // -----------------------------------------------------
      // GET TOKEN
      // -----------------------------------------------------

      const token =
        localStorage.getItem(
          "token"
        );


      if (!token) {

        setDeletingResumeId(null);


        setDeleteError(
          "Your session has expired. Please login again."
        );


        return;

      }


      // =====================================================
      // DELETE REQUEST
      // =====================================================

      try {

        const deleteUrl =
          `${API_BASE_URL}/api/resumes/${encodeURIComponent(
            resumeId
          )}`;


        console.log(
          "Deleting resume:",
          deleteUrl
        );


        const response =
          await fetch(
            deleteUrl,
            {
              method: "DELETE",

              headers: {

                Authorization:
                  `Bearer ${token}`,

                Accept:
                  "application/json",

              },

            }
          );


        // ---------------------------------------------------
        // AUTH ERROR
        // ---------------------------------------------------

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          localStorage.removeItem(
            "token"
          );


          throw new Error(
            "Your session has expired. Please login again."
          );

        }


        // ---------------------------------------------------
        // NOT FOUND
        // ---------------------------------------------------

        if (
          response.status === 404
        ) {

          throw new Error(
            "Resume was not found. It may already have been deleted."
          );

        }


        // ---------------------------------------------------
        // SERVER ERROR
        // ---------------------------------------------------

        if (!response.ok) {

          let message =
            "Unable to delete the resume.";


          try {

            const contentType =
              response.headers.get(
                "content-type"
              );


            if (
              contentType &&
              contentType.includes(
                "application/json"
              )
            ) {

              const data =
                await response.json();


              message =
                data?.message ||
                data?.error ||
                message;

            } else {

              const text =
                await response.text();


              if (text) {

                message = text;

              }

            }

          } catch {

            // Ignore response parsing errors.

          }


          throw new Error(
            message
          );

        }


        // ===================================================
        // SUCCESS
        // ===================================================

        console.log(
          "Resume deleted successfully:",
          resumeId
        );


        // ---------------------------------------------------
        // REMOVE FROM LOCAL UI
        // ---------------------------------------------------

        setResumes(
          (currentResumes) =>

            currentResumes.filter(
              (item) => {

                const itemId =
                  item?.resumeId ??
                  item?.id;


                return (
                  String(itemId) !==
                  String(resumeId)
                );

              }
            )

        );


        // ---------------------------------------------------
        // CLEAR COPIED STATE
        // ---------------------------------------------------

        setCopiedSlug(null);


        // ---------------------------------------------------
        // INFORM PARENT COMPONENT
        // ---------------------------------------------------

        if (
          typeof onResumeDeleted ===
          "function"
        ) {

          onResumeDeleted(
            resumeId
          );

        }


      } catch (error) {

        console.error(
          "Resume deletion error:",
          error
        );


        setDeleteError(
          error?.message ||
          "Unable to delete the resume."
        );


      } finally {

        setDeletingResumeId(
          null
        );

      }

    };


  // =========================================================
  // NO RESUMES
  // =========================================================

  if (
    resumes.length === 0
  ) {

    return (

      <section className="resume-card">

        <div className="resume-card-header">

          <div>

            <span className="section-label">
              RESUMES
            </span>

            <h2>
              Your Resumes
            </h2>

            <p>
              Upload multiple resumes and track each one
              separately.
            </p>

          </div>

        </div>


        <div className="resume-empty">

          <div className="resume-file-icon">
            PDF
          </div>

          <h3>
            No resumes uploaded
          </h3>

          <p>
            Upload your first resume to start tracking
            views and analytics.
          </p>

        </div>

      </section>

    );

  }


  // =========================================================
  // RESUME LIST
  // =========================================================

  return (

    <section className="resume-card">

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="resume-card-header">

        <div>

          <span className="section-label">
            RESUMES
          </span>

          <h2>
            Your Resumes
          </h2>

          <p>
            Manage and track each uploaded resume separately.
          </p>

        </div>


        <div className="resume-status">

          <span className="status-dot"></span>

          {resumes.length}{" "}

          {resumes.length === 1
            ? "Resume"
            : "Resumes"}

        </div>

      </div>


      {/* =====================================================
          DELETE ERROR
      ===================================================== */}

      {deleteError && (

        <div className="upload-message upload-error">

          <span>
            !
          </span>

          <div>
            {deleteError}
          </div>

        </div>

      )}


      {/* =====================================================
          RESUME LIST
      ===================================================== */}

      <div className="resume-list">

        {resumes.map(
          (resume, index) => {

            // -------------------------------------------------
            // RESUME ID
            // -------------------------------------------------

            const resumeId =
              resume?.resumeId ??
              resume?.id;


            // -------------------------------------------------
            // UNIQUE KEY
            // -------------------------------------------------

            const resumeKey =
              resumeId ??
              resume?.resumeSlug ??
              `${resume?.originalFileName || "resume"}-${index}`;


            // -------------------------------------------------
            // PUBLIC URL
            // -------------------------------------------------

            const publicResumeUrl =
              resume?.resumeSlug
                ? `${API_BASE_URL}/r/${encodeURIComponent(
                    resume.resumeSlug
                  )}`
                : "";


            // -------------------------------------------------
            // UPLOAD DATE
            // -------------------------------------------------

            const uploadedDate =
              resume?.uploadedAt
                ? new Date(
                    resume.uploadedAt
                  ).toLocaleString()
                : "-";


            // -------------------------------------------------
            // COPY STATE
            // -------------------------------------------------

            const isCopied =
              String(copiedSlug) ===
              String(resumeKey);


            // -------------------------------------------------
            // DELETE STATE
            // -------------------------------------------------

            const isDeleting =
              deletingResumeId !== null &&
              String(
                deletingResumeId
              ) ===
              String(resumeId);


            // -------------------------------------------------
            // RESUME NAME
            // -------------------------------------------------

            const resumeName =
              resume?.originalFileName ||
              "Unnamed Resume";


            return (

              <article
                className="resume-item"
                key={resumeKey}
              >

                {/* ===========================================
                    RESUME HEADER
                =========================================== */}

                <div className="resume-item-header">

                  <div className="resume-file-box">

                    <div className="resume-file-icon">
                      PDF
                    </div>


                    <div className="resume-file-info">

                      <h3
                        title={resumeName}
                      >
                        {resumeName}
                      </h3>

                      <p>
                        PDF Document
                      </p>

                    </div>

                  </div>


                  <div className="resume-upload-date">

                    <span>
                      UPLOADED
                    </span>

                    <strong>
                      {uploadedDate}
                    </strong>

                  </div>

                </div>


                {/* ===========================================
                    RESUME DETAILS
                =========================================== */}

                <div className="resume-details-grid">

                  {/* RESUME ID */}

                  <div className="resume-detail">

                    <span>
                      Resume ID
                    </span>

                    <strong>
                      {resumeId ?? "-"}
                    </strong>

                  </div>


                  {/* EMAIL */}

                  <div className="resume-detail">

                    <span>
                      Email
                    </span>

                    <strong title={email}>
                      {email}
                    </strong>

                  </div>


                  {/* TOTAL VIEWS */}

                  <div className="resume-detail">

                    <span>
                      Total Views
                    </span>

                    <strong>
                      {resume?.totalViews ?? 0}
                    </strong>

                  </div>


                  {/* TODAY */}

                  <div className="resume-detail">

                    <span>
                      Today
                    </span>

                    <strong>
                      {resume?.todayViews ?? 0}
                    </strong>

                  </div>


                  {/* WEEK */}

                  <div className="resume-detail">

                    <span>
                      This Week
                    </span>

                    <strong>
                      {resume?.weekViews ?? 0}
                    </strong>

                  </div>


                  {/* MONTH */}

                  <div className="resume-detail">

                    <span>
                      This Month
                    </span>

                    <strong>
                      {resume?.monthViews ?? 0}
                    </strong>

                  </div>


                  {/* SLUG */}

                  <div className="resume-detail resume-detail-full">

                    <span>
                      Resume Slug
                    </span>

                    <strong
                      title={
                        resume?.resumeSlug ||
                        "-"
                      }
                    >
                      {resume?.resumeSlug ||
                        "-"}
                    </strong>

                  </div>

                </div>


                {/* ===========================================
                    PUBLIC RESUME LINK
                =========================================== */}

                {publicResumeUrl && (

                  <div className="public-resume">

                    <div className="public-resume-top">

                      <div className="public-resume-info">

                        <div className="public-link-icon">
                          🔗
                        </div>

                        <div>

                          <span>
                            Public Resume Link
                          </span>

                          <p>
                            Share this link with recruiters
                            and employers.
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="public-resume-link-row">

                      <div className="public-resume-url">

                        <span>
                          {publicResumeUrl}
                        </span>

                      </div>


                      <div className="public-resume-actions">

                        {/* OPEN */}

                        <a
                          href={
                            publicResumeUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="open-resume-button"
                        >
                          Open
                        </a>


                        {/* COPY */}

                        <button
                          type="button"
                          className="copy-link-button"
                          onClick={() =>
                            handleCopyLink(
                              publicResumeUrl,
                              resumeKey
                            )
                          }
                          disabled={
                            isDeleting
                          }
                        >
                          {isCopied
                            ? "Copied"
                            : "Copy"}
                        </button>

                      </div>

                    </div>

                  </div>

                )}


                {/* ===========================================
                    DELETE ACTION
                =========================================== */}

                <div className="resume-delete-section">

                  <div className="resume-delete-warning">

                    <strong>
                      Delete this resume
                    </strong>

                    <span>
                      This will permanently remove this resume
                      and its public sharing data.
                    </span>

                  </div>


                  <button
                    type="button"
                    className="delete-resume-button"
                    onClick={() =>
                      handleDeleteResume(
                        resume
                      )
                    }
                    disabled={
                      deletingResumeId !==
                      null
                    }
                  >

                    {isDeleting ? (

                      <>

                        <span className="delete-spinner"></span>

                        Deleting...

                      </>

                    ) : (

                      <>
                        🗑 Delete Resume
                      </>

                    )}

                  </button>

                </div>

              </article>

            );

          }
        )}

      </div>

    </section>

  );

}


export default ResumeCard;