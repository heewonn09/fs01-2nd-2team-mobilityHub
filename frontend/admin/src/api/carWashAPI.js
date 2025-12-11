import backendServer from "./backendServer";
import request from "./requests";

// 1. 현재 세차장 작업 중인 차량 조회
export const getCarWashing = async (workId) => {
  try {
    const response = await backendServer.get(`${request.carWashing}?workId=${workId}`);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
  }
};
