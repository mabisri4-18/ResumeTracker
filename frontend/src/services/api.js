// const API_BASE_URL = "http://localhost:8080";


// // =========================================================
// // API REQUEST
// // =========================================================

// export const apiRequest = async (
//   endpoint,
//   options = {}
// ) => {

//   const token =
//     localStorage.getItem("token");


//   // =======================================================
//   // HEADERS
//   // =======================================================

//   const headers = {
//     ...(options.headers || {}),
//   };


//   // =======================================================
//   // JWT AUTHENTICATION
//   // =======================================================

//   if (token) {

//     headers.Authorization =
//       `Bearer ${token}`;

//   }


//   // =======================================================
//   // CONTENT TYPE
//   // =======================================================

//   // Do NOT manually set Content-Type for FormData.
//   // The browser automatically sets the correct
//   // multipart/form-data boundary.

//   if (
//     options.body &&
//     !(options.body instanceof FormData)
//   ) {

//     headers["Content-Type"] =
//       "application/json";

//   }


//   // =======================================================
//   // SEND REQUEST
//   // =======================================================

//   let response;

//   try {

//     response = await fetch(
//       `${API_BASE_URL}${endpoint}`,
//       {
//         ...options,
//         headers,
//       }
//     );

//   } catch (error) {

//     console.error(
//       "API network error:",
//       error
//     );

//     throw new Error(
//       "Unable to connect to the server. Make sure the Spring Boot backend is running."
//     );

//   }


//   // =======================================================
//   // READ RESPONSE
//   // =======================================================

//   let data = null;

//   const contentType =
//     response.headers.get("content-type");


//   if (
//     contentType &&
//     contentType.includes("application/json")
//   ) {

//     try {

//       data = await response.json();

//     } catch {

//       data = null;

//     }

//   } else {

//     try {

//       const text =
//         await response.text();

//       data =
//         text || null;

//     } catch {

//       data = null;

//     }

//   }


//   // =======================================================
//   // HANDLE UNAUTHORIZED
//   // =======================================================

//   if (response.status === 401) {

//     console.error(
//       "API 401 Unauthorized:",
//       endpoint
//     );

//     // Remove invalid/expired token.
//     localStorage.removeItem("token");

//     throw new Error(
//       "Your session has expired. Please login again."
//     );

//   }


//   // =======================================================
//   // HANDLE FORBIDDEN
//   // =======================================================

//   if (response.status === 403) {

//     console.error(
//       "API 403 Forbidden:",
//       endpoint
//     );

//     throw new Error(
//       "You do not have permission to perform this action."
//     );

//   }


//   // =======================================================
//   // HANDLE OTHER ERRORS
//   // =======================================================

//   if (!response.ok) {

//     let message =
//       "Something went wrong.";

//     if (typeof data === "string") {

//       message =
//         data || message;

//     } else if (data) {

//       message =
//         data.message ||
//         data.error ||
//         data.detail ||
//         message;

//     }

//     throw new Error(message);

//   }


//   // =======================================================
//   // SUCCESS
//   // =======================================================

//   return data;

// };


// // =========================================================
// // API BASE URL
// // =========================================================

// export { API_BASE_URL };

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


// =========================================================
// API REQUEST
// =========================================================

export const apiRequest = async (
  endpoint,
  options = {}
) => {

  const token =
    localStorage.getItem("token");


  // =======================================================
  // HEADERS
  // =======================================================

  const headers = {
    ...(options.headers || {}),
  };


  // =======================================================
  // JWT AUTHENTICATION
  // =======================================================

  if (token) {

    headers.Authorization =
      `Bearer ${token}`;

  }


  // =======================================================
  // CONTENT TYPE
  // =======================================================

  // Do NOT manually set Content-Type for FormData.
  // The browser automatically sets the correct
  // multipart/form-data boundary.

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {

    headers["Content-Type"] =
      "application/json";

  }


  // =======================================================
  // SEND REQUEST
  // =======================================================

  let response;

  try {

    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

  } catch (error) {

    console.error(
      "API network error:",
      error
    );

    throw new Error(
      "Unable to connect to the server. Make sure the backend is running."
    );

  }


  // =======================================================
  // READ RESPONSE
  // =======================================================

  let data = null;

  const contentType =
    response.headers.get("content-type");


  if (
    contentType &&
    contentType.includes("application/json")
  ) {

    try {

      data = await response.json();

    } catch {

      data = null;

    }

  } else {

    try {

      const text =
        await response.text();

      data =
        text || null;

    } catch {

      data = null;

    }

  }


  // =======================================================
  // HANDLE UNAUTHORIZED
  // =======================================================

  if (response.status === 401) {

    console.error(
      "API 401 Unauthorized:",
      endpoint
    );

    localStorage.removeItem("token");

    throw new Error(
      "Your session has expired. Please login again."
    );

  }


  // =======================================================
  // HANDLE FORBIDDEN
  // =======================================================

  if (response.status === 403) {

    console.error(
      "API 403 Forbidden:",
      endpoint
    );

    throw new Error(
      "You do not have permission to perform this action."
    );

  }


  // =======================================================
  // HANDLE OTHER ERRORS
  // =======================================================

  if (!response.ok) {

    let message =
      "Something went wrong.";

    if (typeof data === "string") {

      message =
        data || message;

    } else if (data) {

      message =
        data.message ||
        data.error ||
        data.detail ||
        message;

    }

    throw new Error(message);

  }


  // =======================================================
  // SUCCESS
  // =======================================================

  return data;
};


// =========================================================
// API BASE URL
// =========================================================

export { API_BASE_URL };