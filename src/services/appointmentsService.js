import { api } from "./api";

export const getMyAppointments = async () => {
  const response = await api.get("/appointments/my");
  return response.data;
};

export const bookAppointment = async (data) => {
  const response = await api.post("/appointments", data);
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};
