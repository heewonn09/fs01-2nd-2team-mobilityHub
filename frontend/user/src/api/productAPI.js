import backendServer from "./backendServer";
import jwtAxios from "./jwtUtil";
import requests from "./requests";

export const findAll = async () => {
  try {
    const response = await backendServer.get(requests.productList);
    return response;
  } catch (e) {
    console.error("에러발생:", e);
    alert("목록조회중 오류 발생.");
  }
};

//2. 상품상세 조회
export const findById = async (productNo) => {
  try {
    //1. 파라미터 정보 세팅
    const config = {
      params: {
        //백엔드 컨트롤러에서 @RequestParam으로 정의한 파라미터명과 동일하게 작업
        productNo: productNo,
      },
    };
    //2. 백엔드 통신하기
    const response = await jwtAxios.get(requests.productRead, config);
    return response.data;
  } catch (e) {
    console.error("에러발생:", e);
    alert("목록조회중 오류 발생.");
  }
};

//3. 키워드로 제품조회
export const findByKeyword = async (keyword) => {
  try {
    const config = {
      params: {
        keyword: keyword,
      },
    };
    const response = await backendServer.get(requests.searchProduct, config);
    console.log("response.data", response.data);
    return response.data;
  } catch (e) {
    console.error("에러발생:", e);
  }
};
