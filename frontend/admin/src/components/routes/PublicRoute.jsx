import { Navigate } from "react-router-dom";

// 퍼블릭 라우트 컴포넌트
const PublicRoute = ({ children }) => {
  // 로그인 여부 확인
  const isLogin = !!localStorage.getItem("accessToken");

  // 이미 로그인 → 메인으로
  if (isLogin) {
    return <Navigate to="/main" replace />;
  }

  // 비로그인 → 요청한 페이지로
  return children;
};

export default PublicRoute;
