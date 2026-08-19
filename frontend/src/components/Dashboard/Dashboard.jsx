

// import { useCallback, useEffect, useState } from "react";
// import "./Dashboard.css";

// const API_BASE_URL = "http://localhost:8080";

// // =============================================================
// // DELETE API URL
// // =============================================================
// //
// // Expected Spring Boot endpoint:
// //
// // DELETE /api/resumes/{resumeId}
// //
// // Example:
// //
// // DELETE http://localhost:8080/api/resumes/5
// //
// // =============================================================

// const DELETE_RESUME_URL = (resumeId) =>
//   `${API_BASE_URL}/api/resumes/${resumeId}`;


// function Dashboard() {

//   // ===========================================================
//   // STATE
//   // ===========================================================

//   const [dashboard, setDashboard] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [refreshing, setRefreshing] = useState(false);

//   const [error, setError] = useState("");

//   const [copied, setCopied] = useState(false);

//   // Stores the ID of the resume currently being deleted.
//   //
//   // Example:
//   //
//   // deletingResumeId = 5
//   //
//   // This allows us to show:
//   //
//   // "Deleting..."
//   //
//   // only on that particular resume.

//   const [deletingResumeId, setDeletingResumeId] =
//     useState(null);


//   // ===========================================================
//   // LOAD DASHBOARD
//   // ===========================================================

//   const loadDashboard = useCallback(
//     async (isRefresh = false) => {

//       const token =
//         localStorage.getItem("token");


//       // -------------------------------------------------------
//       // TOKEN CHECK
//       // -------------------------------------------------------

//       if (!token) {

//         setError(
//           "Please login again."
//         );

//         setLoading(false);

//         return;
//       }


//       // -------------------------------------------------------
//       // LOADING STATE
//       // -------------------------------------------------------

//       if (isRefresh) {

//         setRefreshing(true);

//       } else {

//         setLoading(true);
//       }


//       setError("");


//       // -------------------------------------------------------
//       // API REQUEST
//       // -------------------------------------------------------

//       try {

//         const response =
//           await fetch(
//             `${API_BASE_URL}/api/dashboard`,
//             {
//               method: "GET",

//               headers: {
//                 Authorization:
//                   `Bearer ${token}`,

//                 Accept:
//                   "application/json",
//               },
//             }
//           );


//         // -----------------------------------------------------
//         // AUTH ERROR
//         // -----------------------------------------------------

//         if (
//           response.status === 401 ||
//           response.status === 403
//         ) {

//           localStorage.removeItem(
//             "token"
//           );

//           throw new Error(
//             "Your session has expired. Please login again."
//           );
//         }


//         // -----------------------------------------------------
//         // SERVER ERROR
//         // -----------------------------------------------------

//         if (!response.ok) {

//           let message =
//             "Unable to load dashboard.";


//           try {

//             const data =
//               await response.json();

//             message =
//               data?.message ||
//               data?.error ||
//               message;

//           } catch {

//             // Ignore invalid JSON.
//           }


//           throw new Error(
//             message
//           );
//         }


//         // -----------------------------------------------------
//         // SUCCESS
//         // -----------------------------------------------------

//         const data =
//           await response.json();


//         console.log(
//           "Dashboard data:",
//           data
//         );


//         setDashboard(data);

//       } catch (err) {

//         console.error(
//           "Dashboard loading error:",
//           err
//         );


//         setError(
//           err?.message ||
//           "Unable to load dashboard."
//         );

//       } finally {

//         setLoading(false);

//         setRefreshing(false);
//       }
//     },
//     []
//   );


//   // ===========================================================
//   // LOAD DASHBOARD WHEN COMPONENT OPENS
//   // ===========================================================

//   useEffect(() => {

//     loadDashboard();

//   }, [loadDashboard]);


//   // ===========================================================
//   // REFRESH
//   // ===========================================================

//   const handleRefresh = () => {

//     loadDashboard(true);
//   };


//   // ===========================================================
//   // DELETE RESUME
//   // ===========================================================

//   const handleDeleteResume = async (resume) => {

//     // ---------------------------------------------------------
//     // GET RESUME ID
//     // ---------------------------------------------------------

//     const resumeId =
//       resume?.resumeId ??
//       resume?.id;


//     // ---------------------------------------------------------
//     // SAFETY CHECK
//     // ---------------------------------------------------------

//     if (
//       resumeId === undefined ||
//       resumeId === null ||
//       resumeId === ""
//     ) {

//       alert(
//         "Unable to delete this resume because its ID is missing."
//       );

//       return;
//     }


//     // ---------------------------------------------------------
//     // RESUME NAME
//     // ---------------------------------------------------------

//     const resumeName =
//       resume?.originalFileName ||
//       "this resume";


//     // ---------------------------------------------------------
//     // CONFIRMATION
//     // ---------------------------------------------------------

//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete "${resumeName}"?\n\n` +
//         `This will permanently delete the resume and its view analytics.\n\n` +
//         `This action cannot be undone.`
//       );


//     if (!confirmed) {

//       return;
//     }


//     // ---------------------------------------------------------
//     // PREVENT DOUBLE DELETE
//     // ---------------------------------------------------------

//     if (
//       deletingResumeId !== null
//     ) {

//       return;
//     }


//     setDeletingResumeId(
//       resumeId
//     );


//     // ---------------------------------------------------------
//     // TOKEN
//     // ---------------------------------------------------------

//     const token =
//       localStorage.getItem("token");


//     if (!token) {

//       setDeletingResumeId(null);

//       alert(
//         "Your session has expired. Please login again."
//       );

//       return;
//     }


//     // ---------------------------------------------------------
//     // DELETE REQUEST
//     // ---------------------------------------------------------

//     try {

//       console.log(
//         "Deleting resume:",
//         resumeId
//       );


//       const response =
//         await fetch(
//           DELETE_RESUME_URL(resumeId),
//           {
//             method: "DELETE",

//             headers: {
//               Authorization:
//                 `Bearer ${token}`,

//               Accept:
//                 "application/json",
//             },
//           }
//         );


//       // -------------------------------------------------------
//       // AUTH ERROR
//       // -------------------------------------------------------

//       if (
//         response.status === 401 ||
//         response.status === 403
//       ) {

//         localStorage.removeItem(
//           "token"
//         );

//         throw new Error(
//           "Your session has expired. Please login again."
//         );
//       }


//       // -------------------------------------------------------
//       // NOT FOUND
//       // -------------------------------------------------------

//       if (response.status === 404) {

//         throw new Error(
//           "Resume was not found. It may already have been deleted."
//         );
//       }


//       // -------------------------------------------------------
//       // SERVER ERROR
//       // -------------------------------------------------------

//       if (!response.ok) {

//         let message =
//           "Unable to delete the resume.";


//         try {

//           const data =
//             await response.json();

//           message =
//             data?.message ||
//             data?.error ||
//             message;

//         } catch {

//           // Ignore invalid JSON.
//         }


//         throw new Error(
//           message
//         );
//       }


//       // -------------------------------------------------------
//       // SUCCESS
//       // -------------------------------------------------------

//       console.log(
//         "Resume deleted successfully:",
//         resumeId
//       );


//       // -------------------------------------------------------
//       // REMOVE IT IMMEDIATELY FROM UI
//       // -------------------------------------------------------

//       setDashboard((previousDashboard) => {

//         if (!previousDashboard) {

//           return previousDashboard;
//         }


//         const previousResumes =
//           Array.isArray(
//             previousDashboard.resumes
//           )
//             ? previousDashboard.resumes
//             : [];


//         const updatedResumes =
//           previousResumes.filter(
//             (item) =>
//               String(
//                 item?.resumeId ??
//                 item?.id
//               ) !==
//               String(resumeId)
//           );


//         // -----------------------------------------------------
//         // RECALCULATE ANALYTICS
//         // -----------------------------------------------------

//         const totalViews =
//           updatedResumes.reduce(
//             (total, item) =>
//               total +
//               Number(
//                 item?.totalViews || 0
//               ),
//             0
//           );


//         const todayViews =
//           updatedResumes.reduce(
//             (total, item) =>
//               total +
//               Number(
//                 item?.todayViews || 0
//               ),
//             0
//           );


//         const weekViews =
//           updatedResumes.reduce(
//             (total, item) =>
//               total +
//               Number(
//                 item?.weekViews || 0
//               ),
//             0
//           );


//         const monthViews =
//           updatedResumes.reduce(
//             (total, item) =>
//               total +
//               Number(
//                 item?.monthViews || 0
//               ),
//             0
//           );


//         return {
//           ...previousDashboard,

//           resumes:
//             updatedResumes,

//           resumeCount:
//             updatedResumes.length,

//           totalResumes:
//             updatedResumes.length,

//           totalViews,

//           todayViews,

//           weekViews,

//           monthViews,

//           hasResume:
//             updatedResumes.length > 0,
//         };
//       });


//       // -------------------------------------------------------
//       // REFRESH FROM BACKEND
//       // -------------------------------------------------------

//       await loadDashboard(true);


//       // -------------------------------------------------------
//       // SUCCESS MESSAGE
//       // -------------------------------------------------------

//       console.log(
//         "Dashboard refreshed after delete."
//       );

//     } catch (err) {

//       console.error(
//         "Delete resume error:",
//         err
//       );


//       alert(
//         err?.message ||
//         "Unable to delete the resume."
//       );

//     } finally {

//       setDeletingResumeId(
//         null
//       );
//     }
//   };


//   // ===========================================================
//   // LOADING
//   // ===========================================================

//   if (loading) {

//     return (

//       <main className="dashboard dashboard-state">

//         <div className="dashboard-loader">

//           <div className="loader-spinner"></div>

//           <h3>
//             Loading dashboard...
//           </h3>

//           <p>
//             Loading your resume performance.
//           </p>

//         </div>

//       </main>
//     );
//   }


//   // ===========================================================
//   // ERROR
//   // ===========================================================

//   if (error) {

//     return (

//       <main className="dashboard dashboard-state">

//         <div className="dashboard-error-card">

//           <div className="error-icon">
//             !
//           </div>

//           <h3>
//             Unable to load dashboard
//           </h3>

//           <p>
//             {error}
//           </p>

//           <button
//             type="button"
//             className="retry-button"
//             onClick={() =>
//               loadDashboard()
//             }
//           >
//             Try Again
//           </button>

//         </div>

//       </main>
//     );
//   }


//   // ===========================================================
//   // BASIC DATA
//   // ===========================================================

//   const resumes =
//     Array.isArray(
//       dashboard?.resumes
//     )
//       ? dashboard.resumes
//       : [];


//   const email =
//     dashboard?.email ||
//     "-";


//   // ===========================================================
//   // SORT RESUMES
//   // ===========================================================

//   const sortedResumes =
//     [...resumes].sort(
//       (a, b) => {

//         const dateA =
//           a?.uploadedAt
//             ? new Date(
//                 a.uploadedAt
//               ).getTime()
//             : 0;


//         const dateB =
//           b?.uploadedAt
//             ? new Date(
//                 b.uploadedAt
//               ).getTime()
//             : 0;


//         return dateB - dateA;
//       }
//     );


//   // ===========================================================
//   // CALCULATED ANALYTICS
//   // ===========================================================

//   const calculatedTotalViews =
//     resumes.reduce(
//       (total, resume) =>
//         total +
//         Number(
//           resume?.totalViews || 0
//         ),
//       0
//     );


//   const calculatedTodayViews =
//     resumes.reduce(
//       (total, resume) =>
//         total +
//         Number(
//           resume?.todayViews || 0
//         ),
//       0
//     );


//   const calculatedWeekViews =
//     resumes.reduce(
//       (total, resume) =>
//         total +
//         Number(
//           resume?.weekViews || 0
//         ),
//       0
//     );


//   const calculatedMonthViews =
//     resumes.reduce(
//       (total, resume) =>
//         total +
//         Number(
//           resume?.monthViews || 0
//         ),
//       0
//     );


//   // ===========================================================
//   // TOTAL VIEWS
//   // ===========================================================

//   const totalViews =
//     dashboard?.totalViews !==
//       undefined &&
//     dashboard?.totalViews !==
//       null
//       ? Number(
//           dashboard.totalViews
//         )
//       : calculatedTotalViews;


//   // ===========================================================
//   // TODAY VIEWS
//   // ===========================================================

//   const todayViews =
//     dashboard?.todayViews !==
//       undefined &&
//     dashboard?.todayViews !==
//       null
//       ? Number(
//           dashboard.todayViews
//         )
//       : calculatedTodayViews;


//   // ===========================================================
//   // WEEK VIEWS
//   // ===========================================================

//   const weekViews =
//     dashboard?.weekViews !==
//       undefined &&
//     dashboard?.weekViews !==
//       null
//       ? Number(
//           dashboard.weekViews
//         )
//       : calculatedWeekViews;


//   // ===========================================================
//   // MONTH VIEWS
//   // ===========================================================

//   const monthViews =
//     dashboard?.monthViews !==
//       undefined &&
//     dashboard?.monthViews !==
//       null
//       ? Number(
//           dashboard.monthViews
//         )
//       : calculatedMonthViews;


//   // ===========================================================
//   // TOTAL RESUMES
//   // ===========================================================

//   const totalResumes =
//     dashboard?.totalResumes !==
//       undefined &&
//     dashboard?.totalResumes !==
//       null
//       ? Number(
//           dashboard.totalResumes
//         )
//       : resumes.length;


//   // ===========================================================
//   // LATEST RESUME
//   // ===========================================================

//   const latestResume =
//     sortedResumes[0] ||
//     dashboard?.currentResume ||
//     dashboard?.latestResume ||
//     null;


//   // ===========================================================
//   // PUBLIC URL
//   // ===========================================================

//   const publicResumeUrl =
//     latestResume?.resumeSlug
//       ? `${API_BASE_URL}/r/${latestResume.resumeSlug}`
//       : "";


//   // ===========================================================
//   // COPY LINK
//   // ===========================================================

//   const handleCopyLink =
//     async () => {

//       if (!publicResumeUrl) {

//         return;
//       }


//       try {

//         await navigator.clipboard.writeText(
//           publicResumeUrl
//         );


//         setCopied(true);


//         setTimeout(
//           () => {

//             setCopied(false);

//           },
//           2000
//         );

//       } catch (err) {

//         console.error(
//           "Unable to copy link:",
//           err
//         );


//         // Fallback for browsers where
//         // navigator.clipboard is unavailable.

//         try {

//           const textArea =
//             document.createElement(
//               "textarea"
//             );


//           textArea.value =
//             publicResumeUrl;


//           document.body.appendChild(
//             textArea
//           );


//           textArea.select();


//           document.execCommand(
//             "copy"
//           );


//           document.body.removeChild(
//             textArea
//           );


//           setCopied(true);


//           setTimeout(
//             () => {

//               setCopied(false);

//             },
//             2000
//           );

//         } catch (fallbackError) {

//           console.error(
//             "Copy fallback failed:",
//             fallbackError
//           );

//         }
//       }
//     };


//   // ===========================================================
//   // DATE FORMAT
//   // ===========================================================

//   const formatDate =
//     (date) => {

//       if (!date) {

//         return "-";
//       }


//       const parsedDate =
//         new Date(date);


//       if (
//         Number.isNaN(
//           parsedDate.getTime()
//         )
//       ) {

//         return "-";
//       }


//       return parsedDate.toLocaleString();
//     };


//   // ===========================================================
//   // RENDER
//   // ===========================================================

//   return (

//     <main className="dashboard">

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <header className="dashboard-page-header">

//         <div className="dashboard-page-header-content">

//           <span className="dashboard-eyebrow">
//             OVERVIEW
//           </span>

//           <h1>
//             Dashboard
//           </h1>

//           <p>
//             See the overall performance of all your
//             uploaded resumes in one place.
//           </p>

//         </div>


//         <button
//           type="button"
//           className="refresh-button"
//           onClick={handleRefresh}
//           disabled={refreshing}
//         >

//           <span className="refresh-icon">
//             ↻
//           </span>

//           {refreshing
//             ? "Refreshing..."
//             : "Refresh"}

//         </button>

//       </header>


//       {/* =====================================================
//           WELCOME
//       ===================================================== */}

//       <section className="welcome-banner">

//         <div className="welcome-content">

//           <span className="welcome-label">
//             RESUME PERFORMANCE
//           </span>

//           <h2>

//             Welcome back
//             {dashboard?.name
//               ? `, ${dashboard.name}`
//               : ""}

//             <span className="welcome-wave">
//               {" "}👋
//             </span>

//           </h2>

//           <p>
//             Here's how all your resumes are
//             performing overall.
//           </p>

//         </div>


//         <div className="welcome-decoration">

//           <div className="decoration-circle circle-a" />

//           <div className="decoration-circle circle-b" />

//           <div className="decoration-grid" />

//         </div>

//       </section>


//       {/* =====================================================
//           OVERALL ANALYTICS
//       ===================================================== */}

//       <section className="dashboard-section">

//         <div className="section-heading">

//           <div>

//             <span className="section-overline">
//               ALL RESUMES
//             </span>

//             <h2>
//               Overall Resume Analytics
//             </h2>

//             <p>
//               These numbers combine views from
//               all uploaded resumes.
//             </p>

//           </div>


//           <div className="resume-count-badge">

//             <span className="resume-count-dot" />

//             {totalResumes}{" "}

//             {totalResumes === 1
//               ? "Resume"
//               : "Resumes"}

//           </div>

//         </div>


//         <div className="stats-grid">

//           {/* TOTAL */}

//           <div className="stat-card stat-card-primary">

//             <div className="stat-card-top">

//               <div className="stat-icon">
//                 👁
//               </div>

//             </div>


//             <div className="stat-card-content">

//               <p className="stat-title">
//                 Total Views
//               </p>

//               <h3 className="stat-value">
//                 {totalViews}
//               </h3>

//               <p className="stat-subtitle">
//                 Combined across all resumes
//               </p>

//             </div>

//           </div>


//           {/* TODAY */}

//           <div className="stat-card stat-card-blue">

//             <div className="stat-card-top">

//               <div className="stat-icon">
//                 ◷
//               </div>

//             </div>


//             <div className="stat-card-content">

//               <p className="stat-title">
//                 Today
//               </p>

//               <h3 className="stat-value">
//                 {todayViews}
//               </h3>

//               <p className="stat-subtitle">
//                 All resumes today
//               </p>

//             </div>

//           </div>


//           {/* WEEK */}

//           <div className="stat-card stat-card-green">

//             <div className="stat-card-top">

//               <div className="stat-icon">
//                 ↗
//               </div>

//             </div>


//             <div className="stat-card-content">

//               <p className="stat-title">
//                 This Week
//               </p>

//               <h3 className="stat-value">
//                 {weekViews}
//               </h3>

//               <p className="stat-subtitle">
//                 All resumes this week
//               </p>

//             </div>

//           </div>


//           {/* MONTH */}

//           <div className="stat-card stat-card-purple">

//             <div className="stat-card-top">

//               <div className="stat-icon">
//                 ▣
//               </div>

//             </div>


//             <div className="stat-card-content">

//               <p className="stat-title">
//                 This Month
//               </p>

//               <h3 className="stat-value">
//                 {monthViews}
//               </h3>

//               <p className="stat-subtitle">
//                 All resumes this month
//               </p>

//             </div>

//           </div>

//         </div>

//       </section>


//       {/* =====================================================
//           LATEST RESUME
//       ===================================================== */}

//       <section className="dashboard-section">

//         <div className="section-heading">

//           <div>

//             <span className="section-overline">
//               LATEST UPLOAD
//             </span>

//             <h2>
//               Latest Resume
//             </h2>

//             <p>
//               Your most recently uploaded resume.
//             </p>

//           </div>

//         </div>


//         <div className="overview-grid">

//           {/* =================================================
//               RESUME DETAILS
//           ================================================= */}

//           <article className="overview-card">

//             <div className="overview-card-header">

//               <div className="overview-icon">
//                 📄
//               </div>

//               <div>

//                 <h3>
//                   Resume Details
//                 </h3>

//                 <span>
//                   Most recently uploaded
//                 </span>

//               </div>

//             </div>


//             {latestResume ? (

//               <div className="current-resume-content">

//                 <div className="current-resume-file">

//                   <div className="current-resume-pdf">
//                     PDF
//                   </div>


//                   <div className="current-resume-file-info">

//                     <strong
//                       title={
//                         latestResume.originalFileName ||
//                         "Unnamed Resume"
//                       }
//                     >
//                       {latestResume.originalFileName ||
//                         "Unnamed Resume"}
//                     </strong>

//                     <span>
//                       PDF Document
//                     </span>

//                   </div>

//                 </div>


//                 <div className="overview-details">

//                   <div className="overview-row">

//                     <span>
//                       Resume ID
//                     </span>

//                     <strong>
//                       {latestResume.resumeId ||
//                         latestResume.id ||
//                         "-"}
//                     </strong>

//                   </div>


//                   <div className="overview-row">

//                     <span>
//                       Email
//                     </span>

//                     <strong>
//                       {email}
//                     </strong>

//                   </div>


//                   <div className="overview-row">

//                     <span>
//                       Views
//                     </span>

//                     <strong>
//                       {latestResume.totalViews ??
//                         0}
//                     </strong>

//                   </div>


//                   <div className="overview-row">

//                     <span>
//                       Uploaded
//                     </span>

//                     <strong>
//                       {formatDate(
//                         latestResume.uploadedAt
//                       )}
//                     </strong>

//                   </div>

//                 </div>

//               </div>

//             ) : (

//               <div className="overview-empty">

//                 <div className="overview-empty-icon">
//                   📄
//                 </div>

//                 <h3>
//                   No resume uploaded
//                 </h3>

//                 <p>
//                   Upload a resume to start
//                   tracking performance.
//                 </p>

//               </div>

//             )}

//           </article>


//           {/* =================================================
//               PUBLIC LINK
//           ================================================= */}

//           <article className="overview-card public-card">

//             <div className="overview-card-header">

//               <div className="overview-icon public-overview-icon">
//                 🔗
//               </div>

//               <div>

//                 <h3>
//                   Public Resume Link
//                 </h3>

//                 <span>
//                   Latest uploaded resume
//                 </span>

//               </div>

//             </div>


//             {publicResumeUrl ? (

//               <>

//                 <p className="public-description">
//                   Share your latest resume with
//                   recruiters and employers.
//                 </p>


//                 <div className="public-link-box">

//                   <div className="public-link-content">

//                     <span className="public-link-label">
//                       PUBLIC LINK
//                     </span>

//                     <a
//                       href={publicResumeUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="public-link-text"
//                     >
//                       {publicResumeUrl}
//                     </a>

//                   </div>


//                   <button
//                     type="button"
//                     className="public-copy-button"
//                     onClick={handleCopyLink}
//                   >
//                     {copied
//                       ? "Copied!"
//                       : "Copy"}
//                   </button>

//                 </div>


//                 <p className="public-link-help">
//                   Anyone with this link can view
//                   your public resume.
//                 </p>

//               </>

//             ) : (

//               <div className="overview-empty public-empty">

//                 <div className="overview-empty-icon">
//                   🔗
//                 </div>

//                 <h3>
//                   No public link
//                 </h3>

//                 <p>
//                   Upload a resume to generate
//                   your public sharing link.
//                 </p>

//               </div>

//             )}

//           </article>

//         </div>

//       </section>


//       {/* =====================================================
//           RESUME PERFORMANCE
//       ===================================================== */}

//       {resumes.length > 0 && (

//         <section className="dashboard-section">

//           <div className="section-heading">

//             <div>

//               <span className="section-overline">
//                 RESUME BREAKDOWN
//               </span>

//               <h2>
//                 Resume Performance
//               </h2>

//               <p>
//                 Performance of each uploaded resume
//                 separately.
//               </p>

//             </div>

//           </div>


//           <div className="resume-summary-list">

//             {sortedResumes.map(
//               (resume, index) => {

//                 const resumeName =
//                   resume?.originalFileName ||
//                   "Unnamed Resume";


//                 const resumeId =
//                   resume?.resumeId ??
//                   resume?.id;


//                 const isDeleting =
//                   deletingResumeId !== null &&
//                   String(
//                     deletingResumeId
//                   ) ===
//                   String(resumeId);


//                 return (

//                   <div
//                     className="resume-summary-item"
//                     key={
//                       resume?.id ||
//                       resume?.resumeSlug ||
//                       `${resumeName}-${index}`
//                     }
//                   >

//                     {/* =======================================
//                         LEFT SIDE
//                     ======================================= */}

//                     <div className="resume-summary-left">

//                       <div className="resume-summary-icon">
//                         PDF
//                       </div>


//                       <div className="resume-summary-info">

//                         <strong
//                           title={resumeName}
//                         >
//                           {resumeName}
//                         </strong>


//                         <span>
//                           Resume ID:{" "}
//                           {resumeId ?? "-"}
//                         </span>

//                       </div>

//                     </div>


//                     {/* =======================================
//                         STATS
//                     ======================================= */}

//                     <div className="resume-summary-stats">

//                       <div>

//                         <span>
//                           Total
//                         </span>

//                         <strong>
//                           {resume?.totalViews ??
//                             0}
//                         </strong>

//                       </div>


//                       <div>

//                         <span>
//                           Today
//                         </span>

//                         <strong>
//                           {resume?.todayViews ??
//                             0}
//                         </strong>

//                       </div>


//                       <div>

//                         <span>
//                           Week
//                         </span>

//                         <strong>
//                           {resume?.weekViews ??
//                             0}
//                         </strong>

//                       </div>


//                       <div>

//                         <span>
//                           Month
//                         </span>

//                         <strong>
//                           {resume?.monthViews ??
//                             0}
//                         </strong>

//                       </div>

//                     </div>


//                     {/* =======================================
//                         DELETE BUTTON
//                     ======================================= */}

//                     <div className="resume-summary-actions">

//                       <button
//                         type="button"
//                         className="delete-resume-button"
//                         onClick={() =>
//                           handleDeleteResume(
//                             resume
//                           )
//                         }
//                         disabled={
//                           deletingResumeId !== null
//                         }
//                         title="Delete this resume"
//                       >

//                         {isDeleting
//                           ? "Deleting..."
//                           : "Delete"}

//                       </button>

//                     </div>

//                   </div>
//                 );
//               }
//             )}

//           </div>

//         </section>

//       )}


//       {/* =====================================================
//           NO RESUMES
//       ===================================================== */}

//       {resumes.length === 0 && (

//         <section className="dashboard-section">

//           <div className="overview-empty">

//             <div className="overview-empty-icon">
//               📄
//             </div>

//             <h3>
//               No resumes available
//             </h3>

//             <p>
//               Upload a resume to start
//               tracking your resume performance.
//             </p>

//           </div>

//         </section>

//       )}

//     </main>
//   );
// }


// export default Dashboard;



import { useCallback, useEffect, useState } from "react";
import "./Dashboard.css";

/*
 * API BASE URL
 *
 * Local development:
 *   VITE_API_URL=http://localhost:8080
 *
 * Production/Vercel:
 *   VITE_API_URL=https://resumetracker-b3a2.onrender.com
 *
 * IMPORTANT:
 * Do NOT hardcode localhost here.
 */
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");


/*
 * DELETE API URL
 *
 * DELETE /api/resumes/{resumeId}
 */
const DELETE_RESUME_URL = (resumeId) =>
  `${API_BASE_URL}/api/resumes/${resumeId}`;


function Dashboard() {

  // ===========================================================
  // STATE
  // ===========================================================

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  const [deletingResumeId, setDeletingResumeId] =
    useState(null);


  // ===========================================================
  // LOAD DASHBOARD
  // ===========================================================

  const loadDashboard = useCallback(
    async (isRefresh = false) => {

      const token =
        localStorage.getItem("token");


      // -------------------------------------------------------
      // TOKEN CHECK
      // -------------------------------------------------------

      if (!token) {

        setError(
          "Please login again."
        );

        setLoading(false);

        return;
      }


      // -------------------------------------------------------
      // LOADING STATE
      // -------------------------------------------------------

      if (isRefresh) {

        setRefreshing(true);

      } else {

        setLoading(true);
      }


      setError("");


      // -------------------------------------------------------
      // API REQUEST
      // -------------------------------------------------------

      try {

        console.log(
          "Loading dashboard from:",
          `${API_BASE_URL}/api/dashboard`
        );


        const response =
          await fetch(
            `${API_BASE_URL}/api/dashboard`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                Accept:
                  "application/json",
              },
            }
          );


        // -----------------------------------------------------
        // AUTH ERROR
        // -----------------------------------------------------

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


        // -----------------------------------------------------
        // SERVER ERROR
        // -----------------------------------------------------

        if (!response.ok) {

          let message =
            "Unable to load dashboard.";


          try {

            const data =
              await response.json();

            message =
              data?.message ||
              data?.error ||
              message;

          } catch {
            // Ignore invalid JSON.
          }


          throw new Error(
            message
          );
        }


        // -----------------------------------------------------
        // SUCCESS
        // -----------------------------------------------------

        const data =
          await response.json();


        console.log(
          "Dashboard data:",
          data
        );


        setDashboard(data);

      } catch (err) {

        console.error(
          "Dashboard loading error:",
          err
        );


        setError(
          err?.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

        setRefreshing(false);
      }
    },
    []
  );


  // ===========================================================
  // LOAD DASHBOARD WHEN COMPONENT OPENS
  // ===========================================================

  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  // ===========================================================
  // REFRESH
  // ===========================================================

  const handleRefresh = () => {

    loadDashboard(true);
  };


  // ===========================================================
  // DELETE RESUME
  // ===========================================================

  const handleDeleteResume = async (resume) => {

    const resumeId =
      resume?.resumeId ??
      resume?.id;


    if (
      resumeId === undefined ||
      resumeId === null ||
      resumeId === ""
    ) {

      alert(
        "Unable to delete this resume because its ID is missing."
      );

      return;
    }


    const resumeName =
      resume?.originalFileName ||
      "this resume";


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${resumeName}"?\n\n` +
        `This will permanently delete the resume and its view analytics.\n\n` +
        `This action cannot be undone.`
      );


    if (!confirmed) {

      return;
    }


    if (
      deletingResumeId !== null
    ) {

      return;
    }


    setDeletingResumeId(
      resumeId
    );


    const token =
      localStorage.getItem("token");


    if (!token) {

      setDeletingResumeId(null);

      alert(
        "Your session has expired. Please login again."
      );

      return;
    }


    try {

      console.log(
        "Deleting resume:",
        resumeId
      );


      const response =
        await fetch(
          DELETE_RESUME_URL(resumeId),
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


      // -------------------------------------------------------
      // AUTH ERROR
      // -------------------------------------------------------

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


      // -------------------------------------------------------
      // NOT FOUND
      // -------------------------------------------------------

      if (response.status === 404) {

        throw new Error(
          "Resume was not found. It may already have been deleted."
        );
      }


      // -------------------------------------------------------
      // SERVER ERROR
      // -------------------------------------------------------

      if (!response.ok) {

        let message =
          "Unable to delete the resume.";


        try {

          const data =
            await response.json();

          message =
            data?.message ||
            data?.error ||
            message;

        } catch {
          // Ignore invalid JSON.
        }


        throw new Error(
          message
        );
      }


      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      console.log(
        "Resume deleted successfully:",
        resumeId
      );


      // -------------------------------------------------------
      // REMOVE FROM UI
      // -------------------------------------------------------

      setDashboard((previousDashboard) => {

        if (!previousDashboard) {

          return previousDashboard;
        }


        const previousResumes =
          Array.isArray(
            previousDashboard.resumes
          )
            ? previousDashboard.resumes
            : [];


        const updatedResumes =
          previousResumes.filter(
            (item) =>
              String(
                item?.resumeId ??
                item?.id
              ) !==
              String(resumeId)
          );


        // -----------------------------------------------------
        // RECALCULATE ANALYTICS
        // -----------------------------------------------------

        const totalViews =
          updatedResumes.reduce(
            (total, item) =>
              total +
              Number(
                item?.totalViews || 0
              ),
            0
          );


        const todayViews =
          updatedResumes.reduce(
            (total, item) =>
              total +
              Number(
                item?.todayViews || 0
              ),
            0
          );


        const weekViews =
          updatedResumes.reduce(
            (total, item) =>
              total +
              Number(
                item?.weekViews || 0
              ),
            0
          );


        const monthViews =
          updatedResumes.reduce(
            (total, item) =>
              total +
              Number(
                item?.monthViews || 0
              ),
            0
          );


        return {
          ...previousDashboard,

          resumes:
            updatedResumes,

          resumeCount:
            updatedResumes.length,

          totalResumes:
            updatedResumes.length,

          totalViews,

          todayViews,

          weekViews,

          monthViews,

          hasResume:
            updatedResumes.length > 0,
        };
      });


      // -------------------------------------------------------
      // REFRESH FROM BACKEND
      // -------------------------------------------------------

      await loadDashboard(true);


      console.log(
        "Dashboard refreshed after delete."
      );

    } catch (err) {

      console.error(
        "Delete resume error:",
        err
      );


      alert(
        err?.message ||
        "Unable to delete the resume."
      );

    } finally {

      setDeletingResumeId(
        null
      );
    }
  };


  // ===========================================================
  // LOADING
  // ===========================================================

  if (loading) {

    return (

      <main className="dashboard dashboard-state">

        <div className="dashboard-loader">

          <div className="loader-spinner"></div>

          <h3>
            Loading dashboard...
          </h3>

          <p>
            Loading your resume performance.
          </p>

        </div>

      </main>
    );
  }


  // ===========================================================
  // ERROR
  // ===========================================================

  if (error) {

    return (

      <main className="dashboard dashboard-state">

        <div className="dashboard-error-card">

          <div className="error-icon">
            !
          </div>

          <h3>
            Unable to load dashboard
          </h3>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() =>
              loadDashboard()
            }
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }


  // ===========================================================
  // BASIC DATA
  // ===========================================================

  const resumes =
    Array.isArray(
      dashboard?.resumes
    )
      ? dashboard.resumes
      : [];


  const email =
    dashboard?.email ||
    "-";


  // ===========================================================
  // SORT RESUMES
  // ===========================================================

  const sortedResumes =
    [...resumes].sort(
      (a, b) => {

        const dateA =
          a?.uploadedAt
            ? new Date(
                a.uploadedAt
              ).getTime()
            : 0;


        const dateB =
          b?.uploadedAt
            ? new Date(
                b.uploadedAt
              ).getTime()
            : 0;


        return dateB - dateA;
      }
    );


  // ===========================================================
  // CALCULATED ANALYTICS
  // ===========================================================

  const calculatedTotalViews =
    resumes.reduce(
      (total, resume) =>
        total +
        Number(
          resume?.totalViews || 0
        ),
      0
    );


  const calculatedTodayViews =
    resumes.reduce(
      (total, resume) =>
        total +
        Number(
          resume?.todayViews || 0
        ),
      0
    );


  const calculatedWeekViews =
    resumes.reduce(
      (total, resume) =>
        total +
        Number(
          resume?.weekViews || 0
        ),
      0
    );


  const calculatedMonthViews =
    resumes.reduce(
      (total, resume) =>
        total +
        Number(
          resume?.monthViews || 0
        ),
      0
    );


  // ===========================================================
  // TOTAL VIEWS
  // ===========================================================

  const totalViews =
    dashboard?.totalViews !== undefined &&
    dashboard?.totalViews !== null
      ? Number(
          dashboard.totalViews
        )
      : calculatedTotalViews;


  // ===========================================================
  // TODAY VIEWS
  // ===========================================================

  const todayViews =
    dashboard?.todayViews !== undefined &&
    dashboard?.todayViews !== null
      ? Number(
          dashboard.todayViews
        )
      : calculatedTodayViews;


  // ===========================================================
  // WEEK VIEWS
  // ===========================================================

  const weekViews =
    dashboard?.weekViews !== undefined &&
    dashboard?.weekViews !== null
      ? Number(
          dashboard.weekViews
        )
      : calculatedWeekViews;


  // ===========================================================
  // MONTH VIEWS
  // ===========================================================

  const monthViews =
    dashboard?.monthViews !== undefined &&
    dashboard?.monthViews !== null
      ? Number(
          dashboard.monthViews
        )
      : calculatedMonthViews;


  // ===========================================================
  // TOTAL RESUMES
  // ===========================================================

  const totalResumes =
    dashboard?.totalResumes !== undefined &&
    dashboard?.totalResumes !== null
      ? Number(
          dashboard.totalResumes
        )
      : resumes.length;


  // ===========================================================
  // LATEST RESUME
  // ===========================================================

  const latestResume =
    sortedResumes[0] ||
    dashboard?.currentResume ||
    dashboard?.latestResume ||
    null;


  // ===========================================================
  // PUBLIC URL
  // ===========================================================

  const publicResumeUrl =
    latestResume?.resumeSlug
      ? `${API_BASE_URL}/r/${latestResume.resumeSlug}`
      : "";


  // ===========================================================
  // COPY LINK
  // ===========================================================

  const handleCopyLink =
    async () => {

      if (!publicResumeUrl) {

        return;
      }


      try {

        await navigator.clipboard.writeText(
          publicResumeUrl
        );


        setCopied(true);


        setTimeout(
          () => {

            setCopied(false);

          },
          2000
        );

      } catch (err) {

        console.error(
          "Unable to copy link:",
          err
        );


        try {

          const textArea =
            document.createElement(
              "textarea"
            );


          textArea.value =
            publicResumeUrl;


          document.body.appendChild(
            textArea
          );


          textArea.select();


          document.execCommand(
            "copy"
          );


          document.body.removeChild(
            textArea
          );


          setCopied(true);


          setTimeout(
            () => {

              setCopied(false);

            },
            2000
          );

        } catch (fallbackError) {

          console.error(
            "Copy fallback failed:",
            fallbackError
          );

        }
      }
    };


  // ===========================================================
  // DATE FORMAT
  // ===========================================================

  const formatDate =
    (date) => {

      if (!date) {

        return "-";
      }


      const parsedDate =
        new Date(date);


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {

        return "-";
      }


      return parsedDate.toLocaleString();
    };


  // ===========================================================
  // RENDER
  // ===========================================================

  return (

    <main className="dashboard">

      <header className="dashboard-page-header">

        <div className="dashboard-page-header-content">

          <span className="dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            See the overall performance of all your
            uploaded resumes in one place.
          </p>

        </div>


        <button
          type="button"
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >

          <span className="refresh-icon">
            ↻
          </span>

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </header>


      <section className="welcome-banner">

        <div className="welcome-content">

          <span className="welcome-label">
            RESUME PERFORMANCE
          </span>

          <h2>

            Welcome back
            {dashboard?.name
              ? `, ${dashboard.name}`
              : ""}

            <span className="welcome-wave">
              {" "}👋
            </span>

          </h2>

          <p>
            Here's how all your resumes are
            performing overall.
          </p>

        </div>


        <div className="welcome-decoration">

          <div className="decoration-circle circle-a" />

          <div className="decoration-circle circle-b" />

          <div className="decoration-grid" />

        </div>

      </section>


      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-overline">
              ALL RESUMES
            </span>

            <h2>
              Overall Resume Analytics
            </h2>

            <p>
              These numbers combine views from
              all uploaded resumes.
            </p>

          </div>


          <div className="resume-count-badge">

            <span className="resume-count-dot" />

            {totalResumes}{" "}

            {totalResumes === 1
              ? "Resume"
              : "Resumes"}

          </div>

        </div>


        <div className="stats-grid">

          <div className="stat-card stat-card-primary">

            <div className="stat-card-top">

              <div className="stat-icon">
                👁
              </div>

            </div>


            <div className="stat-card-content">

              <p className="stat-title">
                Total Views
              </p>

              <h3 className="stat-value">
                {totalViews}
              </h3>

              <p className="stat-subtitle">
                Combined across all resumes
              </p>

            </div>

          </div>


          <div className="stat-card stat-card-blue">

            <div className="stat-card-top">

              <div className="stat-icon">
                ◷
              </div>

            </div>


            <div className="stat-card-content">

              <p className="stat-title">
                Today
              </p>

              <h3 className="stat-value">
                {todayViews}
              </h3>

              <p className="stat-subtitle">
                All resumes today
              </p>

            </div>

          </div>


          <div className="stat-card stat-card-green">

            <div className="stat-card-top">

              <div className="stat-icon">
                ↗
              </div>

            </div>


            <div className="stat-card-content">

              <p className="stat-title">
                This Week
              </p>

              <h3 className="stat-value">
                {weekViews}
              </h3>

              <p className="stat-subtitle">
                All resumes this week
              </p>

            </div>

          </div>


          <div className="stat-card stat-card-purple">

            <div className="stat-card-top">

              <div className="stat-icon">
                ▣
              </div>

            </div>


            <div className="stat-card-content">

              <p className="stat-title">
                This Month
              </p>

              <h3 className="stat-value">
                {monthViews}
              </h3>

              <p className="stat-subtitle">
                All resumes this month
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-overline">
              LATEST UPLOAD
            </span>

            <h2>
              Latest Resume
            </h2>

            <p>
              Your most recently uploaded resume.
            </p>

          </div>

        </div>


        <div className="overview-grid">

          <article className="overview-card">

            <div className="overview-card-header">

              <div className="overview-icon">
                📄
              </div>

              <div>

                <h3>
                  Resume Details
                </h3>

                <span>
                  Most recently uploaded
                </span>

              </div>

            </div>


            {latestResume ? (

              <div className="current-resume-content">

                <div className="current-resume-file">

                  <div className="current-resume-pdf">
                    PDF
                  </div>


                  <div className="current-resume-file-info">

                    <strong
                      title={
                        latestResume.originalFileName ||
                        "Unnamed Resume"
                      }
                    >
                      {latestResume.originalFileName ||
                        "Unnamed Resume"}
                    </strong>

                    <span>
                      PDF Document
                    </span>

                  </div>

                </div>


                <div className="overview-details">

                  <div className="overview-row">

                    <span>
                      Resume ID
                    </span>

                    <strong>
                      {latestResume.resumeId ||
                        latestResume.id ||
                        "-"}
                    </strong>

                  </div>


                  <div className="overview-row">

                    <span>
                      Email
                    </span>

                    <strong>
                      {email}
                    </strong>

                  </div>


                  <div className="overview-row">

                    <span>
                      Views
                    </span>

                    <strong>
                      {latestResume.totalViews ??
                        0}
                    </strong>

                  </div>


                  <div className="overview-row">

                    <span>
                      Uploaded
                    </span>

                    <strong>
                      {formatDate(
                        latestResume.uploadedAt
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            ) : (

              <div className="overview-empty">

                <div className="overview-empty-icon">
                  📄
                </div>

                <h3>
                  No resume uploaded
                </h3>

                <p>
                  Upload a resume to start
                  tracking performance.
                </p>

              </div>

            )}

          </article>


          <article className="overview-card public-card">

            <div className="overview-card-header">

              <div className="overview-icon public-overview-icon">
                🔗
              </div>

              <div>

                <h3>
                  Public Resume Link
                </h3>

                <span>
                  Latest uploaded resume
                </span>

              </div>

            </div>


            {publicResumeUrl ? (

              <>

                <p className="public-description">
                  Share your latest resume with
                  recruiters and employers.
                </p>


                <div className="public-link-box">

                  <div className="public-link-content">

                    <span className="public-link-label">
                      PUBLIC LINK
                    </span>

                    <a
                      href={publicResumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="public-link-text"
                    >
                      {publicResumeUrl}
                    </a>

                  </div>


                  <button
                    type="button"
                    className="public-copy-button"
                    onClick={handleCopyLink}
                  >
                    {copied
                      ? "Copied!"
                      : "Copy"}
                  </button>

                </div>


                <p className="public-link-help">
                  Anyone with this link can view
                  your public resume.
                </p>

              </>

            ) : (

              <div className="overview-empty public-empty">

                <div className="overview-empty-icon">
                  🔗
                </div>

                <h3>
                  No public link
                </h3>

                <p>
                  Upload a resume to generate
                  your public sharing link.
                </p>

              </div>

            )}

          </article>

        </div>

      </section>


      {resumes.length > 0 && (

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="section-overline">
                RESUME BREAKDOWN
              </span>

              <h2>
                Resume Performance
              </h2>

              <p>
                Performance of each uploaded resume
                separately.
              </p>

            </div>

          </div>


          <div className="resume-summary-list">

            {sortedResumes.map(
              (resume, index) => {

                const resumeName =
                  resume?.originalFileName ||
                  "Unnamed Resume";


                const resumeId =
                  resume?.resumeId ??
                  resume?.id;


                const isDeleting =
                  deletingResumeId !== null &&
                  String(
                    deletingResumeId
                  ) ===
                  String(resumeId);


                return (

                  <div
                    className="resume-summary-item"
                    key={
                      resume?.id ||
                      resume?.resumeSlug ||
                      `${resumeName}-${index}`
                    }
                  >

                    <div className="resume-summary-left">

                      <div className="resume-summary-icon">
                        PDF
                      </div>


                      <div className="resume-summary-info">

                        <strong
                          title={resumeName}
                        >
                          {resumeName}
                        </strong>


                        <span>
                          Resume ID:{" "}
                          {resumeId ?? "-"}
                        </span>

                      </div>

                    </div>


                    <div className="resume-summary-stats">

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


                    <div className="resume-summary-actions">

                      <button
                        type="button"
                        className="delete-resume-button"
                        onClick={() =>
                          handleDeleteResume(
                            resume
                          )
                        }
                        disabled={
                          deletingResumeId !== null
                        }
                        title="Delete this resume"
                      >

                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>

      )}


      {resumes.length === 0 && (

        <section className="dashboard-section">

          <div className="overview-empty">

            <div className="overview-empty-icon">
              📄
            </div>

            <h3>
              No resumes available
            </h3>

            <p>
              Upload a resume to start
              tracking your resume performance.
            </p>

          </div>

        </section>

      )}

    </main>
  );
}


export default Dashboard;
