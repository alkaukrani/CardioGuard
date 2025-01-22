import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginSignup from "./Components/Login-signup/loginsignup";
import UserInputForm from "./Components/userinputform/userinputform";
import Callback from "./Components/whoopOauth/callback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/form" element={<UserInputForm />} />
        <Route path="/auth/whoop/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;