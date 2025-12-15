import backendServer from "./backendServer";
import request from "./requests";

// 1. 회원 목록 보기 (신규 가입자 카운트를 위함)
export const getUserInfo = async () => {
  try {
    const response = await backendServer.get(`${request.newMembership}`);

    return response.data;
  } catch (error) {
    console.error("에러발생: ", error);
    return [];
  }
};
