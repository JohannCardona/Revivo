import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PersonalStats from "./components/profile/PersonalStats";
import ChatbotInterface from "./components/chatbot/ChatbotInterface";
import MindfulnessTips from "./components/mindfulness/MindfulnessTips";
import TipsCategories from "./components/mindfulness/TipsCategories";
import CalmingAudios from "./components/mindfulness/CalmingAudios";
import VideoLibrary from "./components/library/VideoMain";

function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ChatbotInterface />} />
            <Route path="/dashboard" element={<PersonalStats />} />
            <Route path="/tips" element={<MindfulnessTips />} />
            <Route path="/tips/:tipCategory" element={<TipsCategories />} />
            <Route path="/calming_audios" element={<CalmingAudios />} />
            <Route path="/library" element={<VideoLibrary />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
