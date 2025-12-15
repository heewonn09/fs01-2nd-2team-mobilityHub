import axios from "axios";

export const API_SERVER_HOST = "http://127.0.0.1:9000";
const backendServer = axios.create({
  baseURL: API_SERVER_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

// 주차 현황 조회
export const getParkingList = async () => {
  try {
    const response = await backendServer.get("/parking/list");
    return response.data;
  } catch (error) {
    console.error("주차 현황 조회 오류:", error);
    return [];
  }
};

// 주차 상태 업데이트
export const updateParkingStatus = async (sectorId, state) => {
  try {
    const response = await backendServer.post("/parking/update", {
      sectorId,
      state,
    });
    return response.data;
  } catch (error) {
    console.error("주차 상태 업데이트 오류:", error);
    return null;
  }
};
