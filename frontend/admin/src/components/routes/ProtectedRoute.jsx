import { Navigate } from "react-router-dom";

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children, allowRoles }) => {
  // 로컬 스토리지에서 토큰 및 역할 가져오기
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // 로그인 여부
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 권한 확인
  if (allowRoles && !allowRoles.includes(role)) {
    window.alert("접근 권한이 없습니다.");
    return <Navigate to="/main" replace />;
  }

  return children;
};

export default ProtectedRoute;
