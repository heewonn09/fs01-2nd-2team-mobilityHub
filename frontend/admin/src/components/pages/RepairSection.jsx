import React, { useEffect, useState } from "react";
import "../style/RepairSection.css";
import useMqtt from "../hook/useMqtt";
import { repairPageAllList } from "../../api/repairAPI";
import { Check } from "lucide-react";
import axios from "axios";
import RepairReportModal from "../modal/RepairReportModal";
import RepairHistoryModal from "../modal/RepairHistoryModal";
import StockModal from "../modal/StockModal";
import StockCreateModal from "../modal/StockCreateModal";

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
  const [stockData, setStockData] = useState(null);
  const [showCreateStockModal, setShowCreateStockModal] = useState(false);
<<<<<<< HEAD
  const { connectStatus, imageSrc, publish, message } = useMqtt(BROKER_URL);
  const [liftStatus, setLiftStatus] = useState("대기");
=======
>>>>>>> ca7ef0f137d0c8640356d340940bd4437e75e718

  const refreshStockList = async () => {
    try {
      const res = await repairPageAllList();
      getStockList(res.stockStatusList);
    } catch (e) {
      console.error("재고 갱신 실패");
    }
  };

  const openStockModal = (stock) => {
    setStockData({ stock });
  };

  const closeModal = () => setStockData(null);

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

  useEffect(() => {
    if (connectStatus !== "connected") return;

    // lift 토픽 구독
    publish("parking/web/repair/lift", "status"); // 초기 상태 요청용(선택)
  }, [connectStatus, publish]);

  useEffect(() => {
    if (!message) return;

    if (message.topic === "parking/web/repair/lift") {
      if (message.payload === "up") {
        setLiftStatus("상승중");
      } else if (message.payload === "down") {
        setLiftStatus("하강중");
      }
    }
  }, [message]);

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
              <p className="info-details insert">{liftStatus}</p>
            </div>
            <div className="icon-box" style={{ backgroundColor: "#fee2e2" }}>
              {/* icon 들어갈 자리, class=icon color:#dc2626 */}
              <div className="lift-btn-wrapper">
                <button className="lift-btn up" onClick={() => publish("parking/web/repair/lift", "up")}>
                  ▲
                </button>
                <button className="lift-btn down" onClick={() => publish("parking/web/repair/lift", "down")}>
                  ▼
                </button>
              </div>
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
              <div className="stockHeader-right">
                <span className="outOfStock">
                  {
                    stockList.filter(
                      (stock) => stock.stockQuantity < stock.minStockQuantity
                    ).length
                  }
                  개 항목 재고 부족
                </span>
                <button
                  className="createStock"
                  onClick={() => setShowCreateStockModal(true)}
                >
                  재고 추가
                </button>
              </div>
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
              <tbody className="stock-table-body">
                {stockList.map((res) => (
                  <tr key={res.inventoryId} className="stock-list-tr">
                    <td className="stock-list-td">
                      <span className="stock-product-name">
                        {res.productName}
                      </span>
                    </td>
                    <td className="stock-list-td">
                      <span className="stock-category">
                        {res.stockCategory}
                      </span>
                    </td>
                    <td className="stock-list-td text-center">
                      {res.stockQuantity}
                      {res.stockUnits === "EA" ? "개" : "L"}
                    </td>
                    <td className="stock-list-td text-center minColor">
                      {res.minStockQuantity}
                      {res.stockUnits === "EA" ? "개" : "L"}
                    </td>
                    <td className="stock-list-td">
                      <div className="stockStatus">
                        {(() => {
                          if (res.stockQuantity < res.minStockQuantity) {
                            return <span className="warnStatus">재고부족</span>;
                          }

                          if (res.stockQuantity < res.minStockQuantity * 1.3) {
                            return <span className="careStatus">주의</span>;
                          }

                          return <span className="normalStatus">정상</span>;
                        })()}
                      </div>
                    </td>
                    <td className="stock-list-td">
                      <div className="stockDetail-box">
                        <button
                          onClick={() => openStockModal(res)}
                          className="stock-detail-button"
                        >
                          상세보기
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* 정비완료 모달 */}
      {showReportModal && (
        <RepairReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
          data={repairList}
        />
      )}
      {/* 정비내역 보기 모달 */}
      {showHistoryModal && (
        <RepairHistoryModal
          onClose={() => setShowHistoryModal(false)} // 모달 닫기
          data={repairList.filter(
            (rep) => rep.carStateNodeId === CAR_STATE.REPAIRING
          )} // 현재 작업 차량 데이터 전달
        />
      )}
      {/* 재고id별 상세보기 모달 */}
      {stockData && (
        <StockModal
          key={stockData.stock.inventoryId}
          onClose={closeModal}
          data={stockData.stock}
          refreshStockList={refreshStockList}
        />
      )}
      {/* 재고 추가 모달 */}
      {showCreateStockModal && (
        <StockCreateModal
          onClose={() => setShowCreateStockModal(false)}
          refreshStockList={refreshStockList}
        />
      )}
    </div>
  );
};

export default RepairSection;
