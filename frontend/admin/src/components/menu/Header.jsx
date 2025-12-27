import { useEffect, useState } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const [adminId, setAdminId] = useState("");

  const navigate = useNavigate();

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

  const handleLogout = () => {
    const isConfirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!isConfirmed) return;

    // 실제 로그아웃 처리
    onLogout();

    // 로그아웃 완료 알림
    window.alert("로그아웃 되었습니다.");

    // 새로고침
    window.location.reload();
  };

  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    if (storedAdminId) {
      setAdminId(storedAdminId);
    }
  }, [navigate]);

  const title = titleMap[location.pathname] || "스마트 주차장";
  return (
    <header>
      <div className="header-menu">
        <div>
          <h1 className="header-title">구역 관리: {title}</h1>
          <p>실시간 모니터링 및 관리</p>
        </div>
        <div>
          <span className="admin-id">{adminId}</span>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
