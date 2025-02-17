import React, { useState, useRef } from "react";
import "../../styles/motivation/audios.css";
import rain_audio from "../../audio/rainSounds.flac";
import bird_audio from "../../audio/birds-sound.mp3";
import wave_audio from "../../audio/crete-waves-sound.flac";
import wind_audio from "../../audio/wind-sounds.mp3";
import waterfall_audio from "../../audio/waterfall.mp3";
import white_noise_audio from "../../audio/white-noise.mp3";
import brown_noise_audio from "../../audio/brown-noise.mp3";
import pink_noise_audio from "../../audio/pink-noise.mp3";
import strength_audio from "../../audio/building-strength.mp3";
import breathing_audio from "../../audio/breathing-exercises.mp3";
import study_audio from "../../audio/study-session.mp3";
import selfworth_audio from "../../audio/self-worth-meditation.mp3";
import self_love from "../../audio/self-love-meditation.mp3";
import selfcare_audio from "../../audio/self-care.mp3";
import progressing_audio from "../../audio/progressive-muscle-relaxation.mp3";
import challenge_audio from "../../audio/overcome-challenges.mp3";
import grounding_audio from "../../audio/grounding-meditation.mp3";
import release_emotions_audio from "../../audio/anxiety-meditation.mp3";
import gentle_audio from "../../audio/gentle-movement.mp3";
import sleep_audio from "../../audio/sleep-meditation.mp3";
import healing_audio from "../../audio/healing-meditation.mp3";
import intense_focus_audio from "../../audio/intense-focus.mp3";
import positive_audio from "../../audio/positive-affirmations.mp3";
import sleep_better_audio from "../../audio/sleep-better.mp3";
import anxiety_letting_go_audio from "../../audio/letting-go.mp3";
import letting_go_med_audio from "../../audio/letting-go-meditation.mp3";
import loving_audio from "../../audio/loving-kindness.m4a";
import walking_audio from "../../audio/mindful-walking-meditation.mp3";
import moment_audio from "../../audio/moment-meditation.mp3";
import piano_audio from "../../audio/piano-sounds.mp3";
import bowls_audio from "../../audio/singing-bowl.mp3";
import positive_energy_audio from "../../audio/positive-energy-boost.mp3";
import productivity_audio from "../../audio/productivity-music.mp3";
import emotions_audio from "../../audio/emotions-audio.mp3";
import gratitude_audio from "../../audio/gratitude_meditation.mp3";
import body_audio from "../../audio/body-scan-5min.m4a";
import beats_audio from "../../audio/alpha-waves.mp3";
import bedtime_audio from "../../audio/bedtime-stories.mp3";
import zen_audio from "../../audio/zen-meditation.mp3";
import guided_audio from "../../audio/guided-meditation.mp3";
import stress_audio from "../../audio/stress-meditation.mp3";
import emotional_audio from "../../audio/balancing-recovery-meditation.mp3";
import calm_audio from "../../audio/calm-centered.mp3";
import uplifting_audio from "../../audio/Uplifting.mp3";
import body_mind_audio from "../../audio/5-Simple-Ways-to-Develop-Emotional-Intelligence.mp3";
import emotional_aware_audio from "../../audio/8-Ways-to-Become-More-Emotionally-Mature.mp3";
import atmospheric_audio from "../../audio/atmospheric.mp3";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import CloseIcon from "@mui/icons-material/Close";
import ScrollToSection from "../ScrollToSection";
import AudiosSidebar from "./AudiosSidebar";

const audios1 = [
  {
    id: "emotional_regulation",
    category: "Emotional regulation",
    audios: [
      { id: 1, title: "Guidance Meditation", src: audio },
      { id: 2, title: "Breathing Exercises", src: audio },
      { id: 3, title: "Rainfall", src: audio },
    ],
  },
  {
    id: "coping_mechanisms",
    category: "Coping mechanisms",
    audios: [
      { id: 4, title: "Guidance Meditation", src: audio },
      { id: 5, title: "Breathing Exercises", src: audio },
      { id: 6, title: "Rainfall", src: audio },
    ],
  },
  {
    id: "mindfulness_meditation",
    category: "Mindfulness and meditation",
    audios: [
      { id: 7, title: "Guidance Meditation", src: audio },
      { id: 8, title: "Breathing Exercises", src: audio },
      { id: 9, title: "Rainfall", src: audio },
    ],
  },
  {
    id: "resilience_building",
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
  const [audioPlaying, setAudioPlaying] = useState(false);
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
      setAudioPlaying(true);
    } else {
      audioFile.pause();
      setAudioPlaying(false);
    }
  };

  const handleAudioProgressBar = (item, value) => {
    const audioFile = audioRef.current[item];
    audioFile.currentTime = value;
    setAudioProgress((prev) => ({ ...prev, [item]: value }));
  };

  return (
    <div className="main-container">
      <ScrollToSection />
      <div>
        <Sidebar sidebar_links={sidebar_links} />
      </div>
      <div className="audios-container">
        <h1>Audios for Relaxation</h1>
        {audios1.map((au, key) => (
          <div key={key}>
            <h2 id={au.id}>{au.category}</h2>
            {au.audios.map((audio_item) => (
              <>
                <div className="audios-section-item">
                  {!playAudio[audio_item.id] ? (
                    <>
                      <input
                        type="button"
                        className="mood-submit"
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
                          marginTop: "9px",
                          marginLeft: "19px",
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
                            {audioPlaying ? (
                              <FaPause
                                className="stop"
                                onClick={() => handleToggleAudio(audio_item.id)}
                              />
                            ) : (
                              <FaPlay
                                onClick={() => handleToggleAudio(audio_item.id)}
                              />
                            )}
                            <input
                              style={{ width: 60 }}
                              type="button"
                              onClick={() => handleToggleAudio(audio_item.id)}
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
    </div>
  );
};

export default AudioPlayer;
