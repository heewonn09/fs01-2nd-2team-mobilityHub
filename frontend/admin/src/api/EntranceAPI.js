import backendServer from "./backendServer";
import request from "./requests";

/* =========================
   금일 입차 / 출차
========================= */

// 금일 입차 조회
export const getTodayEntry = async () => {
  try {
    const res = await backendServer.get(request.todayEntry);
    return res.data;
  } catch (error) {
    console.error("금일 입차 조회 오류:", error);
    return [];
  }
};

// 금일 출차 조회
export const getTodayExit = async () => {
  try {
    const res = await backendServer.get(request.todayExit);
    return res.data;
  } catch (error) {
    console.error("금일 출차 조회 오류:", error);
    return [];
  }
};

/* =========================
   OCR / 입차 관련
========================= */

// 최근 인식 번호판
export const getLatestEntrance = async () => {
  const res = await backendServer.get("/entrance/latest");
  return res.data;
};

// OCR 번호 수정 (image 기준)
export const updateOcrNumber = async (imageId, carNumber) => {
  return backendServer.put(`/entrance/image/${imageId}/ocr`, {
    carNumber,
  });
};

// 입차 승인
export const approveEntrance = async (workId) => {
  return backendServer.post(`/entrance/${workId}/approve`);
};
