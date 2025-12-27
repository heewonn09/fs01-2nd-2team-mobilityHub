// 백엔드 통신을 위한 path

const request = {
  // 로그인
  login: "/admin/login",
  adminInfo: "/admin/info",
  adminUpdate: "/admin/update",

  // 메인
  workList: "/entrance/work/list",
  todayWork: "/entrance/work/today",
  workInfoTotalList: "/entrance/work/totalList",

  // 입출구
  todayEntry: "/entrance/today/entry",
  todayExit: "/entrance/today/exit",

  // 주차장
  parkingList: "/parking/list",
  parkStatusUpdateList: "/parking/update",

  // 세차장
  carWashing: "/carwash/select",
  sendWashComplete: "/carwash/complete",

  //정비소
  repairList: "/repair/repair_list",
  stockList: "/repair/stock_list",
  reportList: "/repair/report/list",
  createStock: "/repair/create",
  updateStock: "/repair/detail/update",
  deleteStock: "/repair/detail/delete",
  writeReport: "repair/report/write",
  sendRepairComplete: "/repair/complete",

  // 통계
  repairAmount: "/repair/report/amount",
  newMembership: "/user/userlist",

  // 관리자 조회
  adminList: "/admin/list",
};

export default request;
