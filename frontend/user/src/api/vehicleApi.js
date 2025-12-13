import jwtAxios from "./jwtUtil";
import requests from "./requests";

export const fetchUserCars = async (userId) => {
  const response = await jwtAxios.get(requests.carList, { params: { userId } });
  return response.data;
};

export const addUserCar = async ({ userId, carNumber, carModel }) => {
  const payload = { userId, carNumber, carModel };
  const response = await jwtAxios.post(requests.carSave, payload);
  return response.data;
};
