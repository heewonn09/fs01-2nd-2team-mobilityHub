import { useState } from "react";
import {
  DoorOpen,
  Droplets,
  Wrench,
  ParkingCircle,
  LayoutDashboard,
  User,
  Calendar,
  BarChart3,
  Users,
} from "lucide-react";

// 사이드바 메뉴 이름 변경 필요시 수정
export function Sidebar({ activeSection, onSectionChange }) {
  const menuItems = [
    { id: "main", label: "메인", icon: LayoutDashboard },
    { id: "entrance", label: "입출구", icon: DoorOpen },
    { id: "carwash", label: "세차장", icon: Droplets },
    { id: "maintenance", label: "정비소", icon: Wrench },
    { id: "parking", label: "주차장", icon: ParkingCircle },
    { id: "statistics", label: "통계", icon: BarChart3 },
    { id: "admin", label: "관리자", icon: Users },
  ];

  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <button
        onClick={() => onSectionChange("main")}
        className="p-6 hover:bg-gray-800 transition-colors text-left"
      >
        {/* 사이드바 - 제목영역 */}
        <h2 className="text-white">스마트 주차장</h2>
      </button>

      {/* 사이드바 - 메뉴선택 영역 */}
      <nav className="px-3 flex-1">
        {menuItems.map((item) => {
          // 아이콘 컴포넌트
          const Icon = item.icon;

          // 현재 활성화된 메뉴(activeSection) === 메뉴 항목의 id
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              // 버튼 클릭 시 변경
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 사이드바 - 바닥 영역 */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            {/* 로그인한 관리자 name, mail로 변경 필요 */}
            <p className="text-white text-sm">관리자</p>
            <p className="text-gray-400 text-xs">admin@smartpark.com</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calendar className="w-4 h-4" />
          {/* 현재 날짜 */}
          <span>{currentDate}</span>
        </div>
      </div>
    </aside>
  );
}
