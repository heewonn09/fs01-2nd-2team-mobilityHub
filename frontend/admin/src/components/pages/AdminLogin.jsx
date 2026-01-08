import { useNavigate } from "react-router-dom";
import "../style/AdminLogin.css";
import { useState } from "react";
import { adminLoginAPI } from "../../api/adminAPI";

export default function AdminLogin() {
  const [adminLoginData, setAdminLoginData] = useState({
    adminId: "",
    adminPass: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentAdminId = adminLoginData.adminId;
    if (!currentAdminId || !currentAdminId.trim()) return;

    console.log(adminLoginData);

    // 로그인
    adminLoginAPI(adminLoginData)
      .then((data) => {
        console.log("로그인 성공", data);
        if (data && data.accessToken) {
          console.log("인증성공");
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

      {/* 로그인 실패 팝업 만들기*/}
    </div>
  );
}
