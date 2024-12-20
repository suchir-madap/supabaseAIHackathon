import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyzeSentiments, type SentimentResult } from '@/app/claude';



export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      console.log("claude body", body)
      
      console.log("Inside Claude 1")
      if (!body.markdown) {
        
        return NextResponse.json(
          { error: 'Invalid request. Expected array of sentences.' },
          { status: 400 }
        );
      }
      console.log("Inside Claude 2")
      const results = await analyzeSentiments(body.markdown);
      
      if (!results) {
        return NextResponse.json(
          { error: 'Analysis failed' },
          { status: 500 }
        );
      }
  
      return NextResponse.json(results, { status: 200 });
    } catch (error) {
      console.error('Error in Claude API route:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }