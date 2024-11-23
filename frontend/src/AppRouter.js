import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import RegisterLogin from "./components/login/RegisterLogin";
import PersonalStats from "./components/profile/PersonalStats";
import ArtStyling from "./components/moodscan/ArtStyling";
import ChatbotInterface from "./components/chatbot/ChatbotInterface";

function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<RegisterLogin />} />
            <Route path="/dashboard" element={<PersonalStats />} />
            <Route path="/chat" element={<ChatbotInterface />} />
            <Route path="/art_styling" element={<ArtStyling />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
