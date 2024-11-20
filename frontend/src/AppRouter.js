import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import RegisterLogin from "./components/login/RegisterLogin";
import PersonalStats from "./components/profile/PersonalStats";
import ChatBotUI from "./components/chatbot/ChatBotUI";
import ArtStyling from "./components/moodscan/ArtStyling";

function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<RegisterLogin />} />
            <Route path="/dashboard" element={<PersonalStats />} />
            <Route path="/chat" element={<ChatBotUI />} />
            <Route path="/art_styling" element={<ArtStyling />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
