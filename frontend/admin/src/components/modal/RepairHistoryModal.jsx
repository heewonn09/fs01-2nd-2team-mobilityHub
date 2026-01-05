import { useEffect, useState } from "react";
import { reportAllList } from "../../api/repairAPI";
import "../style/RepairReportModal.css";
import "../style/RepairHistoryModal.css";

export default function RepairHistoryModal({ onClose }) {
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    reportAllList()
      .then((res) => {
        setReportList(res);
      })
      .catch((err) => console.error("보고서 조회 실패: ", err));
  }, []);

  return (
    <div className="modal-overlay">
      <div className="history-modal">
        {/* 헤더 */}
        <div className="history-modal-header">
          <div>
            <h2>정비 내역</h2>
            <p>완료된 정비 작업 목록</p>
          </div>
          <button onClick={onClose} className="closed-modal">
            X
          </button>
        </div>

        {/* 바디 */}
        <div className="history-body">
          <div>
            <table className="history-table">
              <thead>
                <tr>
                  <th className="table-header text-left">날짜</th>
                  <th className="table-header text-left">차량번호</th>
                  <th className="table-header text-left">요청자</th>
                  <th className="table-header text-left">정비 내역</th>
                  <th className="table-header text-left">세부 내역</th>
                  <th className="table-header text-center">가격</th>
                </tr>
              </thead>
              <tbody>
                {reportList
                  .sort((res1, res2) => res1.reportId - res2.reportId)
                  .map((list) => (
                    <tr key={list.reportId} className="report-list">
                      <td className="report_list">{list.reportId}</td>
                      <td className="report_list car_number">{list.carNumber}</td>
                      <td className="report_list">{list.userName}</td>
                      <td className="report_list-text">{list.repairTitle}</td>
                      <td className="report_list-text">{list.repairDetail}</td>
                      <td className="repair_amount">{list.repairAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 푸터 */}
        <div className="modal-footer">
          <button onClick={onClose} className="close-modal">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
