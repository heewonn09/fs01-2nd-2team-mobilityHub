// 백엔드 통신을 위한 path

const request = {
  // 세차장 api
  carWashing: "/carwash/select",

  // 입출구 API 추가
  todayEntry: "/entrance/today/entry",
  todayExit: "/entrance/today/exit",

  // 정비소 api
  // 1) 정비 서비스 차량 모든 조회
  repairAll: "/repair/a",
};

export default request;
