import axios from "axios";

export const API_SERVER_HOST = "http://127.0.0.1:9000";
const backendServer = axios.create({
  baseURL: API_SERVER_HOST, // 접속할 서버의 주소
  headers: {
    // request 헤더 정보 (요청하기 위해서 설정해야 하는 헤더 정보)
    "Content-Type": "application/json", // request할 때 보내는 데이터의 종류가 json
  },
});

export default backendServer;
