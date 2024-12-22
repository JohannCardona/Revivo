import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { ThemeContext } from "./components/Theme/Theme";

function App() {
  const { theme } = useContext(ThemeContext);
  console.log(theme);
  

  return (
    <div className={`App ${theme}`}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
