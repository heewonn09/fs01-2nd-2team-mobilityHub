import backendServer from "./backendServer";
import request from "./requests";

// 통계 차트를 위함
// 1. 작업 목록 전체 조회
export const getWorkInfoList = async () => {
  try {
    const response = await backendServer.get(`${request.workList}`);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};

// 2. 오늘 작업 목록만 전체 조회
export const getTodayWorkList = async () => {
  try {
    const response = await backendServer.get(`${request.todayWork}`);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};

export const workInfoTotalList = async () => {
  try {
    const response = await backendServer.get(request.workInfoTotalList);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};
