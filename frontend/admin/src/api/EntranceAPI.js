import backendServer from "./backendServer";
import request from "./requests";

/* =========================
   금일 입차 / 출차
========================= */

// 금일 입차 조회
export const getTodayEntry = async () => {
  const res = await backendServer.get("/entrance/today/entry");
  return res.data;
};

// 금일 출차 조회
export const getTodayExit = async () => {
  const res = await backendServer.get("/entrance/today/exit");
  return res.data;
};

/* =========================
   OCR / 입차 관련
========================= */

// 입차 승인
export const approveEntrance = async (workId) => {
  return backendServer.post(`/entrance/${workId}/approve`);
};

// 등록 차량 전체 조회
export const getRegisteredCars = () => backendServer.get("/admin/registered-cars");

// 등록 차량 기준 입차 승인
export const approveRegisteredCar = (userCarId) =>
  backendServer.post(`/entrance/approve/registered/${userCarId}`);

export const getCurrentEntranceCar = async (nodeId) => {
  const res = await backendServer.get(`/entrance/current?nodeId=${nodeId}`);
  return res.data;
};
