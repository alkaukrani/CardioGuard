function redirectToWhoop() {
    const clientId = "2896680d-9cb4-4e75-bd93-9d715f5bd7b3";
    const redirectUri = "http://localhost:3000/auth/whoop/callback";
    const authUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    window.location.href = authUrl; // Redirect user to WHOOP Authorization URL
  }
  