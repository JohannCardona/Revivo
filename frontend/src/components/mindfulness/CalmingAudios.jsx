import React, { useState, useRef } from "react";
import "../../styles/motivation/audios.css";
import audio from "../../audio/rainSounds.flac";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import CloseIcon from "@mui/icons-material/Close";

const audios1 = [
  {
    category: "Emotional regulation",
    audios: [
      { id: 1, title: "Guidance Meditation", src: audio },
      { id: 2, title: "Breathing Exercises", src: audio },
      { id: 3, title: "Rainfall", src: audio },
    ],
  },
  {
    category: "Coping mechanisms",
    audios: [
      { id: 4, title: "Guidance Meditation", src: audio },
      { id: 5, title: "Breathing Exercises", src: audio },
      { id: 6, title: "Rainfall", src: audio },
    ],
  },
  {
    category: "Mindfulness and meditation",
    audios: [
      { id: 7, title: "Guidance Meditation", src: audio },
      { id: 8, title: "Breathing Exercises", src: audio },
      { id: 9, title: "Rainfall", src: audio },
    ],
  },
  {
    category: "Resilience building",
    audios: [
      { id: 10, title: "Guidance Meditation", src: audio },
      { id: 11, title: "Breathing Exercises", src: audio },
      { id: 12, title: "Rainfall", src: audio },
    ],
  },
];

const AudioPlayer = () => {
  const [playAudio, setPlayAudio] = useState({});
  const [audioProgress, setAudioProgress] = useState({});
  const audioRef = useRef({});

  const handleAudioDurationFormat = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleToggleAudioPlayer = (item) => {
    setPlayAudio((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleToggleAudio = (item) => {
    const audioFile = audioRef.current[item];
    if (audioFile.paused) {
      audioFile.play();
    }
  };

  const handleAudioStop = (item) => {
    const audioFile = audioRef.current[item];
    if (audioFile.play) {
      audioFile.pause();
    }
  }

  const handleAudioProgressBar = (item, value) => {
    const audioFile = audioRef.current[item];
    audioFile.currentTime = value;
    setAudioProgress((prev) => ({ ...prev, [item]: value }));
  };

  return (
    <div className="audios-container">
      <h1>Audios for Relaxation</h1>
      {audios1.map((au) => (
        <div>
          <h2>{au.category}</h2>
          {au.audios.map((audio_item) => (
            <>
              <div className="audios-section-item">
                {!playAudio[audio_item.id] ? (
                  <>
                    <input
                      type="button"
                      className="listen-button-controls"
                      onClick={() => handleToggleAudioPlayer(audio_item.id)}
                      value="Listen Now"
                    />
                  </>
                ) : (
                  <div className="close-button-container">
                    <CloseIcon
                      sx={{
                        fontSize: 35,
                        color: "white",
                        position: "absolute",
                        marginTop: "7px",
                        marginLeft: "28px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleToggleAudioPlayer(audio_item.id)}
                    />
                    <input
                      type="button"
                      className="listen-button-controls isClose"
                      onClick={() => handleToggleAudioPlayer(audio_item.id)}
                    />
                  </div>
                )}
                <h3>{audio_item.title}</h3>
                {playAudio[audio_item.id] && (
                  <>
                    <audio
                      ref={(id) => (audioRef.current[audio_item.id] = id)}
                      src={audio_item.src}
                      onTimeUpdate={(e) => {
                        const audioFile = e.target;
                        setAudioProgress((prev) => ({
                          ...prev,
                          [audio_item.id]: audioFile.currentTime,
                        }));
                        document.getElementById(
                          `duration-${audio_item.id}`
                        ).textContent = `${handleAudioDurationFormat(
                          audioFile.currentTime
                        )} / ${handleAudioDurationFormat(
                          audioFile.duration || 0
                        )}`;
                      }}
                    />
                    <div className="listen-button">
                      <div className="audios-section-item-progress">
                        <div className="play-button">
                          <FaPlay
                            onClick={() => handleToggleAudio(audio_item.id)}
                          />
                          <input
                            style={{ width: 60 }}
                            type="button"
                            onClick={() => handleToggleAudio(audio_item.id)}
                          />
                        </div>
                        <div className="play-button stop">
                          <FaPause
                            onClick={() => handleAudioStop(audio_item.id)}
                          />
                          <input
                            type="button"
                            style={{ width: 60 }}
                            onClick={() => handleAudioStop(audio_item.id)}
                          />
                        </div>
                        <input
                          type="range"
                          name=""
                          id=""
                          min="0"
                          max={audioRef.current[audio_item.id]?.duration || 0}
                          value={audioProgress[audio_item.id] || 0}
                          onChange={(e) =>
                            handleAudioProgressBar(
                              audio_item.id,
                              parseFloat(e.target.value)
                            )
                          }
                        />
                        <div
                          id={`duration-${audio_item.id}`}
                          className="audios-section-item-duration"
                        >
                          00:00 / 00:00
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AudioPlayer;
