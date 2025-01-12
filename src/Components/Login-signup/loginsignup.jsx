import React from 'react';
import './loginsignup.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

// Define the redirectToWhoop function
function redirectToWhoop() {
  const clientId = "2896680d-9cb4-4e75-bd93-9d715f5bd7b3"; // Replace with your actual Client ID
  const redirectUri = "http://localhost:3001/"; // Redirect URI configured in WHOOP
  const authUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  window.location.href = authUrl; // Redirect user to WHOOP authorization page
}

export default function LoginSignup() {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      
      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="" />
          <input type="text" placeholder="Name" />
        </div>
        
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="email id" />
        </div>
        
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" />
        </div>
      </div>
      <div className="submit-container"></div>
      <div className="submit">Login</div>

      {/* WHOOP Button */}
      <button onClick={redirectToWhoop}>Connect to WHOOP</button>
    </div>
  );
};
