import React from "react";
import "./Header.css";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const titleMap = {
    "/": "메인 대시보드",
    "/main": "메인 대시보드",
    "/carwash": "세차장 관리",
    "/entrance": "입출구",
    "/parking": "주차장 관리",
    "/admin": "관리자",
    "/repair": "정비소",
    "/statistics": "통계",
  };

  const title = titleMap[location.pathname] || "스마트 주차장";
  return (
    <header>
      <div className="header-menu">
        <div>
          <h1 className="header-title">구역 관리: {title}</h1>
          <p>실시간 모니터링 및 관리</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
