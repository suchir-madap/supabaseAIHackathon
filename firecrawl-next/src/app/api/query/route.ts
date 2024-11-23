import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyzeSentiments, type SentimentResult } from '@/app/claude';
import { supabase } from '@/supabase/supabase-js-client';

import FirecrawlApp, { type ScrapeResponse } from "@mendable/firecrawl-js";
import Markdown from 'markdown-to-jsx';

const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });


export async function POST(request: NextRequest) {
    try {

      // get url from request body
      const searchParams = request.nextUrl.searchParams;
      const url = searchParams.get('url');

      // start doing supabase stuff here

      // first check if there is already a record for this url
      const { data, error } = await supabase.from('urls').select('*').eq('url', url);
      
      if (data) {
        console.log('URL already exists in supabase:', data);

        return NextResponse.json(
          { message: 'URL already exists in supabase', data: data },
          { status: 200 }
        );
      } else {
        console.log('No existing record found for URL:', url);
        // Call the scrape API internally
        const scrapeResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/scrape`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
          });
  
          if (!scrapeResponse.ok) {
            throw new Error('Failed to scrape URL');
          }
  
        const scrapeData = await scrapeResponse.json();
        console.log("scrapedata",scrapeData)
        // console.log("markdown Scraped",scrapeData.markdown)

        


        const claudeResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/claude`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // @ts-ignore÷
            body: JSON.stringify(scrapeData.extract)
            
          });
        
          console.log("claudeResponse", claudeResponse)

        const { data: urlData, error } = await supabase
            .from('urls')
            .insert([{ urlString: url }])
            .select()
        console.log(error)

        const { data: analysisData, error: analysisError } = await supabase
            .from('globalUrlAnalysis')
            .insert([
                {
                    urlId: urlData![0].id,  // Reference the id from the urls table
                    url: url,
                    scrapedOutput: scrapeData,
                    rating: claudeResponse

                }
            ])
            .select();


        return NextResponse.json(
          { message: 'No existing record found for URL', data: analysisData },
          { status: 200 }
        );
      }

      if (error) {
        console.error('Error querying supabase:', error);
      }
    
      if (!url) {
        return NextResponse.json(
          { error: 'URL parameter is required' },
          { status: 400 }
        );
      }
    
      return NextResponse.json(
        { message: 'Claude API endpoint', analyzedUrl: url },
        { status: 200 }
      );



      /* const body = await request.json();
      
      if (!body.sentences || !Array.isArray(body.sentences)) {
        return NextResponse.json(
          { error: 'Invalid request. Expected array of sentences.' },
          { status: 400 }
        );
      }
  
      const results = await analyzeSentiments(body.sentences);
      
      if (!results) {
        return NextResponse.json(
          { error: 'Analysis failed' },
          { status: 500 }
        );
      }

      
  
      return NextResponse.json(results, { status: 200 }); */
    } catch (error) {
      console.error('Error in Claude API route:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }





export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: 'Claude API endpoint', analyzedUrl: url },
    { status: 200 }
  );
}

// Optionally, you can also handle GET requests
/* export async function GET() {
  return NextResponse.json(
    { message: 'Claude API endpoint' },
    { status: 200 }
  );
}
 */