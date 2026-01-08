// React 및 스타일
import { useEffect, useState } from "react";
import "../style/EntranceExitSection.css";
// MQTT 훅
import useMqtt from "../hook/useMqtt";
import {
  getTodayEntry,
  getTodayExit,
  getCurrentEntranceCar,
  approveEntrance,
} from "../../api/EntranceAPI";
// 입출구 섹션 페이지
export default function EntranceExitSection() {
  const { connectStatus, imageSrc, capturedImage, publish } = useMqtt();
  // 입출구 섹션 상태
  const [currentCar, setCurrentCar] = useState(null); // 입구 대기 차량
  const [parkingList, setParkingList] = useState([]); // 현재 주차 중
  const [exitList, setExitList] = useState([]); // 출차 완료

  /// 데이터 로딩 함수 분리
  const loadParking = async () => {
    const entry = await getTodayEntry();
    setParkingList(entry.filter((car) => !car.exitTime));
  };
  // 출차 기록 로딩
  const loadExit = async () => {
    const exit = await getTodayExit();
    setExitList(exit);
  };
  // 현재 입구 대기 차량 로딩
  const loadCurrentEntrance = async () => {
    try {
      const car = await getCurrentEntranceCar(1); // nodeId = 1 (입구)
      setCurrentCar(car);
    } catch (e) {
      setCurrentCar(null);
      throw e;
    }
  };
  // 모든 데이터 로딩
  const loadAll = async () => {
    await Promise.all([loadParking(), loadExit(), loadCurrentEntrance()]);
  };

  //초기 로딩
  useEffect(() => {
    const init = async () => {
      await loadAll();
    };
    init();
  }, []);

  // MQTT 연결 상태에 따른 CCTV 제어
  useEffect(() => {
    if (connectStatus === "connected") {
      publish("parking/web/entrance/cam/control", "start");
    }
    return () => {
      publish("parking/web/entrance/cam/control", "stop");
    };
  }, [publish, connectStatus]);

  // 입차 승인 처리
  const handleApprove = async () => {
    if (!currentCar) return;

    try {
      // 승인 처리 (상태 변경용)
      await approveEntrance(currentCar.workId);

      // 차단기 OPEN
      publish("parking/web/entrance/approve", "open");

      // 화면 갱신
      await Promise.all([loadParking(), loadExit()]);

      // 입구 차량 제거
      setCurrentCar(null);
    } catch (e) {
      alert("입차 승인 실패");
    }
  };
  // 렌더링
  return (
    <div className="entrance-exit-section">
      <h2>구역 관리 : 입출구</h2>
      <p className="sub-title">실시간 모니터링 및 관리</p>

      {/* ================= 상단 ================= */}
      <div className="top-grid">
        {/* CCTV */}
        <div className="card cctv-card">
          {imageSrc ? (
            <img src={imageSrc} alt="CCTV" />
          ) : (
            <div className="cctv-placeholder">📹 CCTV 대기중</div>
          )}
        </div>

        {/* 현재 입구 차량 */}
        <div className="card current-car-card">
          <h3>현재 입구 차량</h3>

          {currentCar ? (
            <>
              <p>
                <strong>차량 번호:</strong> {currentCar.carNumber}
              </p>

              <p>
                <strong>요청 시간:</strong>{" "}
                {currentCar.requestTime ? new Date(currentCar.requestTime).toLocaleString() : "-"}
              </p>

              <button className="approve-btn" onClick={handleApprove}>
                입차 승인
              </button>
            </>
          ) : (
            <p className="placeholder">현재 입구 대기 차량 없음</p>
          )}
        </div>
      </div>

      {/* ================= 하단 ================= */}
      <div className="bottom-grid">
        {/* 현재 주차 차량 */}
        <div className="card">
          <h3>현재 입차 차량</h3>

          {parkingList.length === 0 ? (
            <p className="placeholder">입차 중인 차량 없음</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>차량 번호</th>
                  <th>입차 시간</th>
                </tr>
              </thead>
              <tbody>
                {parkingList.map((row) => (
                  <tr key={row.workId}>
                    <td>{row.carNumber}</td>
                    <td>{row.entryTime ? new Date(row.entryTime).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 출차 기록 */}
        <div className="card">
          <h3>출차 차량 기록</h3>

          {exitList.length === 0 ? (
            <p className="placeholder">출차 기록 없음</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>차량 번호</th>
                  <th>출차 시간</th>
                </tr>
              </thead>
              <tbody>
                {exitList.map((row) => (
                  <tr key={row.workId}>
                    <td>{row.carNumber}</td>
                    <td>{row.exitTime ? new Date(row.exitTime).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
