import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitServiceRequest, fetchLatestServiceRequest, callVehicle } from "../api/serviceApi";

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

  // 프론트엔드 서비스 타입을 백엔드 형식으로 변환
  const toBackendServiceType = (frontendType) => {
    const mapping = {
      parking: "park",
      maintenance: "repair",
      carwash: "carwash",
    };
    return mapping[frontendType] || frontendType;
  };

  // 백엔드 서비스 타입을 프론트엔드 형식으로 변환
  const toFrontendServiceType = (backendType) => {
    const mapping = {
      park: "parking",
      repair: "maintenance",
      carwash: "carwash",
    };
    return mapping[backendType] || backendType;
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
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
        const loadLatest = async () => {
          try {
            const latest = await fetchLatestServiceRequest(userId);
            if (latest) {
              // 백엔드 서비스 타입을 프론트엔드 형식으로 변환
              const frontendServices = latest.services?.map(toFrontendServiceType) || [];
              setProgress({
                id: latest.id,
                status: latest.status,
                carNumber: latest.carNumber,
                services: frontendServices,
                createdAt: latest.createdAt,
                parkingStatus: latest.parkingStatus,
                carwashStatus: latest.carwashStatus,
                repairStatus: latest.repairStatus,
                carState: latest.carState,
              });
            }
          } catch (e) {
            // 무시
          }
        };
    loadLatest();
    const interval = setInterval(loadLatest, 4000);
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
                  if (!userId) {
                    alert("로그인이 필요합니다.");
                    navigate("/login");
                    return;
                  }
                  setIsSubmitting(true);
                  // 프론트엔드 서비스 타입을 백엔드 형식으로 변환
                  const backendServices = Array.from(selectedServices).map(toBackendServiceType);
                  const result = await submitServiceRequest({
                    userId,
                    carNumber: selectedVehicle,
                    services: backendServices,
                    additionalRequest: hasAdditionalRequest && additionalRequest ? additionalRequest : null,
                  });
                  // 백엔드 응답의 서비스 타입을 프론트엔드 형식으로 변환
                  const frontendServices = result.services?.map(toFrontendServiceType) || Array.from(selectedServices);
                  setProgress({
                    id: result.id,
                    status: result.status || "REQUESTED",
                    carNumber: result.carNumber || selectedVehicle,
                    services: frontendServices,
                    createdAt: result.createdAt || new Date().toISOString(),
                    parkingStatus: result.parkingStatus,
                    carwashStatus: result.carwashStatus,
                    repairStatus: result.repairStatus,
                    carState: result.carState,
                  });
                  setShowConfirmDialog(false);
                  setSelectedServices(new Set());
                  setHasAdditionalRequest(false);
                  setAdditionalRequest("");
                  alert("서비스 요청이 접수되었습니다.");
                } catch (e) {
                  console.error(e);
                  alert("서비스 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
              style={{ marginRight: "8px" }}
            >
              {isSubmitting ? "전송 중..." : "확인"}
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
              주차 상태: {progress.parkingStatus || "-"}
            </div>
            <div style={{ marginBottom: "4px" }}>
              세차 상태: {progress.carwashStatus || "-"}
            </div>
            <div style={{ marginBottom: "4px" }}>
              정비 상태: {progress.repairStatus || "-"}
            </div>
            <div style={{ marginBottom: "4px" }}>
              현재 위치: {progress.carState || "-"}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>
              요청 시각: {(progress.createdAt || "").replace("T", " ").slice(0, 19)}
            </div>
            
            {/* 차량 호출 버튼 (주차 중일 때만 표시) */}
            {progress.services?.includes("parking") && 
             progress.parkingStatus === "occupied" && (
              <button
                onClick={async () => {
                  if (!progress.id) {
                    alert("작업 정보를 찾을 수 없습니다.");
                    return;
                  }
                  if (isCalling) return;
                  
                  try {
                    setIsCalling(true);
                    await callVehicle(progress.id);
                    alert("차량 호출 신호가 발행되었습니다. 차량이 출구로 이동합니다.");
                  } catch (error) {
                    console.error(error);
                    const errorMessage = error.response?.data?.error || "차량 호출 중 오류가 발생했습니다.";
                    alert(errorMessage);
                  } finally {
                    setIsCalling(false);
                  }
                }}
                disabled={isCalling}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: isCalling ? "#9ca3af" : "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isCalling ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {isCalling ? "호출 중..." : "🚗 차량 호출"}
              </button>
            )}
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
