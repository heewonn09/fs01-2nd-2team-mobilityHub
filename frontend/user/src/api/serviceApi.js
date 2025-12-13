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
  const response = await jwtAxios.get(requests.serviceRequestLatest, { params: { userId } });
  return response.data;
};

export const updateServiceStatus = async ({ id, status, service }) => {
  const response = await jwtAxios.patch(`${requests.serviceRequest}/${id}/status`, null, {
    params: { status, service },
  });
  return response.data;
};
