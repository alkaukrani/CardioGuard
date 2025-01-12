import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSignup from "./Components/Login-signup/loginsignup";
import UserInputForm from "./Components/userinputform/userinputform"; // Fixed import path
import Callback from "./Components/whoopOauth/callback";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for LoginSignup */}
        <Route path="/" element={<LoginSignup />} />

        {/* Route for UserInputForm */}
        <Route path="/form" element={<UserInputForm />} />
        
        {/* Add the WHOOP callback route */}
        <Route path="/auth/whoop/callback" element={<Callback />} /> 
      </Routes>
    </Router>
  );
}

export default App;