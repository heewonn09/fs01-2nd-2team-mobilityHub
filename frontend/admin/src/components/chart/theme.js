const customTheme = {
  axis: {
    style: {
      grid: {
        stroke: "none",
      },
      axis: {
        stroke: "transparent", 
      },
      ticks: {
        stroke: "transparent", 
      },
      tickLabels: {
        fill: "#292929", 
      },
    },
  },

  dependentAxis: {
    style: {
      tickLabels: {
        fill: "transparent", 
      },
      axis: {
        stroke: "transparent",
      },
      ticks: {
        stroke: "transparent", 
      },
      grid: {
        stroke: "none",
      },
    },
  },

  bar: {
    style: {
      data: {
        fill: "#2D7FF9",
        padding: 8,
        strokeWidth: 0,
        fillOpacity: 0.5,
      },
      labels: {
        fontFamily: "'Inter', 'Helvetica Neue', 'Seravek', 'Helvetica', sans-serif",
        fontSize: 12,
        fontWeight: 300,
        letterSpacing: "normal",
        padding: 8,
        fill: "#292929",
        stroke: "transparent",
      },
    },
    cornerRadius: {
      top: 1,
    },
    padding: 60,
    colorScale: [
      "#2D7FF9",
      "#18BFFF",
      "#20C933",
      "#FCB400",
      "#FF6F2C",
      "#F82B60",
      "#8B46FF",
      "#20D9D2",
    ],
  },
};

export default customTheme;
