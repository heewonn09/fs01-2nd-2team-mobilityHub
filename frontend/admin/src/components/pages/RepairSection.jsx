import React, { useEffect, useState } from "react";
import "../style/RepairSection.css";
import useMqtt from "../hook/useMqtt";
import { repairPageAllList } from "../../api/repairAPI";
import { Check } from "lucide-react";
import axios from "axios";
import RepairReportModal from "../modal/RepairReportModal";
import RepairHistoryModal from "../modal/RepairHistoryModal";

//const BROKER_URL = import.meta.env.VITE_BROKER_URL;
// MQTT 브로커 주소 --> cctv 연결할 때
//const BROKER_URL = "ws://192.168.45.84";

// 차량 상태 상수
const CAR_STATE = {
  REPAIRING: 13,
  WAIT_1: 1,
  WAIT_2: 2,
  WAIT_3: 0,
};

// 상태별 정보 매핑
const CAR_STATE_INFO = {
  [CAR_STATE.WASHING]: { label: "진행중", color: "ing" },
  [CAR_STATE.WAIT_1]: { label: "대기중", color: "wait" },
  [CAR_STATE.WAIT_2]: { label: "대기중", color: "wait" },
  [CAR_STATE.WAIT_3]: { label: "완료", color: "finish" },
};

const RepairSection = () => {
  const [repairList, getRepairList] = useState([]);
  const [stockList, getStockList] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // API 호출
  useEffect(() => {
    repairPageAllList()
      .then((res) => {
        getRepairList(res.repairList);
        getStockList(res.stockStatusList);
      })
      .catch((err) => console.error("차량 정보 조회 실패"));
  }, []);

  console.log(repairList);
  console.log(stockList);

  // 현재 작업 중인 차량
  const workingCar = repairList.find(
    (repair) => repair.carState === CAR_STATE.REPAIRING
  );

  // 대기 중인 차량
  const waitForWark = repairList.find(
    (repair) =>
      repair.carState !== CAR_STATE.REPAIRING &&
      repair.entryTime == null &&
      repair.exitTime == null
  );

  const handleCompleteWork = () => {
    if (!repairList) return alert("현재 작업중인 차량이 없습니다.");
    setShowReportModal(true);
  };

  const handleViewDetails = () => {
    setShowHistoryModal(true); // 버튼 클릭 시 모달 열림
  };

  const handleReportSubmit = async (reportData) => {
    console.log("DB에 저장될 데이터: ", reportData);

    try {
      const response = await axios.post(
        "http://127.0.0.1:9000/report/write",
        reportData
      );

      if (response.status === 200) {
        console.log("서버응당: ", response.data);
        alert("보고서작성이 등록됐습니다.");
      }
    } catch (error) {
      console.error("에러발생: ", error);
      alert("보고서 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="main-page">
      {/* ---- 통계 카드 ---- */}

      {/* 현재 작업정보 */}
      <div className="current-work-conatiner">
        {/* 작업차 번호 */}
        <div className="working-box">
          <div className="between-position">
            <div>
              <p className="working-info">현재 작업차량</p>
              <p className="info-details insert">
                {workingCar ? workingCar.car_number : "작업중인 차량 없음"}
              </p>
            </div>
            <div className="icon-box" style={{ backgroundColor: "#dbeafe" }}>
              {/* icon들어갈 자리, class=icon color:#2563eb*/}
            </div>
          </div>
        </div>
        {/* 대기중 */}
        <div className="working-box">
          <div className="between-position">
            <div>
              <p className="working-info">대기중</p>
              <p className="info-details insert">
                {waitForWark ? waitForWark + "건" : "대기 중인 차량 없음"}
              </p>
            </div>
            <div className="icon-box" style={{ backgroundColor: "#fef9c3" }}>
              {/* icon 들어갈 자리, class=icon color:#ca8a04 */}
            </div>
          </div>
        </div>
        {/* 리프트 상태 */}
        <div className="working-box">
          <div className="between-position">
            <div>
              <p className="working-info">리프트 상태</p>
              <p className="info-details insert">(리프트상태)</p>
            </div>
            <div className="icon-box" style={{ backgroundColor: "#fee2e2" }}>
              {/* icon 들어갈 자리, class=icon color:#dc2626 */}
            </div>
          </div>
        </div>
      </div>

      {/* ---- CCTV 영역 + 이용 현황 ---- */}
      <div className="usage-status-container">
        {/* CCTV부분 */}
        <div className="repair-cctv">
          <div className="insert">cctv추가</div>
        </div>
        {/* 이용 현황 패널 */}
        <div className="use-status-box">
          <div className="h3-tag">
            <h3>이용 현황</h3>
          </div>
          <div className="status-box">
            {repairList.map((list) => (
              <div key={list.id} className="list-data">
                <div>
                  <div className="car-number">{list.car_number}</div>
                  <span className="state"></span>
                </div>
                <span className="job-state">
                  <p className={CAR_STATE_INFO[list.carState]?.color || ""}>
                    {CAR_STATE_INFO[list.carState]?.label || ""}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- 체크리스트 + 재고 현황 ---- */}
      <div className="checklist">
        {/* 체크리스트 카드 */}
        <div className="checklist-stock">
          {/* 카드 상단: 헤더 */}
          <div className="checklist-container">
            <h3 className="checklist-header">
              정비 체크리스트
              <button onClick={handleCompleteWork} className="check-btn">
                <Check className="check" /> 완료
              </button>
            </h3>
          </div>

          {/* 카드 본문: 현재 작업 차량 추가 요청사항 */}
          {repairList.filter(
            (rep) => rep.carStateNodeId === CAR_STATE.REPAIRING
          ).length > 0 ? (
            repairList
              .filter((rep) => rep.carStateNodeId === CAR_STATE.REPAIRING)
              .map((rep) => (
                <div key={rep.id} className="repair-list">
                  <p className="add-repair">추가 요청사항</p>
                  {rep.additionalRequests &&
                  rep.additionalRequests.length > 0 ? (
                    rep.additionalRequests.map((req, index) => (
                      <div key={index} className="repair-request">
                        {req}
                      </div>
                    ))
                  ) : (
                    <p className="no-request">요청사항 없음</p>
                  )}
                </div>
              ))
          ) : (
            <p className="no-request">현재 추가 요청사항이 없습니다.</p>
          )}

          {/* 카드 하단: 정비 내역 보기 버튼 */}
          <div className="checklist-footer">
            <button
              className="view-details-btn"
              onClick={() => setShowHistoryModal(true)}
            >
              정비 내역 보기
            </button>
          </div>
        </div>

        {/* 재고 현황 */}
        <div className="stockStatus-container">
          {/* 재고현황 헤더 */}
          <div className="stockStatus-box">
            <div className="stockStatus-header">
              <h3>부품 재고 현황</h3>
              <span className="outOfStock">
                {/* {parts.filter((p) => p.stock < p.minStock).length}개 항목 재고 부족 */}
              </span>
            </div>
          </div>

          {/* 부품별 재고현황 메인 */}
          <div style={{ overflowX: "auto" }}>
            <table className="stockStatus-table">
              <thead>
                <tr>
                  <th className="stock-category text-left">부품명</th>
                  <th className="stock-category text-left">카테고리</th>
                  <th className="stock-category text-center">현재 재고</th>
                  <th className="stock-category text-center">최소 재고</th>
                  <th className="stock-category text-center">상태</th>
                  <th className="stock-category text-center">작업</th>
                </tr>
              </thead>
              <tbody>
                {stockList.map((res) => (
                  <tr key={res.inventoryId}>
                    <td>{res.productName}</td>
                    <td>{res.stockCategory}</td>
                    <td>
                      {res.stockQuantity}
                      {res.stockUnits === "EA" ? "개" : "L"}
                    </td>
                    <td>
                      {res.minStockQuantity}
                      {res.stockUnits === "EA" ? "개" : "L"}
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showReportModal && (
        <RepairReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          data={repairList}
        />
      )}
      {showHistoryModal && (
        <RepairHistoryModal
          onClose={() => setShowHistoryModal(false)} // 모달 닫기
          data={repairList.filter(
            (rep) => rep.carStateNodeId === CAR_STATE.REPAIRING
          )} // 현재 작업 차량 데이터 전달
        />
      )}
    </div>
  );
};

export default RepairSection;
