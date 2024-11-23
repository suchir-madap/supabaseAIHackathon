import { CountButton } from "~features/count-button"

import "~style.css"

const apiUrl = "https://supabase-ai-hackathon.vercel.app/api/claude"

function IndexPopup() {

  /* const queryApiRoute = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
  }; */

  // as get request
  /* const queryApiRoute = async () => {
    // Get the current tab's URL (example URL for testing)
    const testUrl = "https://example.com";
    
    // Add URL as query parameter
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(testUrl)}`);
    const data = await response.json();
    console.log(data);
  }; */

  // as post request
  /* const queryApiRoute = async () => {
    // Get the current tab's URL (example URL for testing)
    const testUrl = "https://example.com";
    
    // Make POST request with URL in request body
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: testUrl })
    });
    const data = await response.json();
    console.log(data);
  }; */

  const queryApiRoute = async () => {   
    const testUrl = "https://example.com";

    // Add URL as query parameter
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(testUrl)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  };

  /* const queryApiRoute = async () => {
    try {
      const testUrl = "https://example.com";
      
      // Create URL object to handle parameters properly
      const url = new URL(apiUrl);
      url.searchParams.append('url', testUrl);
      
      console.log('Requesting:', url.toString()); // Debug log
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error querying API:', error);
    }
  }; */

  return (
    <div className="flex items-center justify-center h-16 w-40">
      <CountButton />
      <h1>Hello World</h1>

      <button onClick={queryApiRoute}> query api route</button>
    </div>
  )
}

export default IndexPopup
