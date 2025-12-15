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

const StatisticsByDateChart = ({ data, xKey, periodType }) => {
  const formatXAxisLabel = (value) => {
    if (periodType === "daily") return `${value}일`;
    if (periodType === "monthly") return `${value}`;
    if (periodType === "yearly") return `${value}별`;
    return value;
  };
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickFormatter={formatXAxisLabel} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#2D8CFF" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StatisticsByDateChart;
