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
import release_emotions_audio from "../../audio/release-emotions.mp3";
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
import { handleAudioDurationFormat } from "./AudioDurationFormatter";

const audios1 = [
  {
    id: "meditation",
    category: "Meditation",
    audios: [
      { id: 1, title: "Guided Mindfulness Meditation", src: guided_audio },
      { id: 2, title: "Body Scan Meditation", src: body_audio },
      { id: 3, title: "Loving-Kindness Meditation", src: loving_audio },
      { id: 4, title: "Zen Meditation", src: zen_audio },
    ],
  },
  {
    id: "mindfulness",
    category: "Mindfulness",
    audios: [
      { id: 5, title: "Mindful Breathing Exercise", src: breathing_audio },
      { id: 6, title: "Present Moment Awareness", src: moment_audio },
      { id: 7, title: "Mindful Walking Meditation", src: walking_audio },
    ],
  },
  {
    id: "emotional-regulation",
    category: "Emotional Regulation",
    audios: [
      { id: 8, title: "Calm Your Emotions", src: release_emotions_audio },
      { id: 9, title: "Release and Let Go", src: letting_go_med_audio },
      { id: 10, title: "Self-Companion Journey", src: selfworth_audio },
      {
        id: 11,
        title: "Emotional Awareness Exercise",
        src: emotional_aware_audio,
      },
    ],
  },
  {
    id: "anxiety-relief",
    category: "Anxiety Relief",
    audios: [
      {
        id: 12,
        title: "Anxiety Soothing Session",
        src: anxiety_letting_go_audio,
      },
      { id: 13, title: "Grounding Exercises", src: grounding_audio },
      { id: 14, title: "Calm and Centered Meditation", src: calm_audio },
    ],
  },
  {
    id: "stress-management",
    category: "Stress Management",
    audios: [
      { id: 15, title: "Stress Relief Meditation", src: stress_audio },
      {
        id: 16,
        title: "Progressive Muscle Relaxation",
        src: progressing_audio,
      },
      { id: 17, title: "Calming Music", src: calm_audio },
    ],
  },
  {
    id: "self-care-affirmations",
    category: "Self-Care & Affirmations",
    audios: [
      { id: 18, title: "Positive Affirmations", src: positive_audio },
      { id: 19, title: "Self-Love Meditation", src: self_love },
      { id: 20, title: "Self-Care Meditation", src: selfcare_audio },
    ],
  },
  {
    id: "resilience-empowerment",
    category: "Resilience & Empowerment",
    audios: [
      { id: 21, title: "Building Inner Strength", src: strength_audio },
      { id: 22, title: "Empowerment Affirmations", src: positive_audio },
      { id: 23, title: "Overcoming Challenges", src: challenge_audio },
    ],
  },
  {
    id: "emotional-healing",
    category: "Emotional Healing",
    audios: [
      { id: 24, title: "Healing Meditation", src: healing_audio },
      { id: 25, title: "Letting Go of Pain", src: emotions_audio },
      { id: 26, title: "Emotional Recovery Journey", src: emotional_audio },
    ],
  },
  {
    id: "gratitude-positivity",
    category: "Gratitude & Positivity",
    audios: [
      { id: 27, title: "Gratitude Meditation", src: gratitude_audio },
      { id: 28, title: "Positive Energy Boost", src: positive_energy_audio },
      { id: 29, title: "Uplifting Sounds", src: uplifting_audio },
    ],
  },
  {
    id: "sleep-improvement",
    category: "Sleep Improvement",
    audios: [
      { id: 30, title: "Sleep Meditation", src: sleep_audio },
      { id: 31, title: "Bedtime Story for Adults", src: bedtime_audio },
      { id: 32, title: "Sleep Soundscapes", src: sleep_better_audio },
    ],
  },
  {
    id: "focus-concentration",
    category: "Focus & Concentration",
    audios: [
      { id: 33, title: "Deep Focus Session", src: study_audio },
      { id: 34, title: "Productivity Booster", src: productivity_audio },
      { id: 35, title: "Concentration Enhancer", src: intense_focus_audio },
    ],
  },
  {
    id: "mind-body",
    category: "Mind-Body Connection",
    audios: [
      { id: 36, title: "Mindful Movement", src: gentle_audio },
      { id: 37, title: "Body-Mind Awareness", src: body_mind_audio },
      { id: 38, title: "Atmospheric Sounds", src: atmospheric_audio },
    ],
  },
  {
    id: "nature",
    category: "Nature",
    audios: [
      { id: 39, title: "Rain Sounds", src: rain_audio },
      { id: 40, title: "Bird Sounds", src: bird_audio },
      { id: 41, title: "Wave Sounds", src: wave_audio },
      { id: 42, title: "Wind Sounds", src: wind_audio },
      { id: 43, title: "Waterfall Sounds", src: waterfall_audio },
    ],
  },
  {
    id: "noise",
    category: "White/Brown/Pink Noise",
    audios: [
      { id: 44, title: "White Noise", src: white_noise_audio },
      { id: 45, title: "Brown Noise", src: brown_noise_audio },
      { id: 46, title: "Pink Noise", src: pink_noise_audio },
    ],
  },
  {
    id: "meditative_instrumental",
    category: "Meditative & Instrumental",
    audios: [
      { id: 47, title: "Binaural Beats", src: beats_audio },
      { id: 48, title: "Calm Piano", src: piano_audio },
      { id: 49, title: "Singing Bowls", src: bowls_audio },
    ],
  },
];

const AudioPlayer = () => {
  const [playAudio, setPlayAudio] = useState({});
  const [audioProgress, setAudioProgress] = useState({});
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef({});

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
        <AudiosSidebar />
      </div>
      <div className="audios-container">
        <h1>Mindful Audio Experience</h1>
        {audios1.map((au) => (
          <div id={au.id} key={au.id}>
            <h2>{au.category}</h2>
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
