import { useNavigate } from "react-router-dom";
import { useState } from "react";

// API
import { adminLoginAPI } from "../../api/adminAPI";

// 스타일
import "../style/AdminLogin.css";

// 관리자 로그인 페이지
export default function AdminLogin() {
  // 관리자 로그인 데이터 상태 관리
  const [adminLoginData, setAdminLoginData] = useState({
    adminId: "",
    adminPass: "",
  });

  // 페이지 이동을 위한 useNavigate 훅
  const navigate = useNavigate();

  // 로그인 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    const currentAdminId = adminLoginData.adminId;
    if (!currentAdminId || !currentAdminId.trim()) return;

    // 로그인
    adminLoginAPI(adminLoginData)
      .then((data) => {
        // 로그인 성공 시 토큰 및 정보 로컬 스토리지에 저장
        if (data && data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("adminId", data.adminId);
          localStorage.setItem("role", data.roles);
          localStorage.setItem("email", data.email);
          window.alert("로그인에 성공했습니다.");

          window.location.reload();
          navigate("/main");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-block">
          <div className="icon-wrapper"></div>
          <h1 className="text-title">스마트 주차장 관리 시스템</h1>
          <p className="text-subtitle">관리자 로그인</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form-space">
          <div>
            <label htmlFor="username" className="text-block">
              아이디
            </label>
            <div className="block-relative">
              <input
                id="adminId"
                type="text"
                // 입력값 변경 시 상태 업데이트
                onChange={(e) =>
                  setAdminLoginData({
                    ...adminLoginData,
                    adminId: e.target.value,
                  })
                }
                className="input-field"
                placeholder="아이디를 입력하세요"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-block">
              비밀번호
            </label>
            <div className="block-relative">
              <input
                id="adminPass"
                type="password"
                // 입력값 변경 시 상태 업데이트
                onChange={(e) =>
                  setAdminLoginData({
                    ...adminLoginData,
                    adminPass: e.target.value,
                  })
                }
                className="input-field"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          <button type="submit" className="login-subButton">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
