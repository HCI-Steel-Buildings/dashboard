import React from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);

interface Props {
  weeklyCounts: number[];
}

const QuotesChart: React.FC<Props> = ({ weeklyCounts }) => {
  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Quotes per Week",
        data: weeklyCounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    scales: {
      x: {
        type: "category", // Explicitly define the x-axis type as 'category'
        title: {
          display: true,
          text: "Week",
        },
      },
      y: {
        type: "linear", // Explicitly define the y-axis type as 'linear'
        title: {
          display: true,
          text: "Quotes",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default QuotesChart;
