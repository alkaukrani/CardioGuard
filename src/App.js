import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSignup from "./Components/Login-signup/loginsignup";
import UserInputForm from "./Components/userinputform";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for LoginSignup */}
        <Route path="/" element={<LoginSignup />} />

        {/* Route for UserInputForm */}
        <Route path="/form" element={<UserInputForm />} />
      </Routes>
    </Router>
  );
}

export default App;
