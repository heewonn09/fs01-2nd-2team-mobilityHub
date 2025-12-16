import React, { useEffect, useState } from "react";
import "../style/RepairSection.css";
import useMqtt from "../hook/useMqtt";
import { repairPageAllList, reportAllList, writeReport, sendComplete } from "../../api/repairAPI";
import { Check } from "lucide-react";
import RepairReportModal from "../modal/RepairReportModal";
import RepairHistoryModal from "../modal/RepairHistoryModal";
import StockModal from "../modal/StockModal";
import StockCreateModal from "../modal/StockCreateModal";

//const BROKER_URL = import.meta.env.VITE_BROKER_URL;
// MQTT 브로커 주소 --> cctv 연결할 때
const BROKER_URL = "ws://192.168.14.39:9001";
//const BROKER_URL = "ws://192.168.45.84";

const RepairSection = () => {
  const [repairList, getRepairList] = useState([]);
  const [stockList, getStockList] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [reportList, setReportList] = useState([]);
  const [showCreateStockModal, setShowCreateStockModal] = useState(false);
  const { connectStatus, imageSrc, publish, message } = useMqtt(BROKER_URL);
  const [liftStatus, setLiftStatus] = useState("대기");

  const refreshStockList = async () => {
    try {
      const res = await repairPageAllList();
      getStockList(res.stockStatusList);
      getRepairList(res.repairList);
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
    if (connectStatus === "connected") {
      publish("parking/web/repair/cam", "start");
    }
    repairPageAllList()
      .then((res) => {
        getRepairList(res.repairList);
        getStockList(res.stockStatusList);
      })
      .catch((err) => console.error("차량 정보 조회 실패"));

    reportAllList()
      .then((res) => {
        setReportList(res);
      })
      .catch((err) => console.error("보고서 조회 실패"));
  }, [connectStatus, publish]);

  // 현재 작업 중인 차량
  // console.log(repairList);

  const workingCar = Array.isArray(repairList) ? repairList.filter((repair) => repair.carState === 13) : [];

  // console.log(workingCar);

  // 대기 중인 차량
  const waitForWark = Array.isArray(repairList)
    ? repairList.filter(
        (repair) =>
          repair.carState !== 13 &&
          repair.exit_time == null &&
          (repair.entry_time == null || repair.carState == null) &&
          (repair.entry_time !== null || repair.carState == 1 || repair.carState == 2 || repair.carState == 12)
      ).length
    : 0;

  const handleCompleteWork = () => {
    if (!repairList) return alert("현재 작업중인 차량이 없습니다.");
    setShowReportModal(true);
  };

  useEffect(() => {
    if (connectStatus !== "connected") return;

    // lift 토픽 구독
    publish("parking/web/repair/lift", "status"); // 초기 상태 요청용(선택)
  }, [connectStatus, publish]);

  // useEffect(() => {
  //   if (!message) return;

  //   if (message.topic === "parking/web/repair/lift") {
  //     if (message.payload === "up") {
  //       setLiftStatus("상승중");
  //     } else if (message.payload === "down") {
  //       setLiftStatus("하강중");
  //     }
  //   }
  // }, [message]);

  const handleReportSubmit = async (reportData) => {
    console.log("DB에 저장될 데이터: ", reportData);

    try {
      const response = await writeReport(reportData);

      if (response.status === 200) {
        alert("보고서작성이 등록됐습니다.");

        // 보고서 작성 성공 후 작업 완료 신호 전송
        if (reportData.workInfoId) {
          const completeResponse = await sendComplete({
            workInfoId: reportData.workInfoId,
          });
          if (completeResponse?.status === 200) {
            console.log("작업 완료 신호 전송 성공");
          }
        }
      }
      return response;
    } catch (error) {
      console.error("에러발생: ", error);
      alert("보고서 등록 중 오류가 발생했습니다.");
    }
  };

  // 오늘 날짜 문자열
  const today = new Date();
  const yyyy = today.getFullYear().toString();
  const mm = (today.getMonth() + 1).toString().padStart(2, "0");
  const dd = today.getDate().toString().padStart(2, "0");
  const todayStr = yyyy + mm + dd; // yyyymmdd

  // 렌더링할 리스트 필터링 및 상태 결정
  const filteredRepairList = (Array.isArray(repairList) ? repairList : [])
    .map((list) => {
      if (list.exit_time) return null;

      const hasReportToday =
        Array.isArray(reportList) &&
        reportList.some((report) => report.reportId.startsWith(todayStr) && report.carNumber === list.car_number);
      if (hasReportToday) return null;

      let carStateText = "";
      if (list.carState === 13) {
        carStateText = "작업중";
      } else if (
        (list.carState === null && list.entry_time == null) ||
        ((list.carState === 0 || list.carState === 1 || list.carState === 2 || list.carState === 12) &&
          list.entry_time !== null)
      ) {
        carStateText = "대기중";
      } else {
        return null;
      }

      return { ...list, carStateText };
    })
    .filter(Boolean);

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
              <p className="info-details">{workingCar.length > 0 ? workingCar[0].car_number : "작업중인 차량 없음"}</p>
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
              <p className="info-details">{waitForWark ? waitForWark + "건" : "대기 중인 차량 없음"}</p>
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
              <p className="info-details">{liftStatus}</p>
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
          <img src={imageSrc || null} alt="camera" className="cctv-view" />
        </div>
        {/* 이용 현황 패널 */}
        <div className="use-status-box">
          <div className="h3-tag">
            <h3>이용 현황</h3>
          </div>
          <div className="status-box">
            {filteredRepairList.length > 0 ? (
              filteredRepairList.map((list) => (
                <div key={list.id} className="list-data">
                  <div>
                    <div className="car-number">
                      <span className="car-number-text">{list.car_number}</span>
                    </div>
                  </div>
                  <span className="job-state">
                    <p>{list.carStateText}</p>
                  </span>
                </div>
              ))
            ) : (
              <p>현재 작업대기 중인 차량이 없습니다.</p>
            )}
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
          {workingCar.length > 0 ? (
            repairList
              .filter((rep) => rep.carState === 13)
              .map((rep) => (
                <div key={rep.id} className="repair-list">
                  <p className="add-repair">추가 요청사항</p>
                  {rep.additionalRequest && rep.additionalRequest.length > 0 ? (
                    <div key={rep.id} className="repair-request">
                      {rep.additionalRequest}
                    </div>
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
            <button className="view-details-btn" onClick={() => setShowHistoryModal(true)}>
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
                  {Array.isArray(stockList)
                    ? stockList.filter((stock) => stock.stockQuantity < stock.minStockQuantity).length
                    : 0}
                  개 항목 재고 부족
                </span>
                <button className="createStock" onClick={() => setShowCreateStockModal(true)}>
                  재고 추가
                </button>
              </div>
            </div>
          </div>

          {/* 부품별 재고현황 메인 */}
          <div className="stock-table-wrapper">
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
                {Array.isArray(stockList) &&
                  stockList.map((res) => (
                    <tr key={res.inventoryId} className="stock-list-tr">
                      <td className="stock-list-td">
                        <span className="stock-product-name">{res.productName}</span>
                      </td>
                      <td className="stock-list-td">
                        <span className="stock-category">{res.stockCategory}</span>
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
                          <button onClick={() => openStockModal(res)} className="stock-detail-button">
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
      {/* 정비중 차량 완료 버튼 모달 -> 보고서 표시 */}
      {showReportModal && (
        <RepairReportModal
          onClose={() => setShowReportModal(false)}
          data={workingCar}
          refreshStockList={refreshStockList}
        />
      )}
      {/* 정비 보고서 전체보기 모달 */}
      {showHistoryModal && (
        <RepairHistoryModal
          onClose={() => setShowHistoryModal(false)} // 모달 닫기
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
        <StockCreateModal onClose={() => setShowCreateStockModal(false)} refreshStockList={refreshStockList} />
      )}
    </div>
  );
};

export default RepairSection;
