import backendServer from "./backendServer";
import requests from "./requests";

//customer 관련 작업
export const createCustomer = async (customerData) => {
  try {
    const response = await backendServer.post(requests.customerCreate, customerData);
    return response;
  } catch (error) {
    console.error("에러발생:", error);
    alert("회원가입중오류가발생했습니다.");
  }
};
//customer 관련 작업
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
