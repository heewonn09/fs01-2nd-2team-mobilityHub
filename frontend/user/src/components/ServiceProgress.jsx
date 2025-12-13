import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitServiceRequest, fetchLatestServiceRequest } from "../api/serviceApi";

export function ServiceProgress({ isLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVehicle = location.state?.selectedVehicle || "";
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
  const [progress, setProgress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const interval = setInterval(async () => {
      try {
        const latest = await fetchLatestServiceRequest(userId);
        if (latest) {
          setProgress({
            status: latest.status,
            carNumber: latest.carNumber,
            services: latest.services,
            createdAt: latest.createdAt,
          });
        }
      } catch (e) {
        // 무시
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleService = (type) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(type)) newSelected.delete(type);
    else newSelected.add(type);
    setSelectedServices(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedServices.size === 0) {
      alert("서비스를 선택해주세요.");
      return;
    }
    if (!selectedVehicle) {
      alert("선택된 차량이 없습니다. 차량을 먼저 선택해주세요.");
      navigate("/select");
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
            <button
              onClick={async () => {
                try {
                  const userId = localStorage.getItem("userId");
                  setIsSubmitting(true);
                  await submitServiceRequest({
                    userId,
                    carNumber: selectedVehicle,
                    services: Array.from(selectedServices),
                    additionalRequest,
                  });
                  setProgress({
                    status: "REQUESTED",
                    carNumber: selectedVehicle,
                    services: Array.from(selectedServices),
                    createdAt: new Date().toISOString(),
                  });
                  setShowConfirmDialog(false);
                  alert("서비스 요청이 접수되었습니다.");
                } catch (e) {
                  console.error(e);
                  alert("서비스 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              style={{ marginRight: "8px" }}
            >
              확인
            </button>
            <button onClick={() => setShowConfirmDialog(false)}>취소</button>
          </div>
        </div>
      )}
      {/* 진행 상황 */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontWeight: "600", marginBottom: "8px" }}>진행 상황</div>
        {progress ? (
          <div>
            <div style={{ marginBottom: "4px" }}>전체 상태: {progress.status || "대기"}</div>
            <div style={{ marginBottom: "4px" }}>차량: {progress.carNumber}</div>
            <div style={{ marginBottom: "4px" }}>
              서비스: {progress.services?.map((s) => SERVICE_NAMES[s] || s).join(", ")}
            </div>
            <div style={{ marginBottom: "4px" }}>
              주차 상태:{" "}
              {progress.parkingStatus || (progress.services?.includes("parking") ? "대기" : "-")}
            </div>
            <div style={{ marginBottom: "4px" }}>
              세차 상태:{" "}
              {progress.carwashStatus || (progress.services?.includes("carwash") ? "대기" : "-")}
            </div>
            <div style={{ marginBottom: "4px" }}>
              정비 상태:{" "}
              {progress.maintenanceStatus ||
                (progress.services?.includes("maintenance") ? "대기" : "-")}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              요청 시각: {(progress.createdAt || "").replace("T", " ").slice(0, 19)}
            </div>
          </div>
        ) : (
          <div style={{ color: "#6b7280" }}>
            아직 요청된 서비스가 없습니다. 서비스를 선택하고 전송하세요.
          </div>
        )}
      </div>
    </div>
  );
}
