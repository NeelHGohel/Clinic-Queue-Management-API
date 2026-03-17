import axios from "axios";

export const api = axios.create({
  baseURL: "https://cmsback.sampaarsh.cloud/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((confiq) => {
  const token = localStorage.getItem("token");

  if (token) {
    confiq.headers.Authorization = `Bearer ${token}`;
  }
  return confiq;
});
