function redirectToWhoop() {
  const clientId = "2896680d-9cb4-4e75-bd93-9d715f5bd7b3";
  const redirectUri = "http://localhost:3000/auth/whoop/callback";
  const scope = "read:profile offline";
  // Add a random state parameter for security (this is from whoop basically what happens is that whoop wants to make sure that we are changing from one place to another)
  //this is probably a bad explanation but search up what state means in react

  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const authUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  
  console.log("Redirecting to:", authUrl);
  window.location.href = authUrl;
}

export default redirectToWhoop;