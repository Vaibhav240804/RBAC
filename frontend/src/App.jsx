import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useState } from "react";
import SigninSignup from "./pages/SigninSignup";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";

function App() {
  const { user, isRoot } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />}
        />
        <Route path="/signin" element={<SigninSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
