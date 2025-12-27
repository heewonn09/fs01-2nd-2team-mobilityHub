import { useEffect, useState } from "react";
import axios from "axios";
import LicenseModal from "./LicenseModal";
import useMqtt from "../hook/useMqtt.js";
import "../style/EntranceExitSection.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:9000";
const MQTT_BROKER = "ws://localhost:9001";
const PAGE_SIZE = 6;

export default function EntranceExitSection() {
  const navigation = useNavigate();

  /* ================= 상태 ================= */
  const [latest, setLatest] = useState(null);
  const [latestImage, setLatestImage] = useState(null);

  const [todayEntry, setTodayEntry] = useState([]);
  const [todayExit, setTodayExit] = useState([]);

  const [entryPage, setEntryPage] = useState(1);
  const [exitPage, setExitPage] = useState(1);

  const [modalData, setModalData] = useState(null);

  /* ================= MQTT ================= */
  const { imageSrc, capturedImage, publish } = useMqtt(MQTT_BROKER);

  /* ================= 초기 로딩 ================= */
  useEffect(() => {
    loadAll();
  }, []);

  /* ================= CCTV 시작 / 종료 ================= */
  useEffect(() => {
    // ✅ 페이지 진입 → CCTV 스트리밍 시작
    publish("parking/web/entrance/cam", "start");

    return () => {
      // ✅ 페이지 나갈 때 → CCTV 스트리밍 중지
      publish("parking/web/entrance/cam", "stop");
    };
  }, [publish]);

  const loadAll = async () => {
    try {
      const [latestRes, entryRes, exitRes, imageRes] = await Promise.all([
        axios.get(`${API_BASE}/entrance/latest`),
        axios.get(`${API_BASE}/entrance/today/entry`),
        axios.get(`${API_BASE}/entrance/today/exit`),
        axios.get(`${API_BASE}/entrance/latest_image`),
      ]);

      setLatest(latestRes.data);
      setTodayEntry(entryRes.data);
      setTodayExit(exitRes.data);
      setLatestImage(imageRes.data);
    } catch (e) {
      console.error("입출구 데이터 로딩 실패", e);
    }
  };

  /* ================= 페이지네이션 ================= */
  const paginate = (list, page) => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
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

      {/* ================= CCTV / 캡처 ================= */}
      <div className="top-grid">
        {/* 실시간 CCTV */}
        <div className="card cctv-box">
          {imageSrc ? (
            <img src={imageSrc} alt="cctv" className="cctv-image" />
          ) : (
            <div className="cctv-placeholder">📺 CCTV 대기중</div>
          )}
        </div>

        {/* 캡처 이미지 */}
        <div className="card cctv-box">
          {capturedImage ? (
            <img src={capturedImage} alt="capture" className="cctv-image" />
          ) : (
            <div className="cctv-placeholder">📸 캡처 이미지 없음</div>
          )}

          {/* 캡처 트리거 */}
          <button
            className="btn-capture"
            onClick={() => publish("parking/web/entrance", "comeIn")}
          >
            캡처
          </button>
        </div>

        {/* 최근 인식 정보 */}
        <div className="card recent-card">
          <h3>최근 인식 번호판</h3>

          {!latestImage ? (
            <p className="empty-text">대기중</p>
          ) : (
            <>
              <p>
                번호판 :{" "}
                <span className="plate-error">
                  {latestImage.correctedOcrNumber ||
                    latestImage.ocrNumber ||
                    "미인식"}
                </span>
              </p>
              <p>카메라 : {latestImage.cameraId}</p>
              <p>{new Date(latestImage.regDate).toLocaleString()}</p>
            </>
          )}
        </div>
      </div>

      {/* ================= 입차 / 출차 ================= */}
      <div className="record-grid">
        <RecordTable
          title="입차 차량 기록"
          data={paginate(todayEntry, entryPage)}
          page={entryPage}
          total={todayEntry.length}
          onPageChange={setEntryPage}
          onClickPlate={setModalData}
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

      {modalData && (
        <LicenseModal
          data={modalData}
          onClose={() => setModalData(null)}
          onSuccess={loadAll}
        />
      )}
    </div>
  );
}

/* ================= 하위 컴포넌트 ================= */

function RecordTable({
  title,
  data,
  page,
  total,
  onPageChange,
  onClickPlate,
  type,
}) {
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
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="empty-row">
                기록 없음
              </td>
            </tr>
          ) : (
            data.map((v) => (
              <tr key={v.id}>
                <td
                  className={v.carNumber ? "plate-ok" : "plate-error"}
                  onClick={() => onClickPlate && onClickPlate(v)}
                >
                  {v.carNumber || "미확인"}
                </td>
                <td>
                  {new Date(
                    type === "entry" ? v.entryTime : v.exitTime
                  ).toLocaleString()}
                </td>
                <td>
                  {type === "exit"
                    ? "출차 완료"
                    : v.carNumber
                    ? "정상"
                    : "확인 필요"}
                </td>
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
          <button
            disabled={page === totalPage}
            onClick={() => onPageChange(page + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
