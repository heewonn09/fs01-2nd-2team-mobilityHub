import React, { useEffect, useState } from "react";
import "../style/CarWashSection.css";
import "../../App.css";
import { getCarWashing } from "../../api/carWashAPI";
import { Clock, Droplets, CheckCircle } from "lucide-react";
import CarWashBarChart from "../chart/CarWashBarChart";
import useMqtt from "../hook/useMqtt";

// 차량 상태 상수
const CAR_STATE = {
  WASHING: 10,
  WAIT_1: 1,
  WAIT_2: 2,
};

// 상태별 정보 매핑
const CAR_STATE_INFO = {
  [CAR_STATE.WASHING]: { label: "진행중", color: "ing" },
  [CAR_STATE.WAIT_1]: { label: "대기중", color: "wait" },
  [CAR_STATE.WAIT_2]: { label: "대기중", color: "wait" },
};

const CarWashSection = () => {
  const [carWashing, setCarWashing] = useState([]);

  const { connectStatus, imageSrc, publish } = useMqtt();

  // 페이지 로딩 시 카메라 스트리밍 시작
  useEffect(() => {
    if (connectStatus === "connected") {
      publish("parking/web/carwash/cam/control", "start");
    }
  }, [connectStatus, publish]);

  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // API 호출 (세차작업 중인)
  useEffect(() => {
    getCarWashing()
      .then((res) => {
        setCarWashing(res);
      })
      .catch((err) => console.error("차량 정보 조회 실패", err));
  }, []);

  // 진행중 차량
  const washingCar = carWashing.find((item) => item.carStateNodeId === CAR_STATE.WASHING);

  // 대기 중 차량
  const waitCarList = carWashing.filter((item) =>
    [CAR_STATE.WAIT_1, CAR_STATE.WAIT_2].includes(item.carStateNodeId)
  );
  const waitCarCount = waitCarList.length;

  // 완료 차량
  const completeCarList = carWashing.filter((item) => item.exitTime !== null);
  const completeCount = completeCarList.length;

  return (
    <div className="page">
      {/* 통계 카드 */}
      <div className="status-card">
        {/* 진행중 */}
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">진행중</p>
              <p className="count">차량번호: {washingCar ? washingCar.carNumber : "없음"}</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#dbeafe" }}>
              <Droplets className="icon" style={{ color: "blue" }} />
            </div>
          </div>
        </div>

        {/* 대기중 */}
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">대기중</p>
              <p className="count">{waitCarCount} 대</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#fef9c2" }}>
              <Clock className="icon" style={{ color: "orange" }} />
            </div>
          </div>
        </div>

        {/* 완료 건수 */}
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">완료 건수</p>
              <p className="count">{completeCount} 대</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#dbfce7" }}>
              <CheckCircle className="icon" style={{ color: "green" }} />
            </div>
          </div>
        </div>
      </div>

      {/* CCTV와 이용 현황 */}
      <div className="wash-components">
        <div className="wash-cctv">
          <img src={imageSrc || " "} alt="camera" className="cctv-view" />
        </div>
        <div className="wash-car-list">
          <div className="list-title">
            <h3>이용 현황</h3>
          </div>
          <div className="list-content">
            {carWashing
              .filter((item) =>
                [CAR_STATE.WASHING, CAR_STATE.WAIT_1, CAR_STATE.WAIT_2].includes(
                  item.carStateNodeId
                )
              )
              .map((list) => (
                <div key={list.id} className="list-data">
                  <div>
                    <div className="car-number">{list.carNumber}</div>
                    <span className="state"></span>
                  </div>
                  <span className="job-state">
                    <p className={CAR_STATE_INFO[list.carStateNodeId]?.color || ""}>
                      {CAR_STATE_INFO[list.carStateNodeId]?.label || ""}
                    </p>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 하루 이용량 통계 그래프 */}
      <div className="graph-component">
        <div className="graph-title">
          <h3 className="title">하루 이용량 통계 ({currentDate} 기준)</h3>
        </div>
        <CarWashBarChart className="graph" carWashValues={carWashing} />
      </div>
    </div>
  );
};

export default CarWashSection;
