//로컬스토리지에 저장된 토큰을 요청하기 전에 헤더에 넣어서 요청하도록 Axios에서 제공하는
//인터셉터를 정의하고 작업
//인터셉터는 요청이 나가기 전에 실행되는 객체로 모든 요청에서 처리해야 하는 중복된 내용이 있으면

import axios from "axios";
import { API_SERVER_HOST } from "./backendServer";

const jwtAxios = axios.create({
  baseURL: API_SERVER_HOST, //접속할 서버의 주소(변수명 고정)
  headers: {
    "Content-Type": "application/json", //request할 때 보내는 데이터의 종류가 json
  },
});

//Request Intercepter(요청이 나가기 전에 실행될 함수)
const beforeRequestFunction = (config) => {
  const accessToken = localStorage.getItem("accessToken");
  //토큰이 존재하지 않으면 예외처리
  if (!accessToken) {
    console.warn("토큰이 로컬 저장소에 없습니다.");
    return Promise.reject({
      response: {
        data: { error: "REQUIRE_LOGIN", message: "로그인이 필요한 서비스입니다." },
      },
    });
  }
  //Http header의 Authorization필드에 토큰을 주입
  config.headers.Authorization = `Bearer ${accessToken}`;
  //변경된 설정객체를 반환 => Axios가 이 설정을 이용해서 실제 요청을 전송
  return config;
};
//요청 실패 함수
const requsetFail = (err) => {
  console.log("요청에러", err);
  return Promise.reject(err);
};

//인터셉터 등록
jwtAxios.interceptors.request.use(beforeRequestFunction, requsetFail);

export default jwtAxios;
