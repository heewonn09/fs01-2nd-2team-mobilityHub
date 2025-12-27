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
  const navigate = useNavigate();

  //날씨
  const [weather, setWeather] = useState("");

  // 금일 입출차 그래프
  const [inOutData, setInOutData] = useState([["시간", "입차", "출차"]]);

  // 작업 목록 가져오기
  const [workList, setWorkList] = useState([]);

  const [workTotalList, setWorkTotalList] = useState([]);

  // 주차 현황 가져오기
  const [parkingSpace, setParkingSpace] = useState([]);

  // 현재 날짜 가져오기
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 날씨 API
  useEffect(() => {
    getWeatherInfo()
      .then((todayWeather) => {
        // "비"가 아닌 경우 모두 "맑음"으로 처리
        const processedWeather = todayWeather === "비" ? "비" : "맑음";
        setWeather(processedWeather);
      })
      .catch((err) => console.error("API 오류:", err));
  }, []);

  // 금일 시간대별 입출차 집계
  const inOutChartData = async () => {
    const entryList = await getTodayEntry();
    const exitList = await getTodayExit();

    const entryCount = {};
    const exitCount = {};

    entryList.forEach((item) => {
      if (!item.entryTime) return;
      const hour = new Date(item.entryTime).getHours();
      entryCount[hour] = (entryCount[hour] || 0) + 1;
    });

    exitList.forEach((item) => {
      if (!item.exitTime) return;
      const hour = new Date(item.exitTime).getHours();
      exitCount[hour] = (exitCount[hour] || 0) + 1;

      const data = [["시간", "입차", "출차"]];
      for (let hour = 0; hour < 24; hour++) {
        const entry = Number(entryCount[hour] || 0);
        const exit = Number(exitCount[hour] || 0);
        data.push([hour, entry, exit]);
      }

      setInOutData(data);
    });
  };

  console.log("정보", parkingSpace);
  console.log("주차장: ", workTotalList);

  const sectors = ["P01", "P02", "P03"];
  const carStateToSector = {
    5: "P01",
    7: "P02",
    9: "P03",
  };

  // 출차시간이 없으면 carstate값이 5, 7, 9(주차장 칸 번호)가 있는 차량 수
  const activeVehicles = workTotalList.filter(
    (v) => !v.exit_time && [5, 7, 9].includes(Number(v.carState))
  );

  // 갯수 확인
  const countParking = activeVehicles.length;

  useEffect(() => {
    // 입출차 차트
    inOutChartData();

    workInfoTotalList()
      .then((res) => {
        setWorkTotalList(res);
      })
      .catch((err) => console.error("조회실패: ", err));

    // 구역별 이용 차트 데이터
    getTodayWorkList()
      .then((res) => {
        setWorkList(res);
      })
      .catch((err) => console.log("작업 목록 가져오기 실패: ", err));
  }, []);

  useEffect(() => {
    getParkingList()
      .then((res) => {
        setParkingSpace(res);
      })
      .catch((err) => console.err("주차장 정보 조회실패: ", err));
  }, []);

  return (
    <div className="main-page">
      {/* 통계 차트 영역 */}
      <div className="statistics-chart">
        <div className="chart-box">
          <div className="chart-title">
            <h3>금일 시간대별 입출차 집계</h3>
          </div>
          <InOutLineChart className="chart-content" data={inOutData} />
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
                {sectors.map((sector) => {
                  // 해당 구역에 있는, 출차시간이 없는 차량 찾기
                  const vehicle = workTotalList.find(
                    (v) =>
                      Number(v.carState) ===
                        Number(
                          Object.keys(carStateToSector).find(
                            (k) => carStateToSector[k] === sector
                          )
                        ) && !v.exit_time // exit_time이 없는 데이터만
                  );

                  return (
                    <tr key={sector}>
                      <td className="car-number">
                        <Car className="w-5 h-5 text-gray-400" />
                        <span>{vehicle ? vehicle.carNumber : "비어있음"}</span>
                      </td>
                      <td>{sector}</td>
                      <td>
                        {vehicle
                          ? vehicle.entry_time || "-"
                          : "사용중인 차량이 없습니다"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 날씨 관련 시스템 */}
        <div className="weather-info">
          {/* 날짜와 날씨 */}
          <div>
            <p id="today">오늘 날짜</p>
            <p id="day">{currentDate}</p>
          </div>

          {/* 물 수위 센서 */}
          <div className="calendar">
            <MiniCalendar style={{ textAlign: "center", margin: "0 auto" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
