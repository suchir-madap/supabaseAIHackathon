'use client'; 
import { useState } from 'react';
import FirecrawlApp, { type ScrapeResponse } from '@mendable/firecrawl-js';



const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });



export default function HomePage() {
  const [url, setUrl] = useState<string>(''); // State to store the input URL
  const [response, setResponse] = useState<ScrapeResponse | null>(null); // State to store API response
  const [error, setError] = useState<string | null>(null); // State to store error messages
  const [loading, setLoading] = useState<boolean>(false); // State to handle loading state

  const handleScrape = async () => {
    setError(null); // Reset error state
    setResponse(null); // Reset response state
    setLoading(true); // Set loading state

    try {
      const scrapeResult = await app.scrapeUrl(url, { formats: ['markdown'] }) as ScrapeResponse;

      if (!scrapeResult.success) {
        setError(`Failed to scrape: ${scrapeResult.error}`);
        return;
      }

      setResponse(scrapeResult); // Set successful response
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>URL Scraper</h1>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleScrape}
          disabled={loading || !url}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '4px',
            border: 'none',
            cursor: loading || !url ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Scraping...' : 'Scrape URL'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
          <h2>Response JSON:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}