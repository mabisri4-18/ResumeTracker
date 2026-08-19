import { useState } from "react";

// =========================================================
// API BASE URL
// =========================================================
//
// Local development:
// VITE_API_BASE_URL=http://localhost:8080
//
// Production:
// VITE_API_BASE_URL=https://resumetracker-b3a2.onrender.com
//
// =========================================================

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080"
).replace(/\/+$/, "");


function DeleteResumeButton({
  resumeId,
  resumeName,
  onDeleted,
}) {

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================================================
  // DELETE RESUME
  // =========================================================

  const handleDelete = async () => {

    // -------------------------------------------------------
    // VALIDATE RESUME ID
    // -------------------------------------------------------

    if (
      resumeId === undefined ||
      resumeId === null ||
      resumeId === ""
    ) {

      setError(
        "Invalid resume ID."
      );

      return;
    }


    // -------------------------------------------------------
    // PREVENT DOUBLE CLICK
    // -------------------------------------------------------

    if (deleting) {

      return;
    }


    // -------------------------------------------------------
    // CONFIRMATION
    // -------------------------------------------------------

    const confirmed =
      window.confirm(

        `Are you sure you want to delete "${resumeName || "this resume"}"?\n\n` +

        "This will permanently delete the resume and its view/analytics history.\n\n" +

        "This action cannot be undone."

      );


    if (!confirmed) {

      return;
    }


    // -------------------------------------------------------
    // GET JWT TOKEN
    // -------------------------------------------------------

    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {

      setError(
        "Your session has expired. Please login again."
      );

      return;
    }


    // =======================================================
    // DELETE REQUEST
    // =======================================================

    try {

      setDeleting(true);

      setError("");


      // -----------------------------------------------------
      // BUILD PRODUCTION API URL
      // -----------------------------------------------------

      const deleteUrl =
        `${API_BASE_URL}/api/resumes/${encodeURIComponent(
          resumeId
        )}`;


      console.log(
        "Deleting resume:",
        deleteUrl
      );


      // -----------------------------------------------------
      // SEND REQUEST
      // -----------------------------------------------------

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


      // -----------------------------------------------------
      // READ RESPONSE
      // -----------------------------------------------------

      let data = null;


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

        try {

          data =
            await response.json();

        } catch {

          data = null;

        }

      } else {

        try {

          const text =
            await response.text();

          if (text) {

            data = {
              message: text,
            };

          }

        } catch {

          data = null;

        }

      }


      // =====================================================
      // AUTH ERROR
      // =====================================================

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


      // =====================================================
      // NOT FOUND
      // =====================================================

      if (
        response.status === 404
      ) {

        throw new Error(
          "Resume was not found. It may already have been deleted."
        );

      }


      // =====================================================
      // OTHER SERVER ERROR
      // =====================================================

      if (!response.ok) {

        throw new Error(

          data?.error ||

          data?.message ||

          "Unable to delete resume."

        );

      }


      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "Resume deleted successfully:",
        resumeId
      );


      // -----------------------------------------------------
      // INFORM PARENT COMPONENT
      // -----------------------------------------------------

      if (
        typeof onDeleted ===
        "function"
      ) {

        onDeleted(
          resumeId
        );

      }


    } catch (err) {

      console.error(
        "Delete resume error:",
        err
      );


      // -----------------------------------------------------
      // NETWORK ERROR
      // -----------------------------------------------------

      if (
        err?.name ===
        "TypeError"
      ) {

        setError(
          "Unable to connect to the server. Please check that the backend is running and CORS is configured correctly."
        );

      } else {

        setError(
          err?.message ||
          "Unable to delete resume."
        );

      }


    } finally {

      setDeleting(false);

    }

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="delete-resume-wrapper">

      <button
        type="button"
        className="delete-resume-button"
        onClick={handleDelete}
        disabled={deleting}
      >

        {deleting
          ? "Deleting..."
          : "Delete"}

      </button>


      {error && (

        <p className="delete-resume-error">

          {error}

        </p>

      )}

    </div>

  );

}


export default DeleteResumeButton;