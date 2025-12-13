import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/userApi";

export function ProfileEdit({ isLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin()) {
      navigate("/login");
    } else {
      const id = localStorage.getItem("userId");
      setUserId(id || "");
      if (id) {
        loadUserInfo(id);
      }
    }
  }, [isLogin, navigate]);
  // 뒤로 가기 함수
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  const loadUserInfo = async (id) => {
    try {
      const profile = await getProfile(id);
      setName(profile.userName || "");
      setPhone(profile.tel || "");
    } catch (e) {
      console.error(e);
      alert("프로필을 불러오지 못했습니다. 다시 로그인해주세요.");
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({ userId, userName: name, tel: phone });
      alert("정보가 수정되었습니다.");
    } catch (e) {
      console.error(e);
      alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
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
