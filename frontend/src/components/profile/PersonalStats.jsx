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
import "../../styles/dashboard/Plots.css";
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
  let total_day_count = 0;
  let total_night_count = 0;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Daily User Login Frequency",
      },
    },
  };

  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Day vs Night: User Login Frequency",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Most Frequent Keywords In Conversations",
      },
    },
  };

  const dataset = (statsData) => {
    if (statsData) {
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
            backgroundColor: color[1],
          },
        ],
      };
    }
  };

  const dataset1 = (statsData) => {
    if (statsData) {
      return {
        labels: statsData.days.map((d) => d.date),
        datasets: [
          {
            label: "Login count",
            data: statsData.days.map((d) => d.count),
            backgroundColor: color[2],
          },
        ],
      };
    }
  };

  const dataset2 = (statsData, title, label, data) => {
    if (statsData) {
      return {
        labels: statsData.map((k) => k[label]),
        datasets: [
          {
            label: title,
            data: statsData.map((f) => f[data]),
            backgroundColor: color[3],
          },
        ],
      };
    }
  };

  const color = ["#77c3a6", "#565656", "#587bda", "#16bec5"];
  const [periodStatsData, setPeriodStatsData] = useState(null);
  const [dayStatsData, setDayStatsData] = useState(null);
  const [keywordData, setKeywordData] = useState({
    frequency: [],
    keyword: [],
  });
  const [songGenreCount, setSonGenreCount] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const timeout = (m) => new Promise((s) => setTimeout(s, m));

  const getUserData = async () => {
    setLoading(true);
    await timeout(50);
    axios
      .get("http://localhost:5000/user_login_info", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPeriodStatsData(dataset(response.data));
        setDayStatsData(dataset1(response.data));
        setLoading(false);
      });
  };

  const getKeywordFrequencyData = async () => {
    setLoading(true);
    await timeout(200);
    axios
      .get("http://localhost:5000/keyword_frequency", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const responses = response?.data?.result;
          setKeywordData(dataset2(responses, "Keywords", "keyword", "frequency"));
          setLoading(false);
        } else if (response.status === 204) {
          setKeywordData(dataset2([], "Keywords"));
        }
      });
  };

  const getSongGenreCount = async () => {
    setLoading(true);
    await timeout(200);
    axios
      .get("http://localhost:5000/get_song_genre_count", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const responses = response?.data?.result;
          setSonGenreCount(
            dataset2(
              responses,
              "Song Genres",
              "songGenre",
              "count"
            )
          );
          setLoading(false);
        } else if (response.status === 204) {
          setSonGenreCount(
            dataset2([], "Song Genres", "songGenre", "count")
          );
        }
      });
  };

  useEffect(() => {
    getUserData();
    getKeywordFrequencyData();
  }, []);

  if (periodStatsData) {
    total_day_count = periodStatsData.datasets[0].data.reduce(
      (a, b) => a + b,
      0
    );
    total_night_count = periodStatsData.datasets[1].data.reduce(
      (a, b) => a + b,
      0
    );
  }

  const user = localStorage.getItem("user");
  const morning =
    user +
    ", you seem to be more of a morning person as you have been more active during the day. 😊";
  const night =
    user +
    ", you seem to be a night owl as you have been more active during the night. 😊";
  const balance =
    user +
    ", you seem to be a 'cathemeral'. It is a fancy word used in biology for people who are equally active during the day and night. 😊";

  return (
    <div className="main-container">
      <div className="stats-container">
        <h1>Dashboard</h1>
        <h2
          id="statistics"
          style={{
            color: "var(--text)",
            borderBottom: "2px solid var(--sidebar-text)",
            width: "10.5rem",
          }}
        >
          User Statistics
        </h2>
        {periodStatsData ? (
          <p>
            {total_day_count - total_night_count > 0
              ? morning
              : total_day_count - total_night_count === 0
              ? balance
              : night}
          </p>
        ) : (
          ""
        )}

        {loading ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "100px auto",
              }}
            >
              <Audio
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="audio-loading"
                wrapperStyle={{}}
                wrapperClass="wrapper-class"
                visible={true}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: 10 }}>
              <Bar options={options1} data={periodStatsData} />
            </div>
          </>
        )}
        {dayStatsData ? (
          <>
            <div style={{ marginTop: 40 }}>
              <Bar options={options} data={dayStatsData} />
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "100px auto",
              }}
            >
              <Audio
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="audio-loading"
                wrapperStyle={{}}
                wrapperClass="wrapper-class"
                visible={true}
              />
            </div>
          </>
        ) : Array.isArray(keywordData.labels) &&
          keywordData.labels.length > 0 ? (
          <div style={{ marginTop: 40 }}>
            <Bar options={options} data={keywordData} />
          </div>
        ) : null}
        {loading ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "100px auto",
              }}
            >
              <Audio
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="audio-loading"
                wrapperStyle={{}}
                wrapperClass="wrapper-class"
                visible={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PersonalStats;
