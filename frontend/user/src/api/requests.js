//백엔드 통신을 하기 위해서 필요한 백엔드쪽 path - 공통 path 분리하고 남은 나머지 path
const requests = {
  //name:path
  userCreate: "/user/create",
  loginAction: "/user/login",
  profile: "/user/profile",
  carSave: "/car/save",
  carList: "/car/list",
  serviceRequest: "/service-request",
  serviceRequestLatest: "/service-request/latest",
  passwordChange: "/user/password-change",
  passwordMatch: "/user/password-match",
  passwordReissue: "/user/password-reissue",
  idFind: "/user/id-find",
};

export default requests;
