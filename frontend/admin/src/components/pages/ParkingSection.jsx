import React, { useEffect, useState } from "react";
import "../style/ParkingSection.css";
import { Car, CheckCircle, XCircle } from "lucide-react";
import { getParkingList } from "../../api/parkingAPI";
import useMqtt from "../hook/useMqtt";

// 라즈베리파이 카메라 URL
const CAMERA_STREAM_URL = "http://192.168.14.125:5000/video_feed";

export default function ParkingSection() {
  const BROKER_URL = import.meta.env.VITE_BROKER_URL || "ws://localhost:8080/mqtt";
  console.log("브로커:", BROKER_URL);

  // 상태 관리
  const [parkingSpots, setParkingSpots] = useState([]);
  const [stats, setStats] = useState({
    totalSpots: 0,
    occupiedSpots: 0,
    availableSpots: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MQTT 연결
  const { connectStatus, imageSrc, publish } = useMqtt(BROKER_URL);

  // MQTT 카메라 시작
  useEffect(() => {
    if (connectStatus === "connected") {
      console.log("MQTT 연결됨, 카메라 요청 시작");
      publish("parking/web/parking/cam", "start");
    }
  }, [connectStatus, publish]);

  // DB에서 주차 데이터 가져오기 (3초마다 갱신)
  useEffect(() => {
    fetchParkingData();
    const interval = setInterval(fetchParkingData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchParkingData = async () => {
    try {
      console.log("주차 데이터 조회 시작...");
      const data = await getParkingList();
      console.log("DB 데이터:", data);

      if (!data || data.length === 0) {
        console.warn("DB 데이터가 없음");
        setError("DB 데이터를 불러올 수 없습니다.");
        setLoading(false);
        return;
      }

      // DB 데이터로 화면 업데이트 (P로 시작하는 주차면만 필터링)
      const parkingData = data.filter((item) => item.sectorId && item.sectorId.startsWith("P"));
      updateParkingDisplay(parkingData);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("주차 현황 조회 오류:", err);
      setError("데이터를 불러올 수 없습니다.");
      setLoading(false);
    }
  };

  const updateParkingDisplay = (data) => {
    // DB 데이터를 화면용 포맷으로 변환
    const formattedSpots = data.map((spot) => ({
      id: spot.sectorId,
      spotNumber: spot.sectorName,
      status: spot.state === "empty" ? "사용가능" : "사용중",
      statusColor: spot.state === "empty" ? "green" : "red",
    }));

    setParkingSpots(formattedSpots);

    // 통계 계산
    const totalSpots = data.length;
    const occupiedSpots = data.filter((spot) => spot.state !== "empty").length;
    const availableSpots = totalSpots - occupiedSpots;
    const occupancyRate = totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;

    setStats({
      totalSpots,
      occupiedSpots,
      availableSpots,
      occupancyRate,
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div style={{ textAlign: "center", padding: "20px" }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 에러 메시지 */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-4 gap-6">
        {/* 전체 주차면 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">전체 주차면</p>
              <p className="text-gray-900 text-2xl font-semibold mt-2">{stats.totalSpots}면</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* 사용중 주차면 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">사용중</p>
              <p className="text-red-600 text-2xl font-semibold mt-2">{stats.occupiedSpots}대</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* 사용 가능 주차면 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">사용가능</p>
              <p className="text-green-600 text-2xl font-semibold mt-2">{stats.availableSpots}면</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 점유율 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">점유율</p>
              <p className="text-blue-600 text-2xl font-semibold mt-2">{stats.occupancyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CCTV와 주차 현황 표시 영역 */}
      <div className="grid grid-cols-3 gap-6">
        {/* CCTV 화면 (col-span-2) */}
        <div className="col-span-2">
          <div className="cctv-container">
            <div className="cctv-header">주차장 카메라</div>
            <div className="cctv-feed">
              <img
                src={CAMERA_STREAM_URL}
                alt="주차장 카메라"
                className="cctv-image"
                onError={(e) => console.error("카메라 로드 실패:", e)}
              />
            </div>
          </div>
        </div>

        {/* 주차 공간 리스트 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="parking-list-header">
            <h3 className="parking-list-title">주차 공간 현황</h3>
          </div>

          <div className="parking-list-content">
            {parkingSpots.length === 0 ? (
              <p className="no-data">주차 정보가 없습니다.</p>
            ) : (
              parkingSpots.map((spot) => (
                <div
                  key={spot.id}
                  className={`parking-spot-card ${
                    spot.statusColor === "green"
                      ? "parking-spot-available"
                      : "parking-spot-occupied"
                  }`}
                >
                  {/* 주차면 번호 및 상태 */}
                  <div className="parking-spot-header">
                    <div className="parking-spot-info">
                      <Car
                        className={`spot-icon ${
                          spot.statusColor === "green" ? "text-green-600" : "text-red-600"
                        }`}
                      />
                      <span
                        className={`spot-number ${
                          spot.statusColor === "green" ? "text-green-900" : "text-red-900"
                        }`}
                      >
                        {spot.spotNumber}
                      </span>
                    </div>

                    <span
                      className={`status-badge ${
                        spot.statusColor === "green"
                          ? "status-badge-available"
                          : "status-badge-occupied"
                      }`}
                    >
                      {spot.status}
                    </span>
                  </div>

                  {/* 사용 가능 메시지 */}
                  {spot.statusColor === "green" && <p className="available-message">주차 가능</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
