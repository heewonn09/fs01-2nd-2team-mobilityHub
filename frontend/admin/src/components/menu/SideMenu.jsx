import { useEffect, useState } from "react";

import "./SideMenu.css";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  DoorOpen,
  Droplets,
  LayoutDashboard,
  ParkingCircle,
  User,
  Users,
  Wrench,
} from "lucide-react";

const SideMenu = () => {
  const [adminId, setAdminInfo] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  //현재 로그인한 관리자 정보
  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    const storedAdminEmail = localStorage.getItem("email");
    if (storedAdminId && storedAdminEmail) {
      setAdminInfo(storedAdminId);
      setAdminEmail(storedAdminEmail);
    }
  }, []);

  const location = useLocation();


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
            <h2>스마트 주차장</h2>
          </Link>
        </div>
        <nav className="side-page">
          <Link to="/main" className={getClassName("/main")}>
            <LayoutDashboard />
            메인
          </Link>
          <Link to="/entrance" className={getClassName("/entrance")}>
            <DoorOpen />
            입출구
          </Link>
          <Link to="/parking" className={getClassName("/parking")}>
            <ParkingCircle />
            주차장
          </Link>
          <Link to="/carwash" className={getClassName("/carwash")}>
            <Droplets />
            세차장
          </Link>
          <Link to="/repair" className={getClassName("/repair")}>
            <Wrench />
            정비소
          </Link>
          <Link to="/statistics" className={getClassName("/statistics")}>
            <BarChart3 />
            통계
          </Link>
          <Link to="/admin" className={getClassName("/admin")}>
            <Users />
            관리자 조회
          </Link>
        </nav>
        <div className="side-footer">
          <div className="side-info">
            <div className="side-profile">
              <User className="profile" />
            </div>
            <div className="admin">
              <p id="admin-name">{adminId}</p>
              <p id="admin-email">{adminEmail}</p>
            </div>
          </div>
          <div className="today">{currentDate}</div>
        </div>
      </aside>
    </div>
  );
};

export default SideMenu;
