import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ProfileEdit({ userId, onBack, isLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin()) {
      navigate("/login");
    }
  }, [isLogin, navigate]);
  // 뒤로 가기 함수
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  useEffect(() => {
    loadUserInfo();
  }, [userId]);

  const loadUserInfo = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[userId];
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  };

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const user = users[userId];

    if (!user) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (newPassword || confirmPassword) {
      if (user.password !== password) {
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPassword.length < 4) {
        alert("비밀번호는 4자 이상이어야 합니다.");
        return;
      }
      user.password = newPassword;
    }

    user.name = name;
    user.phone = phone;
    users[userId] = user;
    localStorage.setItem("users", JSON.stringify(users));

    alert("정보가 수정되었습니다.");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "16px" }}>
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          backgroundColor: "#fff",
          padding: "8px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <button onClick={handleBack} style={{ padding: "4px 8px" }}>
          &lt; 뒤로
        </button>
        <div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>로그인 사용자</div>
          <div>{userId}</div>
        </div>
      </div>

      {/* 정보 수정 */}
      <div style={{ marginTop: "16px" }}>
        <h2 style={{ color: "#374151", marginBottom: "16px" }}>My정보 수정</h2>

        {/* 개인정보 카드 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginBottom: "16px",
            padding: "12px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>개인정보</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label htmlFor="name" style={{ display: "block", marginBottom: "4px" }}>
                이름
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div>
              <label htmlFor="phone" style={{ display: "block", marginBottom: "4px" }}>
                전화번호
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호를 입력하세요"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 카드 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginBottom: "16px",
            padding: "12px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>비밀번호 변경</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label htmlFor="currentPassword" style={{ display: "block", marginBottom: "4px" }}>
                현재 비밀번호
              </label>
              <input
                id="currentPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="현재 비밀번호"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div>
              <label htmlFor="newPassword" style={{ display: "block", marginBottom: "4px" }}>
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "4px" }}>
                새 비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}
