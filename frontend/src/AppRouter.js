import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PersonalStats from "./components/profile/PersonalStats";
import ChatbotInterface from "./components/chatbot/ChatbotInterface";

function AppRouter() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ChatbotInterface />} />
            <Route path="/dashboard" element={<PersonalStats />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
