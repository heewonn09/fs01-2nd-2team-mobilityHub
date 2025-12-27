import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isLogin = !!localStorage.getItem("accessToken");

  // 이미 로그인 → 메인으로
  if (isLogin) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

export default PublicRoute;
