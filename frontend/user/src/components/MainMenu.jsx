import { Car, History, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
export default function MainMenu({ isLogin, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (!isLogin()) {
      navigate("/login");
    }
  }, [isLogin, navigate]);
  // 현재 페이지 확인 후 active 클래스 도움
  const getClassName = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };
  // userId 가져오기
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{userId}</div>
          <div>{userId}</div>
        </div>
        <button
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
          onClick={() => {
            onLogout();
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 메뉴 */}
      <div className="p-4 space-y-3">
        <h2 className="text-gray-700 mb-4">서비스 선택</h2>

        {/* 서비스 카드 */}
        <div
          className="cursor-pointer bg-white shadow-sm rounded-lg hover:shadow-md transition p-4 flex items-center gap-4"
          onClick={() => navigate("/select")}
        >
          <div className="bg-blue-100 p-3 rounded-lg">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className={getClassName("/service")}>주차장 서비스 이용</div>
            <div className="text-sm text-gray-500">차량 등록 및 서비스 이용</div>
          </div>
        </div>

        <div
          className="cursor-pointer bg-white shadow-sm rounded-lg hover:shadow-md transition p-4 flex items-center gap-4"
          onClick={() => navigate("/history")}
        >
          <div className="bg-green-100 p-3 rounded-lg">
            <History className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div className={getClassName("/history")}>주차장 이용 내역</div>
            <div className="text-sm text-gray-500">이용 내역 및 결제 정보</div>
          </div>
        </div>

        <div
          className="cursor-pointer bg-white shadow-sm rounded-lg hover:shadow-md transition p-4 flex items-center gap-4"
          onClick={() => navigate("/profile")}
        >
          <div className="bg-purple-100 p-3 rounded-lg">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className={getClassName("/profile")}>My정보 수정</div>
            <div className="text-sm text-gray-500">개인정보 관리</div>
          </div>
        </div>
      </div>
    </div>
  );
}
