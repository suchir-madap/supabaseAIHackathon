import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from 'fs';

const anthropic = new Anthropic();

const systemPrompt = `
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

async function analyzeSentiments(sentences) {
    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
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

        const results = JSON.parse(msg.content[0].text);
        
        // Save results to a JSON file
        writeFileSync('sentiment_analysis.json', JSON.stringify(results, null, 2));
        console.log('Analysis results saved to sentiment_analysis.json');
        
        return results;
    } catch (error) {
        console.error('Error analyzing sentences:', error);
        return null;

// put in examples of what is right, left, and center

// Left Example - Access to affordable healthcare is a fundamental right that the government must protect. The for-profit healthcare system has failed millions, and reform is overdue. Expanding Medicare to include all Americans would reduce inequality and improve the quality of life for everyone, not just the wealthy elite who can afford high-end insurance. 
// Far Right  Example - The recent surge in illegal immigration is a direct threat to our national security and economic stability. Policies that encourage open borders not only weaken the fabric of our society but also prioritize criminals over law-abiding citizens. America must stand firm and put the safety of its citizens first, even if it means harsher border policies. Politicians who ignore these realities are betraying their country for the sake of globalist agendas.
// Right Example - Rising crime rates in urban areas highlight the need for strong law enforcement and stricter policies. While community-focused programs have their merits, they cannot replace the importance of a well-funded police force. America thrives on law and order, and we must prioritize it to ensure the safety and well-being of all citizens.
// Center Example - The debate over renewable energy versus fossil fuels is complex, with valid arguments on both sides. While renewable energy is essential for sustainability, transitioning too quickly could disrupt the economy. Policymakers must find a balanced approach that supports innovation without disregarding the needs of workers in traditional energy sectors.
// Far Left Example  - Corporate greed is destroying the planet, and the government has done little to stop it. Big Oil continues to pump billions into lobbying efforts, while communities suffer from polluted water, unbreathable air, and worsening climate disasters. The only solution is to dismantle the capitalist structures that prioritize profit over human lives and implement radical reforms to redistribute wealth and protect the environment.

//far right 2- Headline: "The Great Replacement is Real and We Need to Fight Back" Content promotes a narrative of cultural or racial superiority, often laden with fearmongering about immigration or demographic shifts. Such articles may emphasize conspiracies about societal or governmental plans to replace traditional values or demographics.
//far right 3 - Headline: "LGBTQ+ Activism is Destroying American Values" Discusses topics like "grooming" or claims of cultural erosion, often targeting specific groups like educators or activists. Sentiment is heavily negative, relying on selective or misrepresented facts.

//Right 2 - Headline: "Should Parents Have a Say in School Curriculums?" Balanced tone focusing on parental rights in education but may lean toward skepticism about progressive changes in school systems. Discusses practical impacts with some ideological framing.
//right 3 - Headline: "Corporate America is Overplaying Its Hand on ESG" Articles critical of progressive corporate policies, suggesting a focus on profit and traditional shareholder values instead of environmental, social, and governance (ESG) initiatives.

//far left 2 - Headline: "Reparations Now: The Only Path to Justice for Historical Injustices" Advocates for systemic overhauls, often using emotional appeals tied to historical grievances or injustices. Sentiment includes anger at perceived inaction and urgency for transformative policies.
//far left 3 - Headline: "Defund the Police is Just the Start of the Movement" Calls for radical restructuring of societal institutions, emphasizing systemic racism and class struggles. Sentiment is often critical of existing institutions and strongly advocates for change.

//left 2 - Headline: "Healthcare for All: Why the U.S. is Behind Other Nations"Advocates for social policies like universal healthcare, using data comparisons with other countries. Balanced but progressive in suggesting specific reforms. Example Source: The New York Times editorial section.
//left 3 - Headline: "Why Climate Change is a Human Rights Issue" Discusses the societal impacts of environmental policies, connecting ecological and social justice with an emphasis on collective responsibility.

//center 2 - Center Headline: "Balancing Economic Growth with Environmental Responsibility" Explores the tension between economic expansion and sustainability without taking a definitive ideological stance, presenting arguments from multiple perspectives. Example Source: Articles in Reuters or Associated Press.
//center 3 - Headline: "The Challenges of Immigration Policy in a Divided Nation". Examines immigration as a policy challenge, presenting data and arguments from both progressive and conservative viewpoints to foster dialogue. Example Source: BBC News or The Hill.
    }
}

// Example usage with file saving:
const testSentences = [
    // actual order: left, far right, right, center, far left
    // claude order: far left, far right, right, center, far left
    // tldr: claude got everything exactly right except was off by one on the first sentence
    "Access to affordable healthcare is a fundamental right that the government must protect. The for-profit healthcare system has failed millions, and reform is overdue. Expanding Medicare to include all Americans would reduce inequality and improve the quality of life for everyone, not just the wealthy elite who can afford high-end insurance. ",
    "The recent surge in illegal immigration is a direct threat to our national security and economic stability. Policies that encourage open borders not only weaken the fabric of our society but also prioritize criminals over law-abiding citizens. America must stand firm and put the safety of its citizens first, even if it means harsher border policies. Politicians who ignore these realities are betraying their country for the sake of globalist agendas.",
    "Rising crime rates in urban areas highlight the need for strong law enforcement and stricter policies. While community-focused programs have their merits, they cannot replace the importance of a well-funded police force. America thrives on law and order, and we must prioritize it to ensure the safety and well-being of all citizens.",
    "The debate over renewable energy versus fossil fuels is complex, with valid arguments on both sides. While renewable energy is essential for sustainability, transitioning too quickly could disrupt the economy. Policymakers must find a balanced approach that supports innovation without disregarding the needs of workers in traditional energy sectors.",
    "Corporate greed is destroying the planet, and the government has done little to stop it. Big Oil continues to pump billions into lobbying efforts, while communities suffer from polluted water, unbreathable air, and worsening climate disasters. The only solution is to dismantle the capitalist structures that prioritize profit over human lives and implement radical reforms to redistribute wealth and protect the environment."
];

// Run analysis and save results
analyzeSentiments(testSentences);

export { analyzeSentiments };
