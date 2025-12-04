import { Bell, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export function Header({ onNavigate, activeSection }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // 헤더 영역의 알림창
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "entrance",
      message: "새로운 차량이 입구에 도착했습니다",
      time: "2분 전",
      targetSection: "entrance",
    },
    {
      id: "2",
      type: "carwash",
      message: "세차장에 새로운 차량이 들어왔습니다",
      time: "5분 전",
      targetSection: "carwash",
    },
    {
      id: "3",
      type: "alert",
      message: "위험 신호가 감지되었습니다 - 주차장 구역 B",
      time: "10분 전",
      targetSection: "parking",
    },
    {
      id: "4",
      type: "maintenance",
      message: "정비존 작업이 완료되었습니다",
      time: "15분 전",
      targetSection: "maintenance",
    },
  ]);

  const unreadCount = notifications.length;

  const handleNotificationClick = (notificationId, targetSection) => {
    onNavigate(targetSection);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    if (notifications.length <= 1) setShowNotifications(false);
  };

  const handleLogout = () => {
    alert("로그아웃되었습니다.");
    setShowProfileMenu(false);
  };

  const handleProfileEdit = () => {
    onNavigate("profile");
    setShowProfileMenu(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "alert": // 경고(사고-충돌 알림)
        return "⚠️";
      // 각 구역에 차가 들어왔을 때 알림
      case "entrance": // 입구
        return "🚗";
      case "carwash": // 세차
        return "🧼";
      case "maintenance": // 정비
        return "🔧";
      case "parking": // 주차
        return "🅿️";
      default:
        return "📋";
    }
  };

  const getSectionTitle = (section) => {
    switch (section) {
      case "main":
        return "메인 대시보드";
      case "entrance":
        return "입출구";
      case "carwash":
        return "세차장";
      case "maintenance":
        return "정비존";
      case "parking":
        return "주차장";
      case "statistics":
        return "통계";
      case "profile":
        return "정보수정";
      case "admin":
        return "관리자 목록 조회";
      default:
        return "메인 대시보드";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 섹션 제목 */}
        <div>
          <h1 className="text-gray-900">
            구역 관리: {getSectionTitle(activeSection)}
          </h1>
          <p className="text-gray-500 mt-1">실시간 모니터링 및 관리</p>
        </div>

        {/* 알림 및 프로필 */}
        <div className="flex items-center gap-4">
          {/* 알림 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 알림 패널 */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-gray-900">알림</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.targetSection
                        )
                      }
                      className="w-full p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 프로필 */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* 프로필 드롭다운 */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button
                    onClick={handleProfileEdit}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900">정보수정</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900">로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
