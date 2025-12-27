import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SideMenu from "./components/menu/SideMenu";
import Header from "./components/menu/Header";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import MainSection from "./components/pages/MainSection";
import EntranceExitSection from "./components/pages/EntranceExitSection";
import StatisticsSection from "./components/pages/StatisticsSection";
import CarWashSection from "./components/pages/CarWashSection";
import LicenseModal from "./components/pages/LicenseModal";
import RepairSection from "./components/pages/RepairSection";
import AdminSection from "./components/pages/AdminSection";
import ParkingSection from "./components/pages/ParkingSection";
import AdminLogin from "./components/pages/AdminLogin";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";

function App() {
  const navigate = useNavigate();

  const isLogin = !!localStorage.getItem("accessToken");

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div className="container">
      {isLogin && <SideMenu />}

      <div className="layout-main">
        {isLogin && <Header onLogout={onLogout} />}

        <main className="layout-content">
          <Routes>
            {/* 로그인 */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              }
            />

            {/* 메인페이지 */}
            <Route
              path="/main"
              element={
                <ProtectedRoute
                  allowRoles={["TOTAL", "PARKING", "WASH", "REPAIR"]}
                >
                  <MainSection />
                </ProtectedRoute>
              }
            />

            {/* 입출구 관리 */}
            <Route
              path="/entrance"
              element={
                <ProtectedRoute allowRoles={["TOTAL", "PARKING"]}>
                  <EntranceExitSection />
                </ProtectedRoute>
              }
            />

            {/* 세차장 관리 */}
            <Route
              path="/carwash"
              element={
                <ProtectedRoute allowRoles={["TOTAL", "CARWASH"]}>
                  <CarWashSection />
                </ProtectedRoute>
              }
            />

            {/* 정비소 관리 */}
            <Route
              path="/repair"
              element={
                <ProtectedRoute allowRoles={["TOTAL", "REPAIR"]}>
                  <RepairSection />
                </ProtectedRoute>
              }
            />

            {/* 주차장 관리 */}
            <Route
              path="/parking"
              element={
                <ProtectedRoute allowRoles={["TOTAL", "PARKING"]}>
                  <ParkingSection />
                </ProtectedRoute>
              }
            />

            {/* 통계 */}
            <Route
              path="/statistics"
              element={
                <ProtectedRoute allowRoles={["TOTAL"]}>
                  <StatisticsSection />
                </ProtectedRoute>
              }
            />

            {/* 관리자 관리 */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowRoles={["TOTAL"]}>
                  <AdminSection />
                </ProtectedRoute>
              }
            />

            {/* 기타 */}
            <Route path="/*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
