import { api } from "./api";

export const getQueueByDate = async (date) => {
  const response = await api.get(`/queue?date=${date}`);
  return response.data;
};

export const updateQueueStatus = async (id, status) => {
  const response = await api.patch(`/queue/${id}`, { status });
  return response.data;
};

export const getDoctorQueue = async () => {
  const response = await api.get("/doctor/queue");
  return response.data;
};
