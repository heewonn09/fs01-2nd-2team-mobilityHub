import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowRoles }) => {
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
