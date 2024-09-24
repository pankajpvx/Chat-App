import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { CategoryScale, plugins } from "chart.js";
import ChartJS from "chart.js/auto";
import { orange, orangeLight, purple } from "../../constants/colors";
import { getLast7days } from "../../utils/features";
ChartJS.register(CategoryScale);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },

    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineCharts = ({ value = [] }) => {
  const data = {
    labels: getLast7days(),
    datasets: [
      {
        data: value,
        label: "messages",
        fill: true,
        backgroundColor: purple(0.2),
        borderColor: purple(),
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        fill: false,
        backgroundColor: [purple(0.2), orangeLight],
        borderColor: [purple(), orange],
        hoverBackgroundColor: [purple(), orange],
        offset: 20,
      },
    ],
  };
  return (
    <Doughnut
      data={data}
      options={doughnutChartOptions}
      style={{ zIndex: 10 }}
    />
  );
};

export { DoughnutChart, LineCharts };
