// 'use client'; 
// import { useState } from 'react';
// import FirecrawlApp, { type ScrapeResponse } from '@mendable/firecrawl-js';


// console.log(process.env.PLASMO_PUBLIC_FIRECRAWL);

// // const app = new FirecrawlApp({ apiKey: process.env.PLASMO_PUBLIC_FIRECRAWL });



// export default function HomePage() {
//   const [url, setUrl] = useState<string>(''); // State to store the input URL
//   const [response, setResponse] = useState<ScrapeResponse | null>(null); // State to store API response
//   const [error, setError] = useState<string | null>(null); // State to store error messages
//   const [loading, setLoading] = useState<boolean>(false); // State to handle loading state

//   /* const handleScrape = async () => {
//     setError(null); // Reset error state
//     setResponse(null); // Reset response state
//     setLoading(true); // Set loading state

//     try {
//       const scrapeResult = await app.scrapeUrl(url, { formats: ['markdown'] }) as ScrapeResponse;

//       if (!scrapeResult.success) {
//         setError(`Failed to scrape: ${scrapeResult.error}`);
//         return;
//       }

//       setResponse(scrapeResult); // Set successful response
//     } catch (err) {
//       setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   }; */

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Sidepanel toggle</h1>

//       <button onClick={() => chrome.runtime.sendMessage({action: "openSidePanel"})}>Open Sidepanel</button>

//       <h1>URL Scraper</h1>
//       <div style={{ marginBottom: '10px' }}>
//         <input
//           type="text"
//           placeholder="Enter URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           style={{
//             padding: '10px',
//             width: '300px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             marginRight: '10px',
//           }}
//         />
//         <button
//           //onClick={handleScrape}
//           disabled={loading || !url}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#0070f3',
//             color: '#fff',
//             borderRadius: '4px',
//             border: 'none',
//             cursor: loading || !url ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {loading ? 'Scraping...' : 'Scrape URL'}
//         </button>
//       </div>

//       {error && (
//         <div style={{ color: 'red', marginTop: '10px' }}>
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {response && (
//         <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
//           <h2>Response JSON:</h2>
//           <pre>{JSON.stringify(response, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

import { CountButton } from "~features/count-button"

import "~style.css"

const apiUrl = "https://supabase-ai-hackathon.vercel.app/api/claude"

function IndexPopup() {

  /* const queryApiRoute = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
  }; */

  const queryApiRoute = async () => {
    // Get the current tab's URL (example URL for testing)
    const testUrl = "https://example.com";
    
    // Add URL as query parameter
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(testUrl)}`);
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <CountButton />
      <h1>Hello World</h1>

      <button onClick={queryApiRoute}> query api route</button>
    </div>
  )
}

export default IndexPopup
