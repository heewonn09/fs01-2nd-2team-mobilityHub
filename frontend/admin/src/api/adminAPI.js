import React from "react";
import backendServer from "../../../user/src/api/backendServer";
import jwtAxios from "../../../user/src/api/jwtUtil";
import request from "./requests";

// admin 로그인
export const adminLoginAPI = async (loginData) => {
  try {
    const response = await backendServer.post(request.login, loginData);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("에러발생:", error);
    alert("로그인 실패\n아이디 또는 패스워드를 확인하세요");
  }
};

// 아이디별 관리자 정보 조회
export const getAdminProfile = async (adminId) => {
  const response = await jwtAxios.get(request.adminInfo, {
    params: { adminId },
  });
  return response.data;
};

// export const updateAdminProfile = async (profile) => {
//   const response = await jwtAxios.put(requests.adminUpdate, profile);
//   return response.data;
// };
