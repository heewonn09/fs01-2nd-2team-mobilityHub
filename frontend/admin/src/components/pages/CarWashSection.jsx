import React, { useEffect, useState } from "react";
import "../style/CarWashSection.css";
import { getCarWashing } from "../../api/carWashAPI";
import { Clock, Droplets, CheckCircle } from "lucide-react";
import CarWashBarChart from "../chart/CarWashBarChart";
import useMqtt from "../hook/useMqtt";

//const BROKER_URL = "ws://192.168.14.38:9001";
const BROKER_URL = import.meta.env.VITE_BROKER_URL;

console.log("브로커: ", BROKER_URL);

const CarWashSection = () => {
  // 세차장 데이터 목록
  const [carWashing, setCarWashing] = useState([]);

  // NEW: MQTT메시지 로그 상태
  const [mqttLogs, setMqttLogs] = useState([]);

  // 사용자정의 훅으로 정의된 함수를 호출해서 결과를 받기
  const { connectStatus, imageSrc, publish } = useMqtt(BROKER_URL);

  // 페이지가 로딩되면 라즈베리파이로 start를 전송 - 페이지가 로딩되면 카메라스트리밍을 할 수 있도록 작업
  useEffect(() => {
    if (connectStatus === "connected") {
      publish("parking/web/carwash/cam", "start");
    }
  }, [connectStatus, publish]);

  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    getCarWashing()
      .then((res) => {
        console.log("API 응답 데이터:", res);
        setCarWashing(res);
      })
      .catch((err) => console.error("차량 정보 조회 실패", err));
  }, []);

  // 세차 작업 중인 차량만 따로 저장
  const washingCar = carWashing.find((item) => item.carState === "carWashIn");
  console.log("carWashing 배열:", carWashing);
  console.log("washingCar 결과:", washingCar);

  // 대기 중인 차량의 수
  const waitCarList = carWashing.filter((item) => item.carState === "COMING");
  const waitCarCount = waitCarList.length;

  // 작업을 완료한 차량의 수
  const completeCarList = carWashing.filter((item) => item.carState === "out");
  const completeCount = completeCarList.length;

  console.log(washingCar);
  return (
    <div className="wash-page">
      <div className="statistics-card">
        {/* 카드 한 블록 */}
        <div className="statistics-component">
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

        {/* 카드 한 블록 */}
        <div className="statistics-component">
          <div className="card-item">
            <div>
              <p className="text">대기중</p>
              <p className="count">{waitCarCount ? waitCarCount : 0} 대</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#fef9c2" }}>
              <Clock className="icon" style={{ color: "orange" }} />
            </div>
          </div>
        </div>

        {/* 카드 한 블록 */}
        <div className="statistics-component">
          <div className="card-item">
            <div>
              <p className="text">완료 건수</p>
              <p className="count">{completeCount ? completeCount : 0} 대</p>
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
          <img src={imageSrc || null} alt="camera" />
        </div>
        <div className="wash-car-list">
          <div className="list-title">
            <h3>이용 현황</h3>
          </div>
          <div className="list-content">
            {carWashing
              .filter((item) => item.carState === "COMING" || item.carState === "carWashIn")
              .map((list) => (
                <div key={list.id} className="list-data">
                  <div>
                    {/* <div className="car-number">{carWashing[0].carNumber}</div> */}
                    <div className="car-number">{list.carNumber}</div>
                    <span className="state"></span>
                  </div>
                  <span className="job-state">
                    <p
                      className={`${
                        list.carState === "carWashIn"
                          ? "ing"
                          : list.carState === "COMING"
                          ? "wait"
                          : ""
                      }`}
                    >
                      {list.carState === "carWashIn" ? "진행중" : "대기중"}
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
