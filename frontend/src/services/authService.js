import { apiRequest } from "./api";

const login = async (username, password) => {
  const data = await apiRequest(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const token =
    data?.token ||
    data?.jwt ||
    data?.accessToken;

  if (!token) {
    throw new Error(
      "Login succeeded, but no JWT token was returned."
    );
  }

  localStorage.setItem(
    "token",
    token
  );

  return data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const getToken = () => {
  return localStorage.getItem("token");
};

const isAuthenticated = () => {
  return Boolean(getToken());
};

export {
  login,
  logout,
  getToken,
  isAuthenticated,
};