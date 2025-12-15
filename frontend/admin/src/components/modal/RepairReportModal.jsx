import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import "../style/RepairReportModal.css";

export default function RepairReportModal({ onClose, onSubmit, data }) {
  const [comment, setComment] = useState("");
  const [repairDescription, setRepairDescription] = useState("");
  const [usedParts, setUsedParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [reportData, setReportData] = useState(null);

  const BASE_PRICE = 50000;
  const ADDITIONAL_PRICE = 10000;

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setReportData(data[0]);
    }
  }, [data]);

  console.log(reportData);

  const addUsedPart = () => {
    if (!selectedPartId) return;
    // const part = parts.find((p) => p.id === selectedPartId);

    const existingIndex = usedParts.findIndex(
      (up) => up.part.id === selectedPartId
    );

    if (existingIndex !== -1) {
      const newUsedParts = [...usedParts];
      newUsedParts[existingIndex].quantity += 1;
      setUsedParts(newUsedParts);
    }
    setSelectedPartId("");
  };

  const removeUsedPart = (index) => {
    setUsedParts(usedParts.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return;
    const newUsedParts = [...usedParts];
    newUsedParts[index].quantity = quantity;
    setUsedParts(newUsedParts);
  };

  const calculateTotal = () => {
    let total = BASE_PRICE + ADDITIONAL_PRICE;
    usedParts.forEach((up) => {
      total += up.part.price * up.quantity;
    });
    return total;
  };

  const handleSubmit = () => {
    onSubmit(usedParts);
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 헤더 */}
        <div className="modal-header">
          <div>
            <h2>정비 완료 보고서</h2>
            {reportData && <p>차량번호: {reportData.car_number}</p>}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        {/* 바디 */}
        <div className="modal-body">
          {/* 추가 요청사항 */}
          {/* {additionalRequests.length > 0 && (
            <div className="section">
              <h3>추가 요청사항</h3>
              <div className="section-content">
                {additionalRequests.map((req) => (
                  <div key={req.id} className="item-box">
                    {req.request}
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* 수리 내용 */}
          <div className="section">
            <h3>수리 내용</h3>
            <textarea
              value={repairDescription}
              onChange={(e) => setRepairDescription(e.target.value)}
              placeholder="수리한 내용을 입력하세요..."
            />
          </div>

          {/* 사용한 부품 */}
          <div className="section">
            <h3>사용한 부품</h3>
            {/* <div className="flex-row">
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
              >
                <option value="">부품을 선택하세요</option>
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.name} ({part.price}원/{part.unit})
                  </option>
                ))}
              </select>
              <button
                className="btn-add"
                onClick={addUsedPart}
                disabled={!selectedPartId}
              >
                <Plus className="icon" />
              </button>
            </div> */}

            {usedParts.length > 0 && (
              <div className="used-parts-list">
                {usedParts.map((up, index) => (
                  <div key={index} className="used-part-item">
                    <span>{up.part.name}</span>
                    <div className="flex-row">
                      <input
                        type="number"
                        min="1"
                        value={up.quantity}
                        onChange={(e) =>
                          updateQuantity(index, parseInt(e.target.value) || 1)
                        }
                      />
                      <span>{up.part.unit}</span>
                      <span>{up.part.price * up.quantity}원</span>
                      <button onClick={() => removeUsedPart(index)}>
                        <Minus className="icon red" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 관리자 코멘트 */}
          <div className="section">
            <h3>관리자 코멘트</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="코멘트를 입력하세요..."
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="modal-footer">
          <span>정비한 날짜: {today}</span>
          <span>총 금액: {calculateTotal()}원</span>
          <div className="flex-row gap">
            <button className="btn-cancel" onClick={onClose}>
              취소
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
