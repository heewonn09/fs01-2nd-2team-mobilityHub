import backendServer from "./backendServer";
import request from "./requests";

// 금일 입차 조회
export const getTodayEntry = async () => {
  try {
    const response = await backendServer.get(request.todayEntry);
    return response.data;
  } catch (error) {
    console.error("금일 입차 조회 오류:", error);
    return [];
  }
};

// 금일 출차 조회
export const getTodayExit = async () => {
  try {
    const response = await backendServer.get(request.todayExit);
    return response.data;
  } catch (error) {
    console.error("금일 출차 조회오류:", error);
    return [];
  }
};
