import { useState } from "react";

const API_BASE_URL = "http://localhost:8080";

function DeleteResumeButton({
  resumeId,
  resumeName,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!resumeId) {
      setError("Invalid resume ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${resumeName || "this resume"}"?\n\n` +
      "This will permanently delete the resume and its view/analytics history."
    );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setError(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/resumes/${resumeId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        // Response may not contain JSON.
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");

        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
          data?.message ||
          "Unable to delete resume."
        );
      }

      console.log(
        "Resume deleted:",
        data
      );

      // Tell parent component that deletion succeeded.
      if (typeof onDeleted === "function") {
        onDeleted(resumeId);
      }

    } catch (err) {

      console.error(
        "Delete resume error:",
        err
      );

      setError(
        err?.message ||
        "Unable to delete resume."
      );

    } finally {
      setDeleting(false);
    }
  };

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