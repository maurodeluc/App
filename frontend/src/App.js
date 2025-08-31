import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FontShowcase from "./pages/FontShowcase";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fonts" element={<FontShowcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;