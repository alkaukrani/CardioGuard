import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginSignup from "./Components/Login-signup/loginsignup";
import UserInputForm from "./Components/userinputform/userinputform";
import Callback from "./Components/whoopOauth/callback";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/form" element={<UserInputForm />} />
          <Route path="/auth/whoop/callback" element={<Callback />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;