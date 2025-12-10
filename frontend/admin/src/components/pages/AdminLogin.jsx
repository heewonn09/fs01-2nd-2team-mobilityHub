import { useNavigate } from "react-router-dom";
import "../style/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-block">
          <div className="icon-wrapper"></div>
          <h1 className="text-title">스마트 주차장 관리 시스템</h1>
          <p className="text-subtitle">관리자 로그인</p>
        </div>
        <form className="login-form-space">
          <div>
            <label htmlFor="username" className="text-block">
              아이디
            </label>
            <div className="block-relative">
              <input
                id="username"
                type="text"
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
                id="password"
                type="password"
                className="input-field"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={() => navigate("/main")}
            className="login-subButton"
          >
            로그인
          </button>
        </form>
      </div>

      {/* 로그인 실패 팝업 만들기*/}
    </div>
  );
};

export default AdminLogin;
