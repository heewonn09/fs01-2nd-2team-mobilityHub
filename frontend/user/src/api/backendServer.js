import axios from "axios";
//axios를 사용하면서 중복되는 부분을 정의해서 axios 인스턴스가 만들어질 수 있도록 정의
//axios의 create메서드를 이용해서 작업
//create를 쓰면 독립적인 별도의 axios객체가 메모리에 생성
//만약 프로젝트 내부에서 백엔드 이외에 날씨API나 MAP API등을 이용하며 각각 다른 설정을 가진 서버에 접속해야 한다면
// 인스턴스를 여러 개 만들어서 작업할 수 있다
export const API_SERVER_HOST = "http://127.0.0.1:9000";
const backendServer = axios.create({
  baseURL: API_SERVER_HOST, //접속할 서버의 주소(변수명 고정)
  headers: {
    //request 헤더정보 - 요청하기 위해서 설정해야 하는 헤더정보
    "Content-Type": "application/json", //request할 때 보내는 데이터의 종류가 json
  },
});

export default backendServer;
