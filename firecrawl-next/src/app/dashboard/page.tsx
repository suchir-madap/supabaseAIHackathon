"use client"

import { useState } from "react";
import { supabase } from "@/supabase/supabase-js-client"
import FirecrawlApp, { type ScrapeResponse } from "@mendable/firecrawl-js";
import Markdown from 'markdown-to-jsx';
import type { SentimentResult } from './types.ts';

const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });

const removeImages = (markdown: string) => {
    return markdown
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/<img[^>]*>/g, '')
      .replace(/\[\[.*?\]\]/g, '')
      .replace(/\n\s*\n/g, '\n\n');
};

export default function Dashboard() {
    const [url, setUrl] = useState<string>("");
    const [response, setResponse] = useState<ScrapeResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [sentiments, setSentiments] = useState<SentimentResult[] | null>(null);
    const [analyzingText, setAnalyzingText] = useState(false);

    async function getHistory() {
        setIsHistoryLoading(true);
        setHistoryError(null);
        
        try {
            const { data, error } = await supabase.from('rawHistoryItems').select('*')
            
            if (error) {
                console.error('Supabase error:', error);
                setHistoryError(error.message);
                return null;
            }

            if (data) {
                console.log('History data received:', data);
                setHistoryItems(data);
                return data;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to fetch history:', errorMessage);
            setHistoryError(errorMessage);
        } finally {
            setIsHistoryLoading(false);
        }
    }

    const selectUrlFromHistory = (url: string) => {
        setUrl(url);
    };

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

            if (scrapeResult.markdown) {
                scrapeResult.markdown = removeImages(scrapeResult.markdown);
            }

            setResponse(scrapeResult);
        } catch (err) {
            setError(`An error occurred: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    const testApiRoute = async () => {
        const response = await fetch("/api/claude");
        console.log(response);
    };

    const extractPlainText = (markdown: string): string[] => {
        // Remove markdown syntax and split into sentences
        const plainText = markdown
            .replace(/[#*`_\[\]()]/g, '')
            .replace(/\n+/g, ' ')
            .trim();
        
        return plainText
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    };

    const handleAnalyze = async () => {
        if (!response?.markdown) return;
        
        setAnalyzingText(true);
        try {
            const sentences = extractPlainText(response.markdown);
            const results = await analyzeSentiments(sentences);
            setSentiments(results);
        } catch (err) {
            setError(`Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setAnalyzingText(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Dashboard</h1>
            <button 
                onClick={getHistory}
                disabled={isHistoryLoading}
            >
                {isHistoryLoading ? 'Loading...' : 'Get History'}
            </button>

            {historyError && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    <strong>History Error:</strong> {historyError}
                </div>
            )}
            
            {historyItems.length > 0 && (
                <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <h3>History: ({historyItems.length} items)</h3>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {historyItems.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => selectUrlFromHistory(item.rawUrl)}
                                style={{
                                    cursor: "pointer",
                                    padding: "8px",
                                    border: "1px solid #eee",
                                    marginBottom: "4px",
                                    borderRadius: "4px"
                                }}
                            >
                                <div>URL: {item.rawUrl}</div>
                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                    Created: {new Date(item.created_at).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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

                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzingText}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: analyzingText ? "not-allowed" : "pointer"
                            }}
                        >
                            {analyzingText ? "Analyzing..." : "Analyze Sentiments"}
                        </button>
                    </div>

                    {sentiments && (
                        <div style={{ marginTop: "20px" }}>
                            <h2>Sentiment Analysis:</h2>
                            {sentiments.map((sentiment, index) => (
                                <div 
                                    key={index} 
                                    style={{
                                        padding: "10px",
                                        margin: "10px 0",
                                        backgroundColor: "white",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd"
                                    }}
                                >
                                    <p><strong>Sentence:</strong> {sentiment.sentence}</p>
                                    <p><strong>Rating:</strong> {sentiment.rating}/5</p>
                                    <p><strong>Explanation:</strong> {sentiment.explanation}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}