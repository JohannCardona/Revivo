import React, { useState, useEffect } from "react";
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
import axios from "axios";
import NoteModal from "./NoteModal";

Chart.register(
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  PointElement,
  Legend
);

function MoodGraph() {
  const [userMoodData, setUserMoodData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectUserNote, setSelectUserNote] = useState(null);

  const fetchUserMoods = async () => {
    await axios
      .get("http://localhost:5000/fetch_user_moods", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserMoodData(response.data.result);
      });
  };

  useEffect(() => {
    fetchUserMoods();
  }, [userMoodData]);

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
            return Object.keys(moods).find((i) => moods[i] === item) || item;
          },
          stepSize: 1,
        },
      },
    },
    onClick: (_, elements) => {
      displayNotesModal(elements);
    },
  };

  const displayNotesModal = (dataPoints) => {
    if (dataPoints.length > 0) {
      const dataPointIndex = dataPoints[0].index;
      const clickedDataPoint = userMoodData[dataPointIndex];
      setSelectUserNote(clickedDataPoint.userNote || "No note available");
      setOpenModal(true);
    }
  };

  const moodData = {
    labels: userMoodData.map((item) =>
      new Date(item.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Mood Level",
        data: userMoodData.map((item) => moods[item.mood]),
        borderColor: "#397061",
        backgroundColor: "#50a081",
        tension: 0.5,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div>
      {userMoodData.length > 0 ? (
        <p className="mood-info">
          Tap on any point on the graph to view your mood entry and notes for a
          specific date.
        </p>
      ) : (
        ""
      )}
      <Line data={moodData} options={chartOptions} />
      {openModal && (
        <NoteModal
          selectUserNote={selectUserNote}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}

export default MoodGraph;
