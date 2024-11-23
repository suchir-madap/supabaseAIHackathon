import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages.mjs";
import { writeFileSync } from 'fs';

interface SentimentResult {
  sentence: string;
  rating: number;
  explanation: string;
}

const anthropic = new Anthropic({'apiKey' : process.env.NEXT_PUBLIC_CLAUDE});

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

async function analyzeSentiments(sentences: string): Promise<SentimentResult[] | null> {
  try {

    
    // removed images
    sentences = sentences
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/<img[^>]*>/g, '')
        .replace(/\[\[.*?\]\]/g, '')
        .replace(/\n\s*\n/g, '\n\n');
    
    const sentence = sentences
        .split('.')
        .filter(sentence => sentence.trim().length > 0)
        .map(sentence => sentence.trim());
    
        

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      system: "Return only valid JSON array with ratings.",
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\nAnalyze these sentences: ${JSON.stringify(sentence)}`
        }
      ]
    });

    // const results: SentimentResult[] = JSON.parse(msg.content[0].text);
    
    const results = JSON.parse((msg.content[0] as TextBlock).text);

    // Save results to a JSON file
    writeFileSync('sentiment_analysis.json', JSON.stringify(results, null, 2));
    console.log('Analysis results saved to sentiment_analysis.json');
    
    return results;
  } catch (error) {
    console.error('Error analyzing sentences:', error);
    return null;
  }
}

// Example usage
const testSentences: string[] = [
  "Access to affordable healthcare is a fundamental right that the government must protect. The for-profit healthcare system has failed millions, and reform is overdue. Expanding Medicare to include all Americans would reduce inequality and improve the quality of life for everyone, not just the wealthy elite who can afford high-end insurance.",
  "The recent surge in illegal immigration is a direct threat to our national security and economic stability. Policies that encourage open borders not only weaken the fabric of our society but also prioritize criminals over law-abiding citizens. America must stand firm and put the safety of its citizens first, even if it means harsher border policies. Politicians who ignore these realities are betraying their country for the sake of globalist agendas.",
  "Rising crime rates in urban areas highlight the need for strong law enforcement and stricter policies. While community-focused programs have their merits, they cannot replace the importance of a well-funded police force. America thrives on law and order, and we must prioritize it to ensure the safety and well-being of all citizens.",
  "The debate over renewable energy versus fossil fuels is complex, with valid arguments on both sides. While renewable energy is essential for sustainability, transitioning too quickly could disrupt the economy. Policymakers must find a balanced approach that supports innovation without disregarding the needs of workers in traditional energy sectors.",
  "Corporate greed is destroying the planet, and the government has done little to stop it. Big Oil continues to pump billions into lobbying efforts, while communities suffer from polluted water, unbreathable air, and worsening climate disasters. The only solution is to dismantle the capitalist structures that prioritize profit over human lives and implement radical reforms to redistribute wealth and protect the environment."
];

export { analyzeSentiments, type SentimentResult };
