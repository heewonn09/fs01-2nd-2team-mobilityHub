import React, { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

const COLORS = {
  park: "#76A7FA",
  carwash: "#FFA500",
  repair: "#FF6347",
  Unknown: "#C0C0C0",
};

const UseByAreaPieChart = ({ workList }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!workList || workList.length === 0) return;

    const areaCountMap = workList.reduce((acc, item) => {
      const types = (item.workType || "Unknown").split(",");
      types.forEach((type) => {
        const key = type.trim();
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {});

    const result = Object.entries(areaCountMap).map(([key, value]) => ({
      area: key,
      count: value,
    }));

    setChartData(result);
  }, [workList]);

  if (chartData.length === 0) {
    return <div>데이터 없음</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="area"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[entry.area] || "#999"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default UseByAreaPieChart;
