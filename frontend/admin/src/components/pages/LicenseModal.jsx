import "../style/LicenseModal.css";
import { useState } from "react";
import { updateOcrNumber } from "../../api/EntranceAPI";

export default function LicenseModal({ imageId, initialValue, onClose, onUpdated }) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateOcrNumber(imageId, value);
      await onUpdated();
    } catch (e) {
      alert("번호판 수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>번호판 수정</h3>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="차량 번호 입력"
        />

        <div className="modal-actions">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit} disabled={loading}>
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
}
