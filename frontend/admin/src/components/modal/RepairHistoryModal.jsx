import { useEffect, useState } from "react";
import { reportAllList } from "../../api/repairAPI";

export default function RepairHistoryModal({ onClose }) {
  const [reportList, setReportList] = useState([]);

  const refreshReportList = async () => {
    try {
      const res = await reportAllList();
      setReportList(res);
    } catch (e) {
      console.error("보고서 갱신 실패");
    }
  };

  useEffect(() => {
    reportAllList()
      .then((res) => {
        setReportList(res);
      })
      .catch((err) => console.error("보고서 조회 실패: ", err));
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxWidth: "1024px",
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ color: "#111827", margin: 0 }}>정비 내역</h2>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              완료된 정비 작업 목록
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: "8px", borderRadius: "8px", cursor: "pointer" }}
          >
            X
          </button>
        </div>

        {/* 바디 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  backgroundColor: "#f9fafb",
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      color: "#374151",
                    }}
                  >
                    날짜
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      color: "#374151",
                    }}
                  >
                    차량번호
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      color: "#374151",
                    }}
                  >
                    요청자
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      color: "#374151",
                    }}
                  >
                    정비 내역
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      color: "#374151",
                    }}
                  >
                    세부 내역
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#374151",
                    }}
                  >
                    가격
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportList
                  .sort((res1, res2) => res1.reportId - res2.reportId)
                  .map((list) => (
                    <tr
                      key={list.reportId}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        hover: { backgroundColor: "#f9fafb" },
                      }}
                    >
                      <td style={{ padding: "12px", color: "#111827" }}>
                        {list.reportId}
                      </td>
                      <td style={{ padding: "12px", color: "#111827" }}>
                        {list.carNumber}
                      </td>
                      <td style={{ padding: "12px", color: "#111827" }}>
                        {list.userName}
                      </td>
                      <td style={{ padding: "12px", color: "#6b7280" }}>
                        {list.repairTitle}
                      </td>
                      <td style={{ padding: "12px", color: "#6b7280" }}>
                        {list.repairDetail}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                          }}
                        >
                          {list.repairAmount}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 푸터 */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            padding: "24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
