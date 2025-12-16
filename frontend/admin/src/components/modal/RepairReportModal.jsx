import { useEffect, useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import "../style/RepairReportModal.css";
import { sendComplete, writeReport } from "../../api/repairAPI";

export default function RepairReportModal({ onClose, data, refreshStockList }) {
  const [comment, setComment] = useState("");
  const [repairDescription, setRepairDescription] = useState("");
  const [usedParts, setUsedParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [formData, setFormData] = useState({
    repairTitle: "",
    repairDetail: "",
    repairAmount: 0,
  });

  useEffect(() => {
    if (!data) return;

    if (Array.isArray(data)) {
      setReportData(data[0] ?? null);
    } else {
      setReportData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (reportData) => {
    console.log(reportData);

    try {
      const completeResponse = await sendComplete(reportData);

      if (completeResponse.status === 200) {
        console.log("작업 완료 신호 전송 성공");
      }
    } catch (error) {
      console.error("전송 실패:", error);
      alert("완료 신호 전송 실패");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const isEmptyField = Object.values(formData).some((value) => value === "" || value == null || value == undefined);

    if (isEmptyField) {
      alert("모든 항목을 입력해주세요.");
    }

    const requestBody = {
      userCarId: reportData.userCarId,
      carNumber: reportData.car_number,
      repairTitle: formData.repairTitle,
      repairDetail: formData.repairDetail,
      repairAmount: Number(calculateTotal()),
    };

    const workInfoId = reportData.id;

    try {
      const response = await writeReport(requestBody);

      if (response.status === 200) {
        alert("보고서 작성이 완료되었습니다.");

        await handleSubmit(workInfoId);

        await refreshStockList();
        onClose();
      }
      return response;
    } catch (error) {
      console.error("보고서 작성 실패: ", error);
      alert("보고서 작성 실패");
    }
    console.log(workInfoId);
  };

  console.log(reportData);

  const calculateTotal = () => {
    let total = 60000 + Number(formData.repairAmount);
    usedParts.forEach((up) => {
      total += up.part.price * up.quantity;
    });
    return total;
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="modal-overlay">
      {reportData && (
        <div className="modal-content">
          {/* 헤더 */}
          <div className="modal-header">
            <div>
              <h2>정비 완료 보고서</h2>
            </div>
            <p>차량번호: {reportData.car_number}</p>
            <button className="modal-close-btn" onClick={onClose}>
              <X className="icon" />
            </button>
          </div>

          {/* 바디 */}
          <div className="modal-body">
            {/* 추가 요청사항 */}
            <div className="section">
              <h3>추가 요청사항</h3>
              <div className="section-content">
                <div className="item-box">{reportData.additionalRequest}</div>
              </div>
            </div>

            {/* 수리 내용 */}
            <div className="section">
              <h3>수리 내용</h3>
              <textarea
                name="repairTitle"
                value={formData.repairTitle}
                onChange={handleChange}
                placeholder="수리한 내용을 입력하세요..."
              />
            </div>

            {/* 상세 내용 */}
            <div className="section">
              <h3>상세 내용</h3>
              <textarea
                name="repairDetail"
                value={formData.repairDetail}
                onChange={handleChange}
                placeholder="상세 내용..."
              />
            </div>
            <div className="section">
              <h3>정비 금액</h3>
              <div>
                <span>기본금액 : 60000</span>

                <div>
                  <span>추가금액 : </span>
                  <input type="number" name="repairAmount" value={formData.repairAmount} onChange={handleChange} />
                </div>
              </div>
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
              <button className="btn-submit" onClick={handleCreate}>
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
