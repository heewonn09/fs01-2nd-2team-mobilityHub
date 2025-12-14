import "./RecentEntranceCard.css";

export default function RecentEntranceCard({ data, onEdit, onApprove }) {
  if (!data) return <p>최근 인식 데이터 없음</p>;

  return (
    <div className="recent-card">
      <h4>최근 인식 번호판</h4>

      <div className="recent-image">
        <img src={data.imagePath} alt="번호판 이미지" />
      </div>

      <div className="recent-info">
        <p>
          <strong>OCR 번호:</strong> {data.ocrNumber}
        </p>
        <p>
          <strong>등록 번호:</strong> {data.registeredCarNumber ?? "미등록"}
        </p>

        {/* ✅ / ❌ 일치 여부 */}
        {data.match ? (
          <span className="badge badge-match">✔ 일치</span>
        ) : (
          <span className="badge badge-mismatch">✖ 불일치</span>
        )}

        <p className="time">시간: {data.time}</p>
        <p>카메라 ID: {data.cameraId}</p>
      </div>

      {/* 🔥 버튼 영역 */}
      <div className="recent-actions">
        {!data.match && (
          <button className="btn-edit" onClick={() => onEdit(data)}>
            번호판 수정
          </button>
        )}

        <button
          className="btn-approve"
          disabled={!data.match}
          onClick={() => onApprove(data.workId)}
        >
          입차 승인
        </button>
      </div>
    </div>
  );
}
