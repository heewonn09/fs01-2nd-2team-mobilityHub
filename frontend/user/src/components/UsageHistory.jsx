import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function UsageHistory({ userId, isLogin }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin()) {
      navigate("/login");
    }
  }, [isLogin, navigate]);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "all" | "date" | "vehicle"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  // 뒤로 가기 함수
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  useEffect(() => {
    loadHistory();
  }, [userId]);

  useEffect(() => {
    applyFilter();
  }, [history, filterType, selectedDate, selectedVehicle]);

  const loadHistory = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const userHistory = users[userId]?.history || [];

    if (userHistory.length === 0) {
      const sampleHistory = [
        {
          id: "1",
          plateNumber: "12가3456",
          date: "2025-11-28",
          services: ["주차", "세차"],
          payment: 15000,
        },
        {
          id: "2",
          plateNumber: "78나9012",
          date: "2025-11-25",
          services: ["주차", "세차", "정비"],
          payment: 85000,
        },
        { id: "3", plateNumber: "12가3456", date: "2025-11-20", services: ["주차"], payment: 5000 },
      ];
      users[userId] = { history: sampleHistory };
      localStorage.setItem("users", JSON.stringify(users));
      setHistory(sampleHistory);
    } else {
      setHistory(userHistory);
    }

    const vehicles = Array.from(new Set(userHistory.map((item) => item.plateNumber)));
    setAvailableVehicles(vehicles);

    const dates = Array.from(new Set(userHistory.map((item) => item.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    setAvailableDates(dates);
  };

  const applyFilter = () => {
    let filtered = [...history];

    if (filterType === "date" && selectedDate) {
      filtered = filtered.filter((item) => item.date === selectedDate);
    } else if (filterType === "vehicle" && selectedVehicle) {
      filtered = filtered.filter((item) => item.plateNumber === selectedVehicle);
    }

    setFilteredHistory(filtered);
  };

  const resetFilter = () => {
    setFilterType("all");
    setSelectedDate("");
    setSelectedVehicle("");
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

      {/* 필터 */}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <button
            onClick={() => setFilterType("date")}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: filterType === "date" ? "#3b82f6" : "#fff",
              color: filterType === "date" ? "#fff" : "#000",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            날짜별 조회
          </button>
          <button
            onClick={() => setFilterType("vehicle")}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: filterType === "vehicle" ? "#3b82f6" : "#fff",
              color: filterType === "vehicle" ? "#fff" : "#000",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            차량별 조회
          </button>
          <button
            onClick={resetFilter}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#f3f4f6",
              color: "#000",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          >
            전체보기
          </button>
        </div>

        {filterType === "date" && (
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="">날짜를 선택하세요</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        )}

        {filterType === "vehicle" && (
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          >
            <option value="">차량을 선택하세요</option>
            {availableVehicles.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 내역 */}
      {filteredHistory.length === 0 ? (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          {history.length === 0 ? "이용 내역이 없습니다." : "조회 결과가 없습니다."}
        </div>
      ) : (
        filteredHistory.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginBottom: "12px",
              padding: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>{item.plateNumber}</span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>{item.date}</span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                이용 서비스
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {item.services.map((service, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "2px 8px",
                      backgroundColor: "#bfdbfe",
                      color: "#1d4ed8",
                      borderRadius: "9999px",
                      fontSize: "12px",
                    }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "4px",
                color: "#4b5563",
              }}
            >
              <span>결제 금액</span>
              <span>{item.payment.toLocaleString()}원</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
