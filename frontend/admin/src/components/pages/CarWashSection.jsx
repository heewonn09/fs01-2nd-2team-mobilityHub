import React, { useEffect, useState } from "react";
import "../style/CarWashSection.css";
import { getCarWashing } from "../../api/carWashAPI";

const CarWashSection = () => {
  // 세차장 데이터 목록
  const [carWashing, setCarWashing] = useState("");

  // 목록 API 가져오기
  useEffect(() => {
    getCarWashing(3)
      .then((res) => setCarWashing(res))
      .catch((err) => console.error("차량 정보 조회 실패", err));
  }, []);

  console.log(carWashing);
  console.log("차량번호", carWashing[0].carNumber);
  if (carWashing.length > 0) {
    console.log("인덱스", carWashing[0].carNumber); // ✔ 첫 번째 요소의 차량번호
  }

  return (
    <div className="wash-page">
      <div className="statistics-card">
        {/* 카드 한 블록 */}
        <div className="statistics-component">
          <div className="card-item">
            <div>
              <p className="text">진행중</p>
              <p className="count">(차량번호) 대</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#dbeafe" }}>
              <p className="icon" style={{ backgroundColor: "blue" }}>
                (i) {/* 아이콘 들어올 자리 */}
              </p>
            </div>
          </div>
        </div>

        {/* 카드 한 블록 */}
        <div className="statistics-component">
          <div className="card-item">
            <div>
              <p className="text">대기중</p>
              <p className="count">(차량수) 대</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#fef9c2" }}>
              <p className="icon" style={{ backgroundColor: "orange" }}>
                (i) {/* 아이콘 들어올 자리 */}
              </p>
            </div>
          </div>
        </div>

        {/* 카드 한 블록 */}
        <div className="statistics-component">
          <div className="card-item">
            <div>
              <p className="text">완료 건수</p>
              <p className="count">(차량수) 대</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#dbfce7" }}>
              <p className="icon" style={{ backgroundColor: "green" }}>
                (i) {/* 아이콘 들어올 자리 */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CCTV와 이용 현황 */}
      <div className="wash-components">
        <div className="wash-cctv">
          <div className="cctv-view">cctv 화면</div>
        </div>
        <div className="wash-car-list">
          <div className="list-title">
            <h3>이용 현황</h3>
          </div>
          <div className="list-content">
            <div className="list-data">
              <div>
                <div className="car-number">{carWashing[0].carNumber}</div>
                <span className="state">(진행상황)</span>
              </div>
              <span className="job-state">
                <p className="state">(변환필요) 진행중</p>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 하루 이용량 통계 그래프 */}
      <div className="graph-component">
        <div className="graph-title">
          <h3 className="title">하루 이용량 통계</h3>
        </div>

        <div className="graph">막대 그래프 추가해주세요.</div>
      </div>
    </div>
  );
};

export default CarWashSection;
