import "../style/EntranceExitSection.css";
import { useState, useEffect } from "react";
import LicenseModal from "./LicenseModal.jsx";
import { getTodayEntry, getTodayExit } from "../../api/EntranceAPI.js";

export default function EntranceExitSection() {
  const [modalData, setModalData] = useState(null);
  const [entryList, setEntryList] = useState([]);
  const [exitList, setExitList] = useState([]);

  const loadData = async () => {
    const entry = await getTodayEntry();
    const exit = await getTodayExit();

    setEntryList(entry);
    setExitList(exit);
  };
  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    loadData();
  }, []);

  // 보기 버튼 클릭 → 모달 띄우기
  const openModal = (item, type) => {
    setModalData({
      carNumber: item.carNumber,
      time: type === "입차" ? item.entryTime : item.exitTime,
      type: type,
      image: item.imagePath,
    });
  };

  const closeModal = () => setModalData(null);

  return (
    <div className="section-container">
      {/* ======================= 상단 요약 ======================= */}
      <div className="summary-grid">
        <div className="summary-card">
          <p className="summary-title">금일 입차</p>
          <p className="summary-value">{entryList.length}대</p>
          <div className="summary-icon green-icon">🚗</div>
        </div>

        <div className="summary-card">
          <p className="summary-title">금일 출차</p>
          <p className="summary-value">{exitList.length}대</p>
          <div className="summary-icon blue-icon">🚙</div>
        </div>

        <div className="summary-card">
          <p className="summary-title">현재 주차</p>
          <p className="summary-value">0대</p>
          <div className="summary-icon purple-icon">🚘</div>
        </div>
      </div>

      {/* ======================= 입차 테이블 ======================= */}
      <div className="table-card">
        <h3 className="table-title">입차 차량 기록</h3>

        <table className="record-table">
          <thead>
            <tr>
              <th>차량번호</th>
              <th>시간</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>

          <tbody>
            {entryList.map((item) => (
              <tr key={item.id}>
                <td className="cell-green">{item.carNumber || "번호 없음"}</td>
                <td className="cell-green">{item.entryTime}</td>
                <td className="cell-green">
                  {item.carState === "WAIT" ? (
                    <span className="badge-wait">대기</span>
                  ) : (
                    <span className="badge-complete">완료</span>
                  )}
                </td>

                <td>
                  <button className="btn-view" onClick={() => openModal(item, "입차")}>
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======================= 출차 테이블 ======================= */}
      <div className="table-card">
        <h3 className="table-title">출차 차량 기록</h3>

        <table className="record-table">
          <thead>
            <tr>
              <th>차량번호</th>
              <th>시간</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>

          <tbody>
            {exitList.map((item) => (
              <tr key={item.id}>
                <td className="cell-green">{item.carNumber}</td>
                <td className="cell-green">{item.exitTime}</td>
                <td className="cell-green">
                  {item.carState === "WAIT" ? (
                    <span className="badge-wait">대기</span>
                  ) : (
                    <span className="badge-complete">완료</span>
                  )}
                </td>
                <td>
                  <button className="btn-view" onClick={() => openModal(item, "출차")}>
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalData && <LicenseModal onClose={closeModal} data={modalData} />}
    </div>
  );
}
