import { api } from "./api";

export const addPrescription = async (appointmentId, data) => {
  const response = await api.post(`/prescriptions/${appointmentId}`, data);
  return response.data;
};

export const addReport = async (appointmentId, data) => {
  const response = await api.post(`/reports/${appointmentId}`, data);
  return response.data;
};

export const getMyPrescriptions = async () => {
  const response = await api.get("/prescriptions/my");
  return response.data;
};

export const getMyReports = async () => {
  const response = await api.get("/reports/my");
  return response.data;
};
