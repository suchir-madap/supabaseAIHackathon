"use client"

import { useState } from 'react'
import FirecrawlApp, { type ScrapeResponse } from "@mendable/firecrawl-js";

const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });

// Function to clean the scraped content
const cleanScrapedContent = (markdown: string) => {
  return markdown
    // Remove navigation and menu items
    .replace(/\[.*?\]\(.*?\)/g, '')
    // Remove any URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    // Remove video references
    .replace(/Video.*?\d+:\d+/g, '')
    // Remove empty lines and extra spaces
    .replace(/^\s*[\r\n]/gm, '')
    .replace(/\n\s*\n/g, '\n')
    // Remove ad-related content
    .replace(/Ad Feedback/g, '')
    // Remove CNN specific content
    .replace(/CNN.*?(?:\r?\n|\r)/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
};

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // This gets sent from chrome current tab
  const [currentUrl, setCurrentUrl] = useState<string>("cnn.com")
  const [scrapeResponse, setScrapeResponse] = useState<ScrapeResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScrapeUrl = async () => {
    setLoading(true)
    try {
      const result = await app.scrapeUrl(currentUrl, {
        formats: ["markdown"],
      }) as ScrapeResponse
      
      // Clean markdown content before setting response
      if (result.markdown) {
        result.markdown = cleanScrapedContent(result.markdown);
      }
      
      setScrapeResponse(result)
      console.log('Clean Content:', result.markdown)
      
    } catch (error) {
      console.error('Error scraping URL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
          <div className="text-white text-xl font-semibold mb-5 px-2.5">
            FireCrawl
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <a href="#" className="flex items-center p-2 text-white rounded-lg hover:bg-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            {/* Add more menu items as needed */}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? 'ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm mb-4 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                New Project
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Update the card content to show scraping results */}
          {[1].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">URL Scraper</h3>
              <p className="text-gray-600 mb-4">Current URL: {currentUrl}</p>
              <button
                onClick={handleScrapeUrl}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Scrape URL'}
              </button>
              {scrapeResponse && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Scraping Results:</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                    {JSON.stringify(scrapeResponse, null, 2)}
                  </pre>
                  {scrapeResponse.markdown && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Markdown Content:</h4>
                      <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap text-sm">
                        {scrapeResponse.markdown}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

