import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/supabase/supabase-js-client';
import FirecrawlApp from "@mendable/firecrawl-js";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({'apiKey' : process.env.NEXT_PUBLIC_CLAUDE});

const systemPrompt: string = `You are a sentiment analyzer that rates political content. You must return a JSON object with exactly one field: "rating". The rating should be a number between 1-5 where:
1 = far left
2 = left
3 = neutral
4 = right
5 = far right

Example output:
{
  "rating": 3
}`;

const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });

export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get('url');

        console.log("url at the top of combined", url);

        const { data, error } = await supabase.from('urls').select('*').eq('url', url);
        
        if (data) {
            console.log('URL already exists in supabase:', data);
            return NextResponse.json(
                { message: 'URL already exists in supabase', data: data },
                { status: 200 }
            );
        }

        if (url) {
            const scrapeResult = await app.scrapeUrl(url, {
                formats: ["markdown"],
            });
            console.log("scrapeResult", scrapeResult);

            const markdownResults = scrapeResult.markdown;
            const sentences = markdownResults.split('.');

            const msg = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1000,
                temperature: 0,
                system: "You must output only valid JSON matching the schema: { rating: number }",
                messages: [
                    {
                        role: "user",
                        content: `${systemPrompt}\n\nAnalyze this text and return only a JSON object: ${sentences.join('. ')}`
                    }
                ]
            });

            // Parse the JSON response
            const response = JSON.parse(msg.content[0].text.trim());
            const rating = response.rating;

            return NextResponse.json(
                { rating },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: 'No URL provided' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error in Claude API route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { analyzeSentiments } from '@/app/claude';
// import { supabase } from '@/supabase/supabase-js-client';

// import FirecrawlApp, { type ScrapeResponse } from "@mendable/firecrawl-js";
// import Markdown from 'markdown-to-jsx';

// import Anthropic from "@anthropic-ai/sdk";
// import { TextBlock } from "@anthropic-ai/sdk/resources/messages.mjs";
// import { writeFileSync } from 'fs';

// interface SentimentResult {
//   sentence: string;
//   rating: number;
//   explanation: string;
// }

// const anthropic = new Anthropic({'apiKey' : process.env.NEXT_PUBLIC_CLAUDE});

// const systemPrompt: string = `
// You are a sentiment analyzer. Rate each sentence on a scale of 1-5:
// 1 = far left
// 2 = left
// 3 = neutral
// 4 = right
// 5 = far right

// Return a JSON array where each element has this format:
// {
//   "sentence": "the original sentence",
//   "rating": number between 1-5,
//   "explanation": "brief reason for rating"
// }
// `;

// const app = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL });


// export async function POST(request: NextRequest) {
//     try {

//       // get url from request body
//       const searchParams = request.nextUrl.searchParams;
//       const url = searchParams.get('url');

//       console.log("url at the top of combined", url)

//       // first check if there is already a record for this url
//       const { data, error } = await supabase.from('urls').select('*').eq('url', url);
      
//       if (data) {
//         console.log('URL already exists in supabase:', data);

//         return NextResponse.json(
//           { message: 'URL already exists in supabase', data: data },
//           { status: 200 }
//         );
//       } else {
//         console.log('No existing record found for URL:', url);

//         if (url) {
//             const scrapeResult = await app.scrapeUrl(url, {
//                 formats: ["markdown"],
//             });
//             console.log("scrapeResult", scrapeResult)

//             const markdownResults = scrapeResult.markdown;

//             // convert markdown into a string of sentences
//             const sentences = markdownResults.split('.');

//             const msg = await anthropic.messages.create({
//                 model: "claude-3-5-sonnet-20241022",
//                 max_tokens: 1000,   
//                 temperature: 0,
//                 system: "Return only valid JSON array with ratings.",
//                 messages: [
//                   {
//                     role: "user",
//                     content: `${systemPrompt}\n\nAnalyze these sentences: ${sentences}`
//                   }
//                 ]
//               });

//               console.log("msg from claude  ", msg)
//         }

//         return NextResponse.json(
//           { message: 'the end' },
//           { status: 200 }
//         );
//       }

     
//     } catch (error) {
//       console.error('Error in Claude API route:', error);
//       return NextResponse.json(
//         { error: 'Internal Server Error' },
//         { status: 500 }
//       );
//     }
//   }
