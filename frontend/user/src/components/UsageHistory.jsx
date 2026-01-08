import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServiceHistory } from "../api/serviceApi";
import "../style/UsageHistory.css";
import UserHeader from "./UserHeader";

export function UsageHistory({ isLogin }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "all" | "date" | "vehicle"
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [userId, setUserId] = useState("");

  // 뒤로 가기 함수
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
      loadHistory(id);
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    applyFilter();
  }, [history, filterType, selectedDate, selectedVehicle]);

  const loadHistory = async (id) => {
    try {
      const data = await fetchServiceHistory(id);
      const mapped = data.map((item, idx) => ({
        id: `${idx}`,
        workId: item.id, // 백엔드에서 id 필드로 반환됨
        plateNumber: item.carNumber,
        date: (item.createdAt || "").slice(0, 10),
        services: item.services || [],
        payment: item.totalFee ?? 0,
      }));
      setHistory(mapped);
      const vehicles = Array.from(new Set(mapped.map((item) => item.plateNumber)));
      setAvailableVehicles(vehicles);
      const dates = Array.from(new Set(mapped.map((item) => item.date))).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      setAvailableDates(dates);
    } catch (e) {
      alert("이용 내역을 불러오지 못했습니다.");
    }
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
      <UserHeader label="로그인 사용자" value={userId} onBack={handleBack} backText="< 뒤로" />

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
              <span>청구요금</span>
              <span style={{ fontWeight: "bold" }}>
                {typeof item.payment === "number" ? item.payment.toLocaleString() : item.payment}원
              </span>
            </div>
          </div>
        ))
      )}

    </div>
  );
}
