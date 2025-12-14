import jwtAxios from "./jwtUtil";
import requests from "./requests";

export const submitServiceRequest = async ({ userId, carNumber, services, additionalRequest }) => {
  const payload = { userId, carNumber, services, additionalRequest };
  const response = await jwtAxios.post(requests.serviceRequest, payload);
  return response.data;
};

export const fetchServiceHistory = async (userId) => {
  const response = await jwtAxios.get(requests.serviceRequest, { params: { userId } });
  return response.data;
};

export const fetchLatestServiceRequest = async (userId) => {
  try {
    const response = await jwtAxios.get(requests.serviceRequestLatest, { params: { userId } });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 204) {
      return null; // No content
    }
    throw error;
  }
};

export const updateServiceStatus = async ({ id, status, service }) => {
  const response = await jwtAxios.post(`${requests.serviceRequest}/${id}/status`, null, {
    params: { status, service },
  });
  return response.data;
};

export const callVehicle = async (workInfoId) => {
  const response = await jwtAxios.post(`${requests.serviceRequest}/${workInfoId}/call`);
  return response.data;
};