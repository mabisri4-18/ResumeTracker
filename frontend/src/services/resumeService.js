import { apiRequest } from "./api";

const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  return await apiRequest(
    "/api/resumes/upload",
    {
      method: "POST",
      body: formData,
    }
  );
};

export {
  uploadResume,
};