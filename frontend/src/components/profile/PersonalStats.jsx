import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "../../styles/Plots.css";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Audio } from "react-loader-spinner";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PersonalStats() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Personal Data",
      },
    },
  };

  const dataset = (statsData) => {
    if (statsData) {
      console.log(statsData);

      return {
        labels: statsData.days.map((d) => d.date),
        datasets: [
          {
            label: "Day",
            data: statsData.days.map((d) => d.day_count),
            backgroundColor: color[0],
          },
          {
            label: "Night",
            data: statsData.days.map((d) => d.night_count),
            backgroundColor: "black",
          },
        ],
      };
    }
  };

  const dataset1 = (statsData) => {
    if (statsData) {
      console.log(statsData);
      return {
        labels: statsData.days.map((d) => d.date),
        datasets: [
          {
            label: "Day",
            data: statsData.days.map((d) => d.count),
            backgroundColor: color[0],
          },
        ],
      };
    }
  };

  const color = ["#003f5c"];
  const [periodStatsData, setPeriodStatsData] = useState(null);
  const [dayStatsData, setDayStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeout = (m) => new Promise((s) => setTimeout(s, m));

  const getUserData = async () => {
    setLoading(true);
    await timeout(300);
    axios
      .get("http://localhost:5000/user_login_info", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        setPeriodStatsData(dataset(response.data));
        setDayStatsData(dataset1(response.data));
        setLoading(false);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="stats-container">
      <h2>User statistics</h2>
      <div className="underline"></div>
      {loading ? (
        <Audio
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      ) : (
        <Bar options={options} data={periodStatsData} />
      )}
      {dayStatsData ? (
        <Bar options={options} data={dayStatsData} />
      ) : (
        <Audio
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      )}
      {loading ? (
        <Audio
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
      ) : (
        <Bar options={options} data={dayStatsData} />
      )}
    </div>
  );
}

export default PersonalStats;
