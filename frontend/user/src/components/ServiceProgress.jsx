import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ServiceProgress({ selectedVehicle, isLogin }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin()) {
      navigate("/login");
    }
  }, [isLogin, navigate]);
  const SERVICE_NAMES = {
    maintenance: "정비",
    carwash: "세차",
    parking: "주차",
  };

  // 뒤로 가기 함수
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const [selectedServices, setSelectedServices] = useState(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasAdditionalRequest, setHasAdditionalRequest] = useState(false);
  const [additionalRequest, setAdditionalRequest] = useState("");

  const toggleService = (type) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(type)) newSelected.delete(type);
    else newSelected.add(type);
    setSelectedServices(newSelected);
  };

  const handleSubmit = () => {
    if (selectedServices.size === 0) {
      alert("서비스를 선택해주세요.");
      return;
    }
    setShowConfirmDialog(true);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "16px" }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <button onClick={handleBack} style={{ padding: "4px 8px" }}>
          &lt; 뒤로
        </button>
        <div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>선택된 차량</div>
          <div>{selectedVehicle}</div>
        </div>
      </div>

      {/* 서비스 선택 */}
      <h2 style={{ color: "#374151", marginBottom: "8px" }}>이용할 서비스 선택</h2>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["parking", "carwash", "maintenance"].map((type) => (
          <button
            key={type}
            onClick={() => toggleService(type)}
            style={{
              flex: 1,
              height: "80px",
              backgroundColor: selectedServices.has(type) ? "#3b82f6" : "#fff",
              color: selectedServices.has(type) ? "#fff" : "#000",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          >
            {SERVICE_NAMES[type]}
          </button>
        ))}
      </div>

      {/* 정비 추가 요청 */}
      {selectedServices.has("maintenance") && (
        <div
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={hasAdditionalRequest}
              onChange={(e) => {
                setHasAdditionalRequest(e.target.checked);
                if (!e.target.checked) setAdditionalRequest("");
              }}
            />{" "}
            추가 서비스 요청이 있으십니까?
          </label>
          {hasAdditionalRequest && (
            <div style={{ marginTop: "8px" }}>
              <textarea
                value={additionalRequest}
                onChange={(e) => setAdditionalRequest(e.target.value)}
                placeholder="예: 에어컨 필터 교체, 와이퍼 교체 등"
                style={{ width: "100%", minHeight: "80px" }}
              />
            </div>
          )}
        </div>
      )}

      {/* 전송 버튼 */}
      <button onClick={handleSubmit} style={{ width: "100%", padding: "12px" }}>
        전송
      </button>

      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "16px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>서비스 확인</h3>
            <div style={{ marginBottom: "8px" }}>
              {Array.from(selectedServices).map((type) => (
                <div key={type}>• {SERVICE_NAMES[type]}</div>
              ))}
              {selectedServices.has("maintenance") && hasAdditionalRequest && additionalRequest && (
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#374151" }}>
                  추가 요청: {additionalRequest}
                </div>
              )}
            </div>
            <button onClick={() => setShowConfirmDialog(false)} style={{ marginRight: "8px" }}>
              확인
            </button>
            <button onClick={() => setShowConfirmDialog(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}
