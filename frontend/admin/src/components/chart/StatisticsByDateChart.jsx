import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const StatisticsByDateChart = ({ data, xKey }) => {

  if (!data || data.length === 0) {
    return <div style={{ height: 240 }} />;
  }

  return (
  <ResponsiveContainer width="100%" height={240}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" stroke="#2D8CFF" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
  );
};

export default StatisticsByDateChart;
