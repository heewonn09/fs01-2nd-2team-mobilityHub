import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const UseByArea = ({ workList }) => {
  // console.log("받은데이터: ", workList)
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!workList || workList.length === 0) return;

    const dataMap = workList.reduce((acc, item) => {
      const types = (item.workType || "Unknown").split(","); // 주차,세차 또는 주차, 정비
      types.forEach((type) => {
        const trimmed = type.trim(); // 공백 제거
        acc[trimmed] = (acc[trimmed] || 0) + 1;  // 해당 유형이 이미 있으면 +1
      });
      return acc;
    }, {});

    const colorMap = {
      park: "#76A7FA",
      carwash: "#FFA500",
      repair: "#FF6347",
      Unknown: "#C0C0C0",
    };

    const data = [
      ["작업 유형", "이용수", { role: "style" }, { role: "annotation" }],
      ...Object.entries(dataMap).map(([type, count]) => [     // [키, 값] 형태의 배열로 변환
        type,
        count,
        colorMap[type] || "#76A7FA",
        count,
      ]),
    ];

    setChartData(data);
  }, [workList]);

  if (!chartData || chartData.length === 0) return <div>데이터가 없습니다</div>;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="100%"
        data={chartData}
        options={{
          legend: { position: "none" },
          hAxis: { title: "작업 유형" }, // X축
          vAxis: { title: "이용수" }, // Y축
          bar: { groupWidth: "60%" },
          annotations: {
            alwaysOutside: true,
            textStyle: { fontSize: 12, color: "#000" },
          },
        }}
      />
    </div>
  );
};

export default UseByArea;
