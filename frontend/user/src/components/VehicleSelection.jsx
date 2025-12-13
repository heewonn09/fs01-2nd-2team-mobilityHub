import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addUserCar, fetchUserCars } from "../api/vehicleApi";

export default function VehicleSelection({ isLogin }) {
  const [vehicles, setVehicles] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPlateNumber, setNewPlateNumber] = useState("");
  const [newModel, setNewModel] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  useEffect(() => {
    if (!isLogin()) {
      navigate("/login");
      return;
    }
    const id = localStorage.getItem("userId");
    setUserId(id || "");
    if (id) {
      loadVehicles(id);
    }
  }, [isLogin, navigate]);

  const loadVehicles = async (id) => {
    try {
      const list = await fetchUserCars(id);
      const mapped = list.map((carNumber) => ({
        id: carNumber,
        plateNumber: carNumber,
        model: "",
      }));
      setVehicles(mapped);
    } catch (e) {
      console.error(e);
      alert("차량 목록을 불러올 수 없습니다. 다시 로그인해주세요.");
    }
  };

  const handleAddVehicle = async () => {
    if (!newPlateNumber.trim() || !newModel.trim()) {
      alert("차량번호와 모델을 모두 입력해주세요.");
      return;
    }
    try {
      await addUserCar({ userId, carNumber: newPlateNumber, carModel: newModel });
      await loadVehicles(userId);
      setNewPlateNumber("");
      setNewModel("");
      setShowAddDialog(false);
    } catch (e) {
      console.error(e);
      alert("차량 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* 헤더 */}
      <div
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          ← 뒤로
        </button>

        <div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>로그인 사용자</div>
          <div>{userId}</div>
        </div>
      </div>

      {/* 차량 목록 */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ color: "#374151", margin: 0 }}>등록된 차량</h2>

          <button
            onClick={() => setShowAddDialog(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            + 신규 차량 등록
          </button>
        </div>

        {/* 차량 없음 */}
        {vehicles.length === 0 ? (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "32px 16px",
              textAlign: "center",
              color: "#6b7280",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            등록된 차량이 없습니다.
            <br />
            신규 차량을 등록해주세요.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500" }}>{vehicle.plateNumber}</div>
                  <div style={{ fontSize: "14px", color: "#6b7280" }}>{vehicle.model}</div>
                </div>

                <button
                  onClick={() =>
                    navigate("/service", { state: { selectedVehicle: vehicle.plateNumber } })
                  }
                  style={{
                    padding: "6px 16px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  선택
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 차량 추가 다이얼로그 */}
      {showAddDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#374151" }}>신규 차량 등록</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label htmlFor="plateNumber" style={{ display: "block", marginBottom: "4px" }}>
                  차량번호
                </label>
                <input
                  id="plateNumber"
                  value={newPlateNumber}
                  onChange={(e) => setNewPlateNumber(e.target.value)}
                  placeholder="예: 12가3456"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label htmlFor="model" style={{ display: "block", marginBottom: "4px" }}>
                  차량 모델
                </label>
                <input
                  id="model"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="예: 현대 아반떼"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setShowAddDialog(false)}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>

                <button
                  onClick={handleAddVehicle}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
