import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useMqtt from "../hook/useMqtt";
import RegisteredCarSection from "./RegisteredCarSection";
import "../style/EntranceExitSection.css";

const API_BASE = "http://localhost:9000";
const MQTT_BROKER = "ws://192.168.137.1:9001";
const PAGE_SIZE = 6;

export default function EntranceExitSection() {
  /* ================= 상태 ================= */
  const [todayEntry, setTodayEntry] = useState([]);
  const [todayExit, setTodayExit] = useState([]);
  const [entryPage, setEntryPage] = useState(1);
  const [exitPage, setExitPage] = useState(1);

  /* ================= MQTT ================= */
  const { imageSrc, capturedImage, publish } = useMqtt(MQTT_BROKER);

  /* ================= Canvas Ref ================= */
  const canvasRef = useRef(null);

  /* ================= 초기 로딩 ================= */
  useEffect(() => {
    loadAll();
  }, []);

  /* ================= CCTV 시작 / 종료 ================= */
  useEffect(() => {
    publish("parking/web/entrance/cam", "start");
    return () => publish("parking/web/entrance/cam", "stop");
  }, [publish]);

  const loadAll = async () => {
    try {
      const [entryRes, exitRes] = await Promise.all([
        axios.get(`${API_BASE}/entrance/today/entry`),
        axios.get(`${API_BASE}/entrance/today/exit`),
      ]);

      setTodayEntry(entryRes.data);
      setTodayExit(exitRes.data);
    } catch (e) {
      console.error("입출구 데이터 로딩 실패", e);
    }
  };

  /* ================= 페이지네이션 ================= */
  const paginate = (list, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  };

  /* ================= 입차 승인 ================= */
  const handleApprove = async (workId) => {
    try {
      await axios.post(`${API_BASE}/entrance/${workId}/approve`);
      await loadAll();
    } catch (e) {
      console.error("입차 승인 실패", e);
      alert("입차 승인 실패");
    }
  };

  return (
    <div className="entrance-page">
      {/* ================= 요약 ================= */}
      <div className="summary-grid">
        <div className="summary-card entry">
          <p className="summary-title">금일 입차</p>
          <p className="summary-count">{todayEntry.length}대</p>
        </div>

        <div className="summary-card exit">
          <p className="summary-title">금일 출차</p>
          <p className="summary-count">{todayExit.length}대</p>
        </div>
      </div>

      {/* ================= CCTV ================= */}
      <div className="top-grid">
        <div className="card cctv-box">
          {imageSrc ? (
            <img src={imageSrc} alt="cctv" className="cctv-image" />
          ) : (
            <div className="cctv-placeholder">📺 CCTV 대기중</div>
          )}
        </div>

        <div className="card cctv-box">
          {capturedImage ? (
            <img src={capturedImage} alt="capture" className="cctv-image" />
          ) : (
            <div className="cctv-placeholder">📸 캡처 이미지 없음</div>
          )}

          <button className="btn-capture" onClick={() => publish("parking/web/entrance", "comeIn")}>
            캡처
          </button>
        </div>
      </div>

      {/* ================= 등록 차량 리스트 ================= */}
      <RegisteredCarSection />

      {/* ================= 입차 / 출차 기록 ================= */}
      <div className="record-grid">
        <RecordTable
          title="입차 차량 기록"
          data={paginate(todayEntry, entryPage)}
          page={entryPage}
          total={todayEntry.length}
          onPageChange={setEntryPage}
          onApprove={handleApprove}
          type="entry"
        />

        <RecordTable
          title="출차 차량 기록"
          data={paginate(todayExit, exitPage)}
          page={exitPage}
          total={todayExit.length}
          onPageChange={setExitPage}
          type="exit"
        />
      </div>
    </div>
  );
}

/* ================= 테이블 ================= */

function RecordTable({ title, data, page, total, onPageChange, onApprove, type }) {
  const totalPage = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="card record-card">
      <h3>{title}</h3>

      <table>
        <thead>
          <tr>
            <th>번호판</th>
            <th>시간</th>
            <th>상태</th>
            {type === "entry" && <th>승인</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4">기록 없음</td>
            </tr>
          ) : (
            data.map((v) => (
              <tr key={v.id}>
                <td>{v.carNumber || "미확인"}</td>
                <td>{new Date(v.entryTime || v.exitTime).toLocaleString()}</td>
                <td>{type === "exit" ? "출차 완료" : "대기"}</td>
                {type === "entry" && (
                  <td>
                    <button onClick={() => onApprove(v.id)}>입차 승인</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPage > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
            ◀
          </button>
          <span>
            {page} / {totalPage}
          </span>
          <button disabled={page === totalPage} onClick={() => onPageChange(page + 1)}>
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
