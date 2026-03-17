import { api } from "./api";

export const loginService = async (data) => {
  const response = await api.post("/auth/login", data);

  // console.log("Response", response);

  if (!response.data.error) {
    localStorage.setItem("token", response.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(atob(response.data.token.split(".")[1])),
    );
  }
  return response.data;
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUserData = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};
