import React, { useEffect, useState } from "react";
import "../style/StatisticsSection.css";
import { getRepairAmount } from "../../api/repairAPI";
import { getTodayWorkList, getWorkInfoList } from "../../api/workInfoAPI";
import StatisticsByDateChart from "../chart/StatisticsByDateChart";
import UseByAreaPieChart from "../chart/UseByAreaPieChart";
import MembershipChart from "../chart/MembershipChart";
import { Clock, DollarSign, UserPlus } from "lucide-react";
import { getUserInfo } from "../../api/newUser";

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

  /* ===================== 초기 데이터 로딩 ===================== */
  useEffect(() => {
    Promise.all([getWorkInfoList(), getUserInfo(), getRepairAmount()])
      .then(([workRes, userRes, repairRes]) => {
        setWorkList(workRes.data || workRes);
        setUserList(userRes.data || userRes);
        setRepairAmount(repairRes.data || repairRes);
        setIsLoaded(true);
      })
      .catch(console.error);
  }, []);

  /* ===================== 오늘 작업 가져오기 (파이 차트) ===================== */
  useEffect(() => {
    getTodayWorkList()
      .then((res) => setTodayWorkList(res.data || res))
      .catch(console.error);
  }, []);

  /* ===================== 회원 주간 차트 ===================== */
  const getDayIndex = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const weeklyChartData = (users) => {
    const thisWeek = Array(7).fill(0);
    const lastWeek = Array(7).fill(0);

    const today = new Date();
    const day = today.getDay() === 0 ? 7 : today.getDay();

    // 이번 주 월요일
    const startOfThisWeek = new Date(today);

    startOfThisWeek.setDate(today.getDate() - day + 1);
    startOfThisWeek.setHours(0, 0, 0, 0);

    // 지난 주 월요일
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    users.forEach((user) => {
      if (!user.createDate) return;
      const regDate = new Date(user.createDate);
      const dayIndex = getDayIndex(user.createDate);

      if (regDate >= startOfThisWeek) thisWeek[dayIndex]++;
      else if (regDate >= startOfLastWeek && regDate < startOfThisWeek)
        lastWeek[dayIndex]++;
    });

    return { thisWeek, lastWeek };
  };

  const { thisWeek, lastWeek } = weeklyChartData(userList);

  /* ===================== 이용량 차트 ===================== */
  const now = new Date();
  const startOfWeek = new Date(now);
  const todayDay = now.getDay() === 0 ? 7 : now.getDay();
  startOfWeek.setDate(now.getDate() - todayDay + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  // 일별 (이번 주 7일만)
  const dailyArray = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const count = workList.filter((w) => {
      const d = new Date(w.entryTime);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    }).length;
    return { date: `${day.getMonth() + 1}/${day.getDate()}`, count };
  });

  // 주별 (이번 달 1~4주)
  const thisMonth = now.getMonth();
  const weeklyArray = Array.from({ length: 4 }, (_, i) => {
    const count = workList.filter((w) => {
      const d = new Date(w.entryTime);
      const week = Math.ceil(d.getDate() / 7);
      return d.getMonth() === thisMonth && week === i + 1;
    }).length;
    return { week: `${i + 1}주`, count };
  });

  // 월별 (이번 년 1~12월)
  const thisYear = now.getFullYear();
  const monthlyArray = Array.from({ length: 12 }, (_, i) => {
    const count = workList.filter((w) => {
      const d = new Date(w.entryTime);
      return d.getFullYear() === thisYear && d.getMonth() === i;
    }).length;
    return { month: `${i + 1}월`, count };
  });

  const getCurrentData = () => {
    if (periodType === "daily") return dailyArray;
    if (periodType === "weekly") return weeklyArray;
    if (periodType === "monthly") return monthlyArray;
    return dailyArray;
  };

  const getXAxisKey = () => {
    if (periodType === "daily") return "date";
    if (periodType === "weekly") return "week";
    if (periodType === "monthly") return "month";
    return "date";
  };

  const getPeriodLabel = () => {
    if (periodType === "daily") return "일별 이용량";
    if (periodType === "weekly") return "주별 이용량";
    if (periodType === "monthly") return "월별 이용량";
    return "이용량";
  };

  /* ===================== 총 매출 ===================== */
  const total = (repairAmount || []).reduce(
    (sum, r) => sum + r.repairAmount,
    0
  );
  console.log(thisWeek);
  /* ===================== 렌더 ===================== */
  return (
    <div className="statistics-page">
      {/* SUMMARY */}
      <div className="summary-row">
        <div className="summary-card">
          <div>
            <p className="summary-title">오늘 총 이용량</p>
            <p className="summary-value">{todayWorkList.length} 건</p>
          </div>
          <div className="card-icon" style={{ backgroundColor: "#fef9c2" }}>
            <Clock className="icon" style={{ color: "orange" }} />
          </div>
        </div>
        <div className="summary-card">
          <div>
            <p className="summary-title">이번 달 매출</p>
            <p className="summary-value">₩{total.toLocaleString("ko-KR")}</p>
          </div>
          <div className="card-icon" style={{ backgroundColor: "#d0fae5" }}>
            <DollarSign className="icon" style={{ color: "#009966" }} />
          </div>
        </div>
        <div className="summary-card">
          <div>
            <p className="summary-title">이번 주 신규 회원</p>
            <p className="summary-value">
              {thisWeek.reduce((sum, count) => sum + count, 0)} 명
            </p>
          </div>
          <div className="card-icon" style={{ backgroundColor: "#f3e8ff" }}>
            <UserPlus className="icon" style={{ color: "purple" }} />
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
                className={`period-btn ${
                  periodType === "daily" ? "active" : ""
                }`}
              >
                일별
              </button>
              <button
                onClick={() => setPeriodType("weekly")}
                className={`period-btn ${
                  periodType === "weekly" ? "active" : ""
                }`}
              >
                주별
              </button>
              <button
                onClick={() => setPeriodType("monthly")}
                className={`period-btn ${
                  periodType === "monthly" ? "active" : ""
                }`}
              >
                월별
              </button>
            </div>
          </div>
        </div>
        <div className="line-chart" style={{ height: "300px" }}>
          {getCurrentData().length > 0 && (
            <StatisticsByDateChart
              data={getCurrentData()}
              xKey={getXAxisKey()}
              periodType={periodType}
            />
          )}
        </div>
      </div>

      {/* 하단 차트 */}
      <div className="bottom-chart">
        <div className="chart-card">
          <div className="chart-title">서비스 유형별 이용 비율</div>
          <div className="chart-content" style={{ backgroundColor: "#f7f7f7" }}>
            <div className="chart-height-260">
              {isLoaded && <UseByAreaPieChart workList={todayWorkList} />}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">요일별 신규 회원 수</div>
          <div className="chart-card-body">
            <div className="chart-height-260">
              <MembershipChart thisWeek={thisWeek} lastWeek={lastWeek} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
