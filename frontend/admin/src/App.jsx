import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SideMenu from "./components/menu/SideMenu";
import Header from "./components/menu/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import MainSection from "./components/pages/MainSection";
import EntranceExitSection from "./components/pages/EntranceExitSection";
import StatisticsSection from "./components/pages/StatisticsSection";
import CarWashSection from "./components/pages/CarWashSection";
import LicenseModal from "./components/pages/LicenseModal";
import RepairSection from "./components/pages/RepairSection";
import AdminSection from "./components/pages/AdminSection";
import ParkingSection from "./components/pages/ParkingSection";
import AdminLogin from "./components/pages/AdminLogin";

function App() {
  return (
    <>
      <div className="container">
        <SideMenu />
        <div className="layout-main">
          <Header />
          <main className="layout-content">
            <Routes>
              <Route path="/" element={<AdminLogin />} />
              <Route path="/entrance" element={<EntranceExitSection />} />
              <Route path="/main" element={<MainSection />} />
              <Route path="/statistics" element={<StatisticsSection />} />
              <Route path="/carwash" element={<CarWashSection />} />
              <Route path="/statistics" element={<LicenseModal />} />
              <Route path="/admin" element={<AdminSection />} />
              <Route path="/repair" element={<RepairSection />} />
              <Route path="/parking" element={<ParkingSection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
