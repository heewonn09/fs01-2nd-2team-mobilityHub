import React, { useEffect, useState } from "react";
import "../style/MainSection.css";
import { getWeatherInfo } from "../../api/weather";
import { useLocation } from "react-router-dom";
import { getTodayEntry, getTodayExit } from "../../api/EntranceAPI";
import InOutLineChart from "../chart/InOutLineChart";
import { getWorkInfoList } from "../../api/workInfoAPI";
import UseByArea from "../chart/UseByArea";

const MainSection = () => {
  //날씨
  const [weather, setWeather] = useState("");

  // 금일 입출차 그래프
  const [inOutData, setInOutData] = useState([["시간", "입차", "출차"]]);

  // 작업 목록 가져오기
  const [workList, setWorkList] = useState([]);

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

  // 입출차 차트
  useEffect(() => {
    inOutChartData();
  }, []);

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

  console.log(workList);

  // 구역별 이용 차트 데이터
  useEffect(() => {
    getWorkInfoList()
      .then((res) => {
        setWorkList(res);
      })
      .catch((err) => console.log("작업 목록 가져오기 실패: ", err));
  }, []);

  // workId별 이용수 집계

  return (
    <div className="main-page">
      {/* 통계 차트 영역 */}
      <div className="statistics-chart">
        <div className="chart-box">
          <div className="chart-title">
            <h3>금일 집계 (시간대별 입출차)</h3>
          </div>
          <InOutLineChart className="chart-content" data={inOutData} />
        </div>
        <div className="chart-box">
          <div className="chart-title">
            <h3>금일 이용회원 (구역별)</h3>
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
              <span id="car-count">총 (변환필요)대 주차중</span>
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
                  <th>주차 시간</th>
                </tr>
              </thead>
              <tbody>
                <tr key="2" className="table-content">
                  <td>차량번호</td>
                  <td>(주차칸)번 주차면</td>
                  <td>입차시간</td>
                  <td>주차시간</td>
                </tr>
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
            <div className="weather-box">
              <span className="weather-icon" style={{ backgroundColor: "green" }}>
                날씨 아이콘
              </span>
              <span className="weather-text">{weather}</span>
            </div>
          </div>

          {/* 물 수위 센서 */}
          <div className="water">
            <p className="water-title">물 수위 센서 시스템</p>
            <div className="system-box">
              <div className="system-content">
                <div className="switch"></div>
                <span className="state">on/off 표시</span>
              </div>
              <div className="system-icon">아이콘 표시</div>
            </div>
            <p className="systtem-info">
              (날씨에 따른 변화 필요) 비가 내리고 있어 센서가 활성화되었습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
