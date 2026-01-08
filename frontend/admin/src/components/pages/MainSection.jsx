import React, { useEffect, useState } from "react";
import "../style/MainSection.css";
import { getWeatherInfo } from "../../api/weather";
import { useLocation, useNavigate } from "react-router-dom";
import { getTodayEntry, getTodayExit } from "../../api/EntranceAPI";
import InOutLineChart from "../chart/InOutLineChart";
import { getTodayWorkList, workInfoTotalList } from "../../api/workInfoAPI";
import UseByArea from "../chart/UseByArea";
import MiniCalendar from "../calendar/MiniCalendar";
import { AlignCenter, Car } from "lucide-react";
import { getParkingList } from "../../api/parkingAPI";

const MainSection = () => {

  // 금일 입출차 그래프
  const [inOutData, setInOutData] = useState([["시간", "입차", "출차"]]);

  // 작업 목록 가져오기
  const [workList, setWorkList] = useState([]);

  // 주차 현황 가져오기
  const [parkingSpace, setParkingSpace] = useState([]);

  // 현재 날짜 가져오기
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 금일 시간대별 입출차 집계
  const inOutChartData = async () => {
    const entryList = await getTodayEntry();
    const exitList = await getTodayExit();

    // 시간대별 입차/출차 카운트용
    const entryCount = {};
    const exitCount = {};

    // 입차 시간 기준으로 시간대별 집계
    entryList.forEach((item) => {
      if (!item.entryTime) return;
      const hour = new Date(item.entryTime).getHours();
      entryCount[hour] = (entryCount[hour] || 0) + 1;
    });

    // 출차 시간 기준으로 시간대별 집계
    exitList.forEach((item) => {
      if (!item.exitTime) return;
      const hour = new Date(item.exitTime).getHours();
      exitCount[hour] = (exitCount[hour] || 0) + 1;

      // Google Chart 형식 데이터 생성
      const data = [["시간", "입차", "출차"]];
      for (let hour = 0; hour < 24; hour++) {
        const entry = Number(entryCount[hour] || 0);
        const exit = Number(exitCount[hour] || 0);
        data.push([hour, entry, exit]);
      }

      setInOutData(data);
    });
  };

  useEffect(() => {
    inOutChartData();

    // 서비스별 이용 현황
    getTodayWorkList()
      .then((res) => setWorkList(res))
      .catch((err) => console.error("작업 목록 조회 실패:", err));

    // 주차장 현황
    getParkingList()
      .then((res) => {
        setParkingSpace(res);
      })
      .catch((err) => console.error("주차장 조회 실패:", err));
  }, []);

  // 주차 로직
  // P로 시작하는 구역만 주차 구역 판단
  const parkingOnly = parkingSpace.filter((p) => p.sectorId && p.sectorId.startsWith("P"));

  // 현재 주차 중인 차량
  const activeParking = parkingOnly.filter(
    (p) => p.carNumber !== null && p.entryTime !== null && p.exitTime === null
  );

  // 주차 중인 차량 수
  const countParking = activeParking.length;
  return (
    <div className="main-page">
      {/* 통계 차트 영역 */}
      <div className="statistics-chart">
        <div className="chart-box">
          <div className="chart-title">
            <h3>금일 시간대별 입출차 집계</h3>
          </div>
            {inOutData && inOutData.length > 1 ? (
            <InOutLineChart data={inOutData} />
          ) : (
            <div>데이터가 없습니다</div>
          )}

        </div>
        <div className="chart-box">
          <div className="chart-title">
            <h3>금일 서비스별 이용현황</h3>
          </div>
          <UseByArea className="chart-content" workList={workList} />
        </div>
      </div>

      {/* 현재 주차 차량 목록과 시스템 정보 */}
      <div className="info-content">
        {/* 주차 목록 제목 */}
        <div className="parkingcar-list">
          <div className="list-title">
            <div className="title-content">
              <h3 id="title">현재 주차장 차량 목록</h3>
              <span id="car-count">총 {countParking}대 주차중</span>
            </div>
          </div>
          {/* 주차 목록 테이블 */}
          <div className="parkingcar-table">
            <table>
              <thead>
                <tr key="1">
                  <th>차량번호</th>
                  <th>주차 위치</th>
                  <th>입차 시간</th>
                </tr>
              </thead>
              <tbody>
                {parkingOnly.map((p) => {
                  const isOccupied =
                    p.carNumber !== null && p.entryTime !== null && p.exitTime === null;

                  return (
                    <tr key={p.sectorId}>
                      <td className="car-number">
                        <Car className="w-5 h-5 text-gray-400" />
                        <span>{isOccupied ? p.carNumber : "비어있음"}</span>
                      </td>
                      <td>{p.sectorId}</td>
                      <td>{isOccupied ? p.entryTime : "사용중인 차량이 없습니다"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="weather-info">
          {/* 날짜와 날씨 */}
          <div>
            <p id="today">오늘 날짜</p>
            <p id="day">{currentDate}</p>
          </div>

          {/* 달력 */}
          <div className="calendar">
            <MiniCalendar style={{ textAlign: "center", margin: "0 auto" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
