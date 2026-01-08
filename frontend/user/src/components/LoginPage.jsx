import { useState } from "react";
import { login, createUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage({ isLogin }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin()) {
      navigate("/main");
    }
  }, [isLogin, navigate]);
  const [loginData, setLoginData] = useState({ userId: "", password: "" });
  const [signupData, setSignupData] = useState({
    userId: "",
    password: "",
    userName: "",
    tel: "",
    role: "USER",
  });
  const [isSignup, setIsSignup] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUserId = isSignup ? signupData.userId : loginData.userId;
    if (!currentUserId || !currentUserId.trim()) return;

    if (isSignup) {
      // 회원가입
      createUser(signupData)
        .then((data) => {
          alert("회원가입이 완료되었습니다!");
          setIsSignup(false);
          setSignupData({ ...signupData, userId: "", password: "", userName: "", tel: "" });
        })
        .catch((error) => {
          alert("회원가입 실패: 관리자에게 문의하세요.");
        });
    } else {
      // 로그인
      login(loginData)
        .then((data) => {
          if (data && data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("role", data.roles);
            localStorage.setItem("cars", data.cars);
            navigate("/main");
          }
        })
        .catch((error) => {
          alert("로그인 실패: 아이디와 패스워드를 확인하세요.");
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-6">{isSignup ? "회원가입" : "로그인"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              id="userId"
              type="text"
              value={isSignup ? signupData.userId : loginData.userId}
              onChange={(e) =>
                isSignup
                  ? setSignupData({ ...signupData, userId: e.target.value })
                  : setLoginData({ ...loginData, userId: e.target.value })
              }
              placeholder="아이디를 입력하세요"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={isSignup ? signupData.password : loginData.password}
              onChange={(e) =>
                isSignup
                  ? setSignupData({ ...signupData, password: e.target.value })
                  : setLoginData({ ...loginData, password: e.target.value })
              }
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isSignup && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={signupData.userName}
                  onChange={(e) => setSignupData({ ...signupData, userName: e.target.value })}
                  placeholder="이름을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  전화번호
                </label>
                <input
                  id="phone"
                  type="text"
                  value={signupData.tel}
                  onChange={(e) => setSignupData({ ...signupData, tel: e.target.value })}
                  placeholder="전화번호를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-gray-700 py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
          >
            {isSignup ? "가입하기" : "로그인"}
          </button>

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition font-medium"
          >
            {isSignup ? "로그인으로 돌아가기" : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
