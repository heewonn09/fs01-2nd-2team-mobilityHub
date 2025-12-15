// 백엔드 통신을 위한 path

const request = {
  carWashing: "/carwash/select",

  // 입출구 API 추가
  todayEntry: "/entrance/today/entry",
  todayExit: "/entrance/today/exit",

  // 작업 전체 목록
  workList: "/entrance/work/list",

  // 정비소 api
  // 1) 정비 서비스 차량 모든 조회
  repairAll: "/repair/list",
  reportList: "/repair/report/list",
  createStock: "/repair/create",
  updateStock: "/repair/detail/update",
  deleteStock: "/repair/detail/delete",
};

export default request;
