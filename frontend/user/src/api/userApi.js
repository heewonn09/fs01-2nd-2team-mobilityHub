import backendServer from "./backendServer";
import requests from "./requests";
import jwtAxios from "./jwtUtil";

//user 관련 작업
export const createUser = async (userData) => {
  try {
    const response = await backendServer.post(requests.userCreate, userData);
    return response;
  } catch (error) {
    console.error("에러발생:", error);
    alert("회원가입중오류가발생했습니다.");
  }
};
//user 관련 작업
export const login = async (loginData) => {
  //axios로 서버와 통신
  try {
    const response = await backendServer.post(requests.loginAction, loginData);
    return response.data;
  } catch (error) {
    console.error("에러발생:", error);
    alert("로그인중오류가발생했습니다.");
  }
};

export const getProfile = async (userId) => {
  const response = await jwtAxios.get(requests.profile, { params: { userId } });
  return response.data;
};

export const updateProfile = async (profile) => {
  const response = await jwtAxios.put(requests.profile, profile);
  return response.data;
};

// 비밀번호 변경
export const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const response = await jwtAxios.put(requests.passwordChange, {
    userId,
    currentPassword,
    newPassword,
  });
  return response.data;
};
