import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const MembershipChart = ({ thisWeek, lastWeek }) => {

  const options = {
    colors: ["#FCB9AA", "#55CBCD"],

    chart: {
      type: "line",
      backgroundColor: "#F7F7F7",
    },

    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["월", "화", "수", "목", "금", "토", "일"],
    },

    yAxis: {
      min: 0,
      max: 10,
      tickInterval: 1,
      title: {
        text: "사용자 수",
      },
    },

    accessibility: {
      enabled: false,
    },

    // 실제 차트에 표시될 데이터
    series: [
      {
        name: "이번 주",
        data: thisWeek,
      },
      {
        name: "지난 주",
        data: lastWeek,
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: "100%" } }}
    />
  );
};

export default MembershipChart;
