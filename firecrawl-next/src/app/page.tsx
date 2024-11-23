"use client";
import { useState } from "react";
import FirecrawlApp, { type ScrapeResponse } from "@mendable/firecrawl-js";
import Markdown from 'markdown-to-jsx';

const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });

// Function to remove images from markdown
const removeImages = (markdown: string) => {
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove ![alt](url) format
      .replace(/<img[^>]*>/g, '')      // Remove HTML <img> tags
      .replace(/\[\[.*?\]\]/g, '')     // Remove [[image]] wiki-style format
      .replace(/\n\s*\n/g, '\n\n');    // Clean up extra newlines
};


export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [response, setResponse] = useState<ScrapeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    setError(null);
    setResponse(null);
    setLoading(true);

    try {
      const scrapeResult = (await app.scrapeUrl(url, {
        formats: ["markdown"],
      })) as ScrapeResponse;

      if (!scrapeResult.success) {
        setError(`Failed to scrape: ${scrapeResult.error}`);
        return;
      }

      // Modify the markdown content to remove images
      if (scrapeResult.markdown) {
        scrapeResult.markdown = removeImages(scrapeResult.markdown);
      }

      setResponse(scrapeResult);
    } catch (err) {
      setError(
        `An error occurred: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const testApiRoute = async () => {
    const response = await fetch("/api/claude");
    console.log(response);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>URL Scraper</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleScrape}
          disabled={loading || !url}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: loading || !url ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Scraping..." : "Scrape URL"}
        </button>
        <button onClick={testApiRoute}>Test API Route</button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        >
          <h2>Response JSON:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
          
          <h2>Rendered Markdown (without images):</h2>
          <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "4px" }}>
            <Markdown>{response.markdown || ''}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
