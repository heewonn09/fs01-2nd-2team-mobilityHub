import { Route, Routes, useNavigate } from "react-router-dom";
import MainMenu from "./components/MainMenu";
import { ServiceProgress } from "./components/ServiceProgress";
import { UsageHistory } from "./components/UsageHistory";
import { ProfileEdit } from "./components/ProfileEdit";
import LoginPage from "./components/LoginPage";
function App() {
  const navigate = useNavigate();
  const isLogin = () => {
    return !!localStorage.getItem("accessToken");
  };

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  return (
    <>
      <Routes>
        <Route path="/" element={<MainMenu isLogin={isLogin} onLogout={onLogout} />} />
        <Route path="/main" element={<MainMenu isLogin={isLogin} onLogout={onLogout} />} />
        <Route path="/service" element={<ServiceProgress isLogin={isLogin} />} />
        <Route path="/history" element={<UsageHistory isLogin={isLogin} />} />
        <Route path="/profile" element={<ProfileEdit isLogin={isLogin} />} />
        <Route path="/login" element={<LoginPage isLogin={isLogin} />} />
      </Routes>
    </>
  );
}

export default App;
