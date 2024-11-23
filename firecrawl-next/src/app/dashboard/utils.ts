
import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages.mjs";
import type { SentimentResult } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_CLAUDE
});

const systemPrompt: string = `
You are a sentiment analyzer. Rate each sentence on a scale of 1-5:
1 = far left
2 = left
3 = neutral
4 = right
5 = far right

Return a JSON array where each element has this format:
{
  "sentence": "the original sentence",
  "rating": number between 1-5,
  "explanation": "brief reason for rating"
}
`;

export async function analyzeSentiments(sentences: string[]): Promise<SentimentResult[] | null> {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0,
      system: "Return only valid JSON array with ratings.",
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nAnalyze these sentences: ${JSON.stringify(sentences)}`
        }
      ]
    });

    const results = JSON.parse((msg.content[0] as TextBlock).text);
    return results;
  } catch (error) {
    console.error('Error analyzing sentences:', error);
    throw error;
  }
}