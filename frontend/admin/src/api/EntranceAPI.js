import backendServer from "./backendServer";
import request from "./requests";

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
// 입차 승인
export const approveEntrance = async (workId) => {
  return backendServer.post(`/entrance/${workId}/approve`);
};
export const getCurrentEntranceCar = async (nodeId) => {
  const res = await backendServer.get(`/entrance/current?nodeId=${nodeId}`);
  return res.data;
};
