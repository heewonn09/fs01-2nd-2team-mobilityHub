import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword } from "../api/userApi";
import UserHeader from "./UserHeader";

export function ProfileEdit({ isLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");

  // 비밀번호 변경 상태
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      alert("프로필을 불러오지 못했습니다. 다시 로그인해주세요.");
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({ userId, userName: name, tel: phone });
      alert("정보가 수정되었습니다.");
    } catch (e) {
      alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = async () => {
    setPasswordError("");
    
    // 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("모든 필드를 입력해주세요.");
      return;
    }
    
    if (newPassword.length < 4) {
      setPasswordError("새 비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    if (currentPassword === newPassword) {
      setPasswordError("현재 비밀번호와 새 비밀번호가 같습니다.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({ userId, currentPassword, newPassword });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      // 폼 초기화
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (e) {
      if (e.response?.data?.error) {
        setPasswordError(e.response.data.error);
      } else {
        setPasswordError("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "16px" }}>
      {/* 헤더 */}
      <UserHeader label="로그인 사용자" value={userId} onBack={handleBack} backText="< 뒤로" />

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

        {/* 비밀번호 변경 섹션 */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginTop: "16px",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontWeight: "bold" }}>비밀번호 변경</div>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordError("");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: showPasswordForm ? "#6b7280" : "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {showPasswordForm ? "취소" : "변경하기"}
            </button>
          </div>

          {showPasswordForm && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              <div>
                <label htmlFor="currentPassword" style={{ display: "block", marginBottom: "4px" }}>
                  현재 비밀번호
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
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
                  placeholder="새 비밀번호를 입력하세요"
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
                  placeholder="새 비밀번호를 다시 입력하세요"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
              
              {passwordError && (
                <div style={{ color: "#ef4444", fontSize: "14px" }}>
                  {passwordError}
                </div>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: isChangingPassword ? "#9ca3af" : "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isChangingPassword ? "not-allowed" : "pointer",
                }}
              >
                {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
