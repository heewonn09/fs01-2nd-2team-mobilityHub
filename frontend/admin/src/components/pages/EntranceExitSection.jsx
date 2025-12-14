import "../style/EntranceExitSection.css";
import { useEffect, useState } from "react";
import LicenseModal from "./LicenseModal";
import { getTodayEntry, getTodayExit, getLatestEntrance } from "../../api/EntranceAPI";

export default function EntranceExitSection() {
  const [entryList, setEntryList] = useState([]);
  const [exitList, setExitList] = useState([]);
  const [latest, setLatest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAll = async () => {
    try {
      const [entry, exit, latestRes] = await Promise.all([
        getTodayEntry(),
        getTodayExit(),
        getLatestEntrance(),
      ]);
      setEntryList(entry);
      setExitList(exit);
      setLatest(latestRes);
    } catch (e) {
      console.error("입출차 데이터 로딩 실패", e);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="entrance-page">
      {/* ===== 헤더 ===== */}

      {/* ================= 요약 카드 ================= */}
      <div className="summary-grid">
        <div className="summary-card">
          <p className="summary-title">금일 입차</p>
          <p className="summary-value">{entryList.length}대</p>
        </div>

        <div className="summary-card">
          <p className="summary-title">금일 출차</p>
          <p className="summary-value">{exitList.length}대</p>
        </div>
      </div>

      {/* ===== CCTV + 최근 인식 ===== */}
      <div className="top-grid">
        {/* CCTV */}
        <div className="card cctv-card">
          <h4>입구 CCTV</h4>
          <div className="cctv-box">
            <img src="http://192.168.14.124:8080/stream" alt="입구 CCTV" className="cctv-stream" />
            <div className="cctv-placeholder">카메라 연결 대기중</div>
          </div>
        </div>

        {/* 최근 인식 번호판 */}
        <div className="card recent-card">
          <h4>최근 인식 번호판</h4>

          {!latest ? (
            <p className="empty-text">아직 인식된 차량 없음</p>
          ) : (
            <>
              <img src={latest.imagePath} alt="번호판" className="plate-image" />

              <p>
                OCR 번호: <strong>{latest.ocrNumber}</strong>
              </p>
              <p>
                수정 번호: <strong>{latest.correctedOcrNumber || "-"}</strong>
              </p>
              <p>
                등록 차량: <strong>{latest.registeredCarNumber || "미등록"}</strong>
              </p>

              {/* 일치 여부 */}
              <div className="match-row">
                {latest.match ? (
                  <span className="badge-match">일치</span>
                ) : (
                  <span className="badge-mismatch">불일치</span>
                )}
              </div>

              {/* 버튼 */}
              <div className="action-row">
                {!latest.match && (
                  <button className="btn-edit" onClick={() => setModalOpen(true)}>
                    번호판 수정
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== 입차 / 출차 ===== */}
      <div className="bottom-grid">
        <div className="card table-card">
          <h4>입차 차량 기록</h4>
          <table>
            <thead>
              <tr>
                <th>차량번호</th>
                <th>시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {entryList.map((e) => (
                <tr key={e.id}>
                  <td>{e.carNumber}</td>
                  <td>{format(e.entryTime)}</td>
                  <td>입차</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card table-card">
          <h4>출차 차량 기록</h4>
          <table>
            <thead>
              <tr>
                <th>차량번호</th>
                <th>시간</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {exitList.map((e) => (
                <tr key={e.id}>
                  <td>{e.carNumber}</td>
                  <td>{format(e.exitTime)}</td>
                  <td>출차</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 번호판 수정 모달 ===== */}
      {modalOpen && latest && (
        <LicenseModal
          imageId={latest.imageId}
          initialValue={latest.correctedOcrNumber || latest.ocrNumber}
          onClose={() => setModalOpen(false)}
          onUpdated={async () => {
            setModalOpen(false);
            await loadAll();
          }}
        />
      )}
    </div>
  );
}

function format(time) {
  return time ? new Date(time).toLocaleString() : "-";
}
