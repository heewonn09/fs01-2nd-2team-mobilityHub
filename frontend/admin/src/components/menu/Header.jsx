import { useEffect, useState } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Header = ({ onLogout }) => {
  const [adminId, setAdminId] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    setShowProfileMenu(false);
    if (!isConfirmed) return;

    // 실제 로그아웃 처리
    onLogout();

    // 로그아웃 완료 알림
    window.alert("로그아웃 되었습니다.");

    // 새로고침
    window.location.reload();
  };

  const handleProfileEdit = () => {
    setShowProfileMenu(false);
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
        {/* 좌측: 제목 */}
        <div>
          <h1 className="header-title">구역 관리: {title}</h1>
          <p>실시간 모니터링 및 관리</p>
        </div>

        {/* 우측: 프로필 */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 드롭다운 */}
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="p-2">
                <button onClick={handleLogout}>
                  <LogOut />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
