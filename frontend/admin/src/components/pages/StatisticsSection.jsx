import React, { useEffect, useState } from "react";
import "../style/StatisticsSection.css";
import "../../App.css";
import { getRepairAmount } from "../../api/repairAPI";
import { getTodayWorkList, getWorkInfoList } from "../../api/workInfoAPI";
import StatisticsByDateChart from "../chart/StatisticsByDateChart";
import UseByAreaPieChart from "../chart/UseByAreaPieChart";
import MembershipChart from "../chart/MembershipChart";
import { Clock, DollarSign, UserPlus } from "lucide-react";
import { getUserInfo } from "../../api/newUser";

// 공통 함수
// 조건에 맞는 데이터 개수 계산
const countByCondition = (list, conditionFn) => {
  return list.filter(conditionFn).length;
};

export default function StatisticsSection() {
  // 기간 상태
  const [periodType, setPeriodType] = useState("daily");

  // 데이터 상태
  const [workList, setWorkList] = useState([]);
  const [todayWorkList, setTodayWorkList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [repairAmount, setRepairAmount] = useState([]);

  // 로딩 상태
  const [isLoaded, setIsLoaded] = useState(false);

  // 작업 정보, 사용자 정보, 수리 금액 데이터 불러오기
  useEffect(() => {
    Promise.all([getWorkInfoList(), getUserInfo(), getRepairAmount()])
      .then(([workRes, userRes, repairRes]) => {
        setWorkList(workRes.data || workRes);     // 작업 목록
        setUserList(userRes.data || userRes);     // 사용자 목록
        setRepairAmount(repairRes.data || repairRes); // 수리 금액
        setIsLoaded(true); 
      })
      .catch(console.error);
  }, []);

  // 오늘 작업 목록만
  useEffect(() => {
    getTodayWorkList()
      .then((res) => setTodayWorkList(res.data || res))
      .catch(console.error);
  }, []);

  // 날짜 공통 함수
  const getStartOfThisWeek = () => {
    const now = new Date();
    const day = now.getDay() === 0 ? 7: now.getDay(); // 일요일이면 7로 변환 (계산 효율성 위함)
    const startOfWeek = new Date(now);

    startOfWeek.setDate(now.getDate() - day + 1);    // 오늘 날짜에서 (오늘 요일 -1)만큼 뻬서 월요일 이동 
    startOfWeek.setHours(0,0,0,0);   // 시간을 00:00:00

    return startOfWeek;
  }

  // 요일 인덱스로 변환 
  const getDayIndex = (date) => {
    const d = new Date(date);
    return d.getDay() === 0 ? 6 : d.getDay() - 1;
  }

  // 사용자 가입 날짜 기준
  // 이번주/지난주 계산
  const weeklyChartData = (users) => {
    const thisWeek = Array(7).fill(0);
    const lastWeek = Array(7).fill(0);

    // 이번 주 월요일
    const startOfThisWeek = getStartOfThisWeek();
    // 지난 주 월요일
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // 사용자 데이터 - 주차별, 요일별 카운트
    users.forEach((user) => {
      if (!user.createDate) return;
      const regDate = new Date(user.createDate);
      const dayIndex = getDayIndex(user.createDate);

      // 이번 주 가입자
      if (regDate >= startOfThisWeek) {thisWeek[dayIndex]++;}
      // 지난 주 가입자
      else if (regDate >= startOfLastWeek && regDate < startOfThisWeek) {
        lastWeek[dayIndex]++;
      }
    });

    return { thisWeek, lastWeek };
  };

  const { thisWeek, lastWeek } = weeklyChartData(userList);

  // 일별 / 주별/ 월별
  const startOfWeek = getStartOfThisWeek();
  
  // 일별 (이번 주 7일 - 7번 반복)
  const dailyArray = Array.from({ length: 7 }, (_, i) => {
    // i=0 -> 월요일 | i=1 -> 화요일
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    // 해당 날짜의 작업 건수 계산
    // entryTime 날짜가 현재 day와 같은 것만 카운트
    const count = countByCondition(workList, (w) => {
      const d = new Date(w.entryTime);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    });
    return { date: `${day.getMonth() + 1}/${day.getDate()}`, count };
  });

  // 주별 (이번 달 1~4주)
  const now = new Date();
  const thisMonth = now.getMonth();


  const weeklyArray = Array.from({ length: 4 }, (_, i) => {
    // i=0 -> 1주 | i=1 -> 2주
    const count = countByCondition(workList, (w) => {
      const d = new Date(w.entryTime);
      // 날짜를 7로 나눠서 주차 계산
      const week = Math.ceil(d.getDate() / 7);

      return d.getMonth() === thisMonth && week === i + 1;
    });
    return { week: `${i + 1}주`, count };
  });

  // 월별 (이번 년도 1~12월)
  const thisYear = now.getFullYear();

  const monthlyArray = Array.from({ length: 12 }, (_, i) => {
    // i = 0 -> 1월 | i=1 -> 2월
    const count = countByCondition(workList, (w) => {
      const d = new Date(w.entryTime);
      return d.getFullYear() === thisYear && d.getMonth() === i;
    });
    return { month: `${i + 1}월`, count };
  });

  // 선택된 기간 타입에 따라 차트 데이터 변환
  const getCurrentData = () => {
    if (periodType === "daily") return dailyArray;
    if (periodType === "weekly") return weeklyArray;
    if (periodType === "monthly") return monthlyArray;
    return dailyArray;
  };

  // 차트 x축 key 반환
  const getXAxisKey = () => {
    if (periodType === "daily") return "date";
    if (periodType === "weekly") return "week";
    if (periodType === "monthly") return "month";
    return "date";
  };

  // 선택된 기간 타입에 따라 차트 제목 변환
  const getPeriodLabel = () => {
    if (periodType === "daily") return "일별 이용량";
    if (periodType === "weekly") return "주별 이용량";
    if (periodType === "monthly") return "월별 이용량";
    return "이용량";
  };

  const total = (repairAmount || []).reduce((sum, r) => sum + r.repairAmount, 0);

  return (
    <div className="page">
      {/* SUMMARY */}
      <div className="status-card">
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">오늘 총 이용량</p>
              <p className="count">{todayWorkList.length} 건</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#fef9c2" }}>
              <Clock className="icon" style={{ color: "orange" }} />
            </div>
          </div>
        </div>
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">이번 달 매출</p>
              <p className="count">₩ {total.toLocaleString("ko-KR")}</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#d0fae5" }}>
              <DollarSign className="icon" style={{ color: "#009966" }} />
            </div>
          </div>
        </div>
        <div className="status-component">
          <div className="card-item">
            <div>
              <p className="text">이번 주 신규 회원</p>
              <p className="count">{thisWeek.reduce((sum, count) => sum + count, 0)} 명</p>
            </div>
            <div className="card-icon" style={{ backgroundColor: "#f3e8ff" }}>
              <UserPlus className="icon" style={{ color: "purple" }} />
            </div>
          </div>
        </div>
      </div>

      {/* 이용량 차트 */}
      <div className="chart-container">
        <div className="chart-box">
          <div className="use-area">
            <h3 className="use-area-chart-title">{getPeriodLabel()} 통계</h3>
            <div className="period-buttons">
              <button
                onClick={() => setPeriodType("daily")}
                className={`period-btn ${periodType === "daily" ? "active" : ""}`}
              >
                일별
              </button>
              <button
                onClick={() => setPeriodType("weekly")}
                className={`period-btn ${periodType === "weekly" ? "active" : ""}`}
              >
                주별
              </button>
              <button
                onClick={() => setPeriodType("monthly")}
                className={`period-btn ${periodType === "monthly" ? "active" : ""}`}
              >
                월별
              </button>
            </div>
          </div>
        </div>
          <div className="line-chart">
            <div className="chart-fixed-260">
                <StatisticsByDateChart
                  data={getCurrentData()}
                  xKey={getXAxisKey()}
                  periodType={periodType}
                />
            </div>
          </div>
      </div>

      {/* 하단 차트 */}
      <div className="bottom-chart">
        <div className="chart-card">
          <div className="chart-title">서비스 유형별 이용 비율</div>
            <div className="chart-content">
              <div className="chart-fixed-260">
                {isLoaded && <UseByAreaPieChart workList={todayWorkList} />}
              </div>
            </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">요일별 신규 회원 수</div>
            <div className="chart-card-body">
              <div className="chart-fixed-320">
                <MembershipChart thisWeek={thisWeek} lastWeek={lastWeek} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
