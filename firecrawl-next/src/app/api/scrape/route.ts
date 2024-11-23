import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import FirecrawlApp from "@mendable/firecrawl-js";

const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });

// Helper function to remove images from markdown
const removeImages = (markdown: string) => {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/<img[^>]*>/g, '')
    .replace(/\[\[.*?\]\]/g, '')
    .replace(/\n\s*\n/g, '\n\n');
};

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    const scrapeResult = await app.scrapeUrl(url, {
      formats: ["markdown"],
    });

    if (!scrapeResult.success) {
      return NextResponse.json(
        { error: `Failed to scrape: ${scrapeResult.error}` },
        { status: 400 }
      );
    }

    if (scrapeResult.markdown) {
      scrapeResult.markdown = removeImages(scrapeResult.markdown);
    }

    return NextResponse.json(scrapeResult);
  } catch (error) {
    console.error('Error in Firecralw Scrape API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}