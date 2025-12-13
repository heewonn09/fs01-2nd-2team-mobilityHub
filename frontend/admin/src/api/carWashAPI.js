import backendServer from "./backendServer";
import request from "./requests";

// 1. 오늘 세차장 작업 목록 조회
export const getCarWashing = async () => {
  try {
    const response = await backendServer.get(`${request.carWashing}`);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};
