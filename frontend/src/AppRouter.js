import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PersonalStats from "./components/profile/PersonalStats";
import ChatbotInterface from "./components/chatbot/ChatbotInterface";
import MindfulnessTips from "./components/mindfulness/MindfulnessTips";
import CalmingAudios from "./components/mindfulness/CalmingAudios";
import VideoLibrary from "./components/library/VideoMain";
import NewUser from "./components/login/NewUser";
import ExistingUser from "./components/login/ExistingUser";
import CategoryTips from "./components/mindfulness/CategoryTips";
import BadgesSection from "./components/Badges/BadgesSection";
import MoodMain from "./components/profile/MoodMain";

function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<NewUser />} />
            <Route path="/login" element={<ExistingUser />} />
            <Route path="/chat" element={<ChatbotInterface />} />
            <Route path="/dashboard" element={<PersonalStats />} />
            <Route path="/mood" element={<MoodMain />} />
            <Route path="/badges" element={<BadgesSection />} />
            <Route path="/tips" element={<MindfulnessTips />} />
            <Route path="/tips/:tipCategory" element={<CategoryTips />} />
            <Route path="/audios" element={<CalmingAudios />} />
            <Route path="/library" element={<VideoLibrary />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
