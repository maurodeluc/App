import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LogoShowcase from "./pages/LogoShowcase";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logos" element={<LogoShowcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;