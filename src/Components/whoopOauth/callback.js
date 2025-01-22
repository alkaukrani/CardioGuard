import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * Callback component handles the OAuth callback from WHOOP
 * Exchanges authorization code for access token and redirects to form
 */
function Callback() {
  // Get URL parameters and navigation function from React Router
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract authorization code from URL parameters
  const authorizationCode = searchParams.get("code");

  // Effect runs when component mounts or authorization code changes
  useEffect(() => {
    if (authorizationCode) {
      exchangeAuthorizationCode(authorizationCode);
    }
  }, [authorizationCode]);

  /**
   * Exchanges the authorization code for an access token
   * @param {string} code - The authorization code from WHOOP
   */
  async function exchangeAuthorizationCode(code) {
    // WHOOP API endpoint (using proxy configured in package.json)
    const tokenUrl = "/oauth/oauth2/token";
    
    // WHOOP OAuth credentials
    const clientId = "2896680d-9cb4-4e75-bd93-9d715f5bd7b3";
    const clientSecret = "19dc8306292013e1a40525d26a4aa9e02e80f4eae68a310dbe8ca4aea3cdbade";
    const redirectUri = "http://localhost:3000/auth/whoop/callback";

    // Prepare request body parameters
    const body = new URLSearchParams();
    body.append("client_id", clientId);
    body.append("client_secret", clientSecret);
    body.append("grant_type", "authorization_code");
    body.append("redirect_uri", redirectUri);
    body.append("code", code);

    try {
      // Make request to WHOOP API to exchange code for token
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: body
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`Failed to exchange authorization code: ${response.status}`);
      }

      // Parse response data
      const data = await response.json();
      
      // If we got an access token, save it and redirect to form
      if (data.access_token) {
        localStorage.setItem('whoop_access_token', data.access_token);
        navigate('/form');
      }
    } catch (error) {
      console.error("Error exchanging authorization code");
    }
  }

  // Loading screen while processing authorization
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