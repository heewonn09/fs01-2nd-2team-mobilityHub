import "../style/LicenseModal.css";
import { useState } from "react";
import { updateOcrNumber } from "../../api/EntranceAPI";

export default function LicenseModal({ imageId, initialValue, onClose, onUpdated }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = async () => {
    await updateOcrNumber(imageId, value);
    await onUpdated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>번호판 수정</h3>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="modal-actions">
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>수정 완료</button>
        </div>
      </div>
    </div>
  );
}
