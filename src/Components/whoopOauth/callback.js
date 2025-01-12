import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Callback() {
  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get("code");

  useEffect(() => {
    if (authorizationCode) {
      console.log("Authorization Code:", authorizationCode);
      exchangeAuthorizationCode(authorizationCode);
    }
  }, [authorizationCode]);

  async function exchangeAuthorizationCode(code) {
    const tokenUrl = "https://api.prod.whoop.com/oauth/oauth2/token";
    const clientId = "2896680d-9cb4-4e75-bd93-9d715f5bd7b3";
    const clientSecret = "19dc8306292013e1a40525d26a4aa9e02e80f4eae68a310dbe8ca4aea3cdbade";
    const redirectUri = "http://localhost:3000/auth/whoop/callback";

    const body = new URLSearchParams();
    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);
    body.append("grant_type", "authorization_code");
    body.append("redirect_uri", redirectUri);
    body.append("code", code);

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
          "Origin": "http://localhost:3000"
        },
        body: body,
        mode: 'cors'
      });

      const responseText = await response.text();
      console.log("Full response:", responseText);

      if (!response.ok) {
        console.error("Response status:", response.status);
        console.error("Response text:", responseText);
        throw new Error(`Failed to exchange authorization code: ${response.status}`);
      }

      try {
        const data = JSON.parse(responseText);
        console.log("Access Token:", data.access_token);
        if (data.access_token) {
          // Successfully got the token
          localStorage.setItem('whoop_access_token', data.access_token);
          window.location.href = '/'; // or wherever you want to redirect
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error("Failed to parse response");
      }
    } catch (error) {
      console.error("Error exchanging authorization code:", error);
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div>Processing WHOOP Authorization...</div>
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        Authorization code received, exchanging for access token...
      </div>
    </div>
  );
}

export default Callback;