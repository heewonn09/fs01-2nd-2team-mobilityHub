import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MyCalendar = ({ style }) => {
  const [date, setDate] = useState(new Date());

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "50px",
      }}
    >
      <Calendar onChange={setDate} value={date} />
      <p>선택한 날짜: {date.toLocaleDateString()}</p>
    </div>
  );
};

export default MyCalendar;
