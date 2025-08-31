import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewLogoShowcase from "./pages/NewLogoShowcase";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-logos" element={<NewLogoShowcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;