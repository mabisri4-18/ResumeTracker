import { useRef, useState } from "react";
import { apiRequest } from "../../services/api";
import "./Resume.css";

function ResumeUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setUploadError("");
    setUploadSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Only PDF files are allowed
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setSelectedFile(null);

      setUploadError(
        "Please select a PDF file."
      );

      event.target.value = "";
      return;
    }

    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);

      setUploadError(
        "File size must be less than 10 MB."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setUploadError("");
    setUploadSuccess("");

    if (!selectedFile) {
      setUploadError(
        "Please select a PDF file first."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setUploadError(
        "Your session has expired. Please login again."
      );
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      // Upload resume through centralized API service
      const data = await apiRequest(
        "/api/resumes/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "Resume upload response:",
        data
      );

      setUploadSuccess(
        "Resume uploaded successfully!"
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Tell parent component to reload resume information
      if (onUploadSuccess) {
        await onUploadSuccess(data);
      }

    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setUploadError(
        error.message ||
          "Unable to upload resume."
      );

    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadError("");
    setUploadSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="resume-upload-card">

      <div className="resume-upload-header">

        <div>

          <span className="section-label">
            UPDATE RESUME
          </span>

          <h2>
            Upload New Resume
          </h2>

          <p>
            Upload your latest resume to keep
            your profile up to date.
          </p>

        </div>

      </div>


      <form
        onSubmit={handleUpload}
        className="resume-upload-form"
      >

        <label
          htmlFor="resume-file"
          className={`upload-dropzone ${
            selectedFile ? "has-file" : ""
          }`}
        >

          <input
            ref={fileInputRef}
            id="resume-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            hidden
          />

          <div className="upload-icon">
            ↑
          </div>

          <div className="upload-text">

            <h3>
              {selectedFile
                ? "Resume selected"
                : "Upload your resume"}
            </h3>

            <p>
              {selectedFile
                ? selectedFile.name
                : "Click to browse or drag and drop your PDF here"}
            </p>

          </div>

          <span className="upload-format">
            PDF • Maximum 10 MB
          </span>

        </label>


        {selectedFile && (

          <div className="selected-file">

            <div className="selected-file-left">

              <div className="selected-file-icon">
                PDF
              </div>

              <div>

                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  {(
                    selectedFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </span>

              </div>

            </div>


            <button
              type="button"
              className="remove-file-button"
              onClick={removeSelectedFile}
              disabled={uploading}
            >
              Remove
            </button>

          </div>

        )}


        {uploadError && (

          <div className="upload-message upload-error">

            <span>
              !
            </span>

            {uploadError}

          </div>

        )}


        {uploadSuccess && (

          <div className="upload-message upload-success">

            <span>
              ✓
            </span>

            {uploadSuccess}

          </div>

        )}


        <button
          type="submit"
          className="upload-button"
          disabled={
            uploading || !selectedFile
          }
        >

          {uploading ? (

            <>
              <span className="button-spinner"></span>
              Uploading...
            </>

          ) : (

            <>
              <span>↑</span>
              Upload Resume
            </>

          )}

        </button>

      </form>

    </section>
  );
}

export default ResumeUpload;