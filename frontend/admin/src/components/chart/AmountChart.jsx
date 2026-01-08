import React, { useMemo } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";


const AmountChart = ({ data }) => {

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const dailyMap = {};

    data.forEach((item) => {
      // reportId에서 날짜 추출
      const dayKey = item.reportId.substring(0, 8);

      // 일별 정비 건수 누적
      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + 1;
    });

    // 날짜순 정렬 후 recharts용 배열로 변환
    return Object.keys(dailyMap)
      .sort()
      .map((day) => ({
        day,
        count: dailyMap[day],
      }));
  }, [data]);

  // 차트 X축 표시 형식: DD일
  const formatXAxisLabel = (value) => `${value.substring(6, 8)}일`;

  return (
    <div style={{ marginTop: "30px" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="count" stroke="#09ff00ff" strokeWidth={2} />
          <XAxis dataKey="day" tickFormatter={formatXAxisLabel} tickLine={false} />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AmountChart;
