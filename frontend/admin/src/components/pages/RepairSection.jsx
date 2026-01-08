import { useEffect, useState } from "react";
import { Check, Clock, Wrench } from "lucide-react";

// MQTT 훅
import useMqtt from "../hook/useMqtt";

// API
import { reportAllList, repairTodayList, stockAllList } from "../../api/repairAPI";

// 모달 컴포넌트
import RepairReportModal from "../modal/RepairReportModal";
import RepairHistoryModal from "../modal/RepairHistoryModal";
import StockModal from "../modal/StockModal";
import StockCreateModal from "../modal/StockCreateModal";

// 스타일
import "../style/RepairSection.css";
import "../../App.css";

// 정비소 페이지
const RepairSection = () => {
  const [repairList, getRepairList] = useState([]); // 오늘 정비 요청 리스트
  const [stockList, getStockList] = useState([]); // 재고 리스트
  const [showReportModal, setShowReportModal] = useState(false); // 보고서 모달 상태
  const [showHistoryModal, setShowHistoryModal] = useState(false); // 정비 내역 모달 상태
  const [stockData, setStockData] = useState(null); // 재고 모달 데이터
  const [reportList, setReportList] = useState([]); // 전체 보고서 리스트
  const [showCreateStockModal, setShowCreateStockModal] = useState(false); // 재고 추가 모달 상태
  const { connectStatus, imageSrc, angleValue, publish } = useMqtt(); // MQTT 상태 및 발행 함수

  // 재고 리스트 갱신 함수
  const refreshStockList = async () => {
    try {
      const repairResponse = await repairTodayList();
      const stockResponse = await stockAllList();

      getRepairList(repairResponse);
      getStockList(stockResponse);
    } catch (e) {
      console.error("재고 갱신 실패");
    }
  };

  // 재고 모달 열기
  const openStockModal = (stock) => {
    setStockData({ stock });
  };

  // 재고 모달 닫기
  const closeModal = () => setStockData(null);

  // 오늘 날짜 문자열
  const today = new Date();
  const yyyy = today.getFullYear().toString();
  const mm = (today.getMonth() + 1).toString().padStart(2, "0");
  const dd = today.getDate().toString().padStart(2, "0");
  const todayStr = yyyy + mm + dd; // yyyymmdd

  // API 호출
  useEffect(() => {
    // 정비소 카메라 작동 신호 전송
    if (connectStatus === "connected") {
      publish("parking/web/repair/cam/control", "start");
    }
    // 오늘자 받은요청 리스트
    repairTodayList()
      .then((res) => {
        getRepairList(res);
      })
      .catch((err) => console.error("정비소 작업정보 조회 실패: ", err));

    // 재고 리스트
    stockAllList()
      .then((res) => {
        getStockList(res);
      })
      .catch((err) => console.error("재고 정보 조회 실패: ", err));

    // 전체 보고서 리스트
    reportAllList()
      .then((res) => {
        setReportList(res);
      })
      .catch((err) => console.error("보고서 조회 실패: ", err));

    // 정비소 카메라 중지 신호 전송
    return () => {
      publish("parking/web/repair/cam/control", "stop");
    };
  }, [connectStatus, publish]);

  // 오늘 작성된 보고서 리스트
  const todayReportList = reportList.filter((report) => report.reportId.startsWith(todayStr));

  // 작업중인 차량
  const workingCar = repairList.filter(
    (repair) =>
      repair.carState === 13 &&
      !todayReportList.some((report) => report.carNumber === repair.car_number)
  );

  // 대기 중인 차량
  const waitForWark = Array.isArray(repairList)
    ? repairList.filter(
        (repair) =>
          !workingCar ||
          (repair.carState == null && repair.entry_time == null) ||
          repair.carState === 1 ||
          repair.carState === 2 ||
          repair.carState === 12
      ).length
    : 0;

  // 작업 완료 버튼 핸들러
  const handleCompleteWork = () => {
    if (workingCar.length === 0) {
      alert("현재 작업중인 차량이 없습니다.");
      return;
    }
    setShowReportModal(true);
  };

  // MQTT 구독 설정
  useEffect(() => {
    if (connectStatus !== "connected") return;

    // lift 토픽 구독
    publish("parking/web/repair/lift", "status"); // 초기 상태 요청용(선택)
  }, [connectStatus, publish]);

  // 작업대기 중인 차량 리스트 필터링
  const filteredRepairList = (Array.isArray(repairList) ? repairList : [])
    .map((list) => {
      if (list.exit_time) return null;

      // 오늘 작성된 보고서가 있는 차량은 제외
      const hasReportToday =
        Array.isArray(reportList) &&
        reportList.some(
          (report) => report.reportId.startsWith(todayStr) && report.carNumber === list.car_number
        );

      if (hasReportToday) return null;

      let carStateText = "";
      if (list.carState === 13) {
        carStateText = "작업중";
      } else if (
        !workingCar ||
        (list.carState == null && list.entry_time == null) ||
        list.carState === 1 ||
        list.carState === 2 ||
        list.carState === 12
      ) {
        carStateText = "대기중";
      } else {
        return null;
      }
      return { ...list, carStateText };
    })
    .filter(Boolean);

  return (
    <div className="page">
      {/* 현재 작업정보 */}
      <div className="status-card">
        {/* 작업차 번호 */}
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">현재 작업차량</p>
              <p className="count">
                {workingCar.length === 1 ? workingCar[0].car_number : "작업중인 차량 없음"}
              </p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#dbeafe" }}>
              <Wrench className="icon" style={{ color: "blue" }} />
            </div>
          </div>
        </div>
        {/* 대기중 */}
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">대기중</p>
              <p className="count">{waitForWark ? waitForWark + "건" : "대기 중인 차량 없음"}</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#fef9c3" }}>
              <Clock className="icon" style={{ color: "orange" }} />
            </div>
          </div>
        </div>
        {/* 리프트 상태 */}
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">리프트 상태</p>
              <p className="count">{angleValue === null ? "미동작" : "동작중"}</p>
            </div>
            <div className="icon-box">
              {/* icon 들어갈 자리, class=icon color:#dc2626 */}
              <div className="lift-btn-wrapper">
                <h3>{angleValue === null ? "0" : angleValue} 도</h3>
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
                    ? stockList.filter((stock) => stock.stockQuantity < stock.minStockQuantity)
                        .length
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
      {/* 정비중 차량 완료 버튼 모달 -> 보고서 표시 */}
      {showReportModal && (
        <RepairReportModal
          onClose={() => setShowReportModal(false)}
          data={workingCar[0]}
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
        <StockCreateModal
          onClose={() => setShowCreateStockModal(false)}
          refreshStockList={refreshStockList}
        />
      )}
    </div>
  );
};

export default RepairSection;
