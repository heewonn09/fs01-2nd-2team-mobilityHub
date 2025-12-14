import React from "react";

import "./SideMenu.css";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";

const SideMenu = () => {
  const location = useLocation();

  // 현재 페이지 확인 후 active 클래스 도움
  const getClassName = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };

  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div>
      <aside className="side-menu">
        <div className="side-title">
          <Link to="/" className={getClassName("/")}>
            스마트 주차장
          </Link>
        </div>
        <nav className="side-page">
          <Link to="/main" className={getClassName("/main")}>
            메인
          </Link>
          <Link to="/entrance" className={getClassName("/entrance")}>
            입출구
          </Link>
          <Link to="/parking" className={getClassName("/parking")}>
            주차장
          </Link>
          <Link to="/carwash" className={getClassName("/carwash")}>
            세차장
          </Link>
          <Link to="/repair" className={getClassName("/repair")}>
            정비소
          </Link>
          <Link to="/statistics" className={getClassName("/statistics")}>
            통계
          </Link>
          <Link to="/admin" className={getClassName("/admin")}>
            관리자 조회
          </Link>
        </nav>
        <div className="side-footer">
          <div className="side-info">
            {/* 로그인한 관리자 name, mail로 변경 필요 */}
            <div className="side-profile">
              <User className="profile" />
            </div>
            <div className="admin">
              <p id="admin-name">관리자 이름</p>
              <p id="admin-email">관리자 이메일</p>
            </div>
          </div>
          <div className="today">
            <span>{currentDate}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideMenu;
