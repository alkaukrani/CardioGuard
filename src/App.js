import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSignup from "./Components/Login-signup/loginsignup";
import Form from "./Components/Form";

function App() {
  return (
    <Router>
      <div>
        {/* Define Routes for Navigation */}
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


