import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SigninSignup from "./pages/SigninSignup";
import "./index.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SigninSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
