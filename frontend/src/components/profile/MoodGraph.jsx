import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  PointElement,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  PointElement,
  Legend
);

function MoodGraph({ data }) {
  const moods = {
    Joy: 6,
    Love: 5,
    Surprise: 4,
    Fear: 3,
    Anger: 2,
    Sadness: 1,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (item) {
            return Object.keys(moods).find((i) => moods[i] === item || item);
          },
          stepSize: 1,
        },
      },
    },
  };

  const moodData = {
    labels: data.map((item) => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Mood Level",
        data: data.map((item) => moods[item.mood]),
        borderColor: "rgba(118, 246, 246)",
        backgroundColor: "rgba(82, 159, 159, 0.2)",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div>
      <Line data={moodData} options={chartOptions} />
    </div>
  );
}

export default MoodGraph;
