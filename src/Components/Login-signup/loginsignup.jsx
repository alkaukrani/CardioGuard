import React from 'react';
import './loginsignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import redirectToWhoop from '../whoopOauth/redirecttowhoop'; // Add this import

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
}