import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from 'fs';

const anthropic = new Anthropic();


// put in examples of what is right, left, and center

const exampleOfFarRight2 = ``

const exampleOfFarRight = `
hina's latest AI advancements highlight the urgency for America to support its open-source community. Chinese companies, such as Alibaba, are driving innovation with projects like the Qwen 2.5-Coder, an open-source model that reportedly outperforms all global open-source models and rivals some tasks performed by the leading closed-source model, GPT-4o.

These achievements stem from a sharp policy contrast. China actively subsidizes its open-source ecosystem, encouraging global collaboration and rapid innovation. It provides indirect funding and supports major open-source AI conferences. Meanwhile, U.S. politicians and policymakers are increasingly at odds with their own open-source community, creating barriers that hinder progress. If this trend continues, America risks surrendering its technological leadership to global competitors.`

const systemPrompts = `
We have examples below of what is far-right, far-left, left, right and center.

We have three examples of what is far-right
${exampleOfFarRight}

This is the second example of far-right
${exampleOfFarRight2}

`

`

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1000,
  temperature: 0,
  system: "Respond only with structured JSON data. Do not provide explanations or anything beyond the requested JSON structure.",
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Provide a JSON structure categorizing media outlets by political leaning into left, right, and center. The JSON should include the following format: { 'ideological_leaning': 'category', 'outlets': ['list of media outlets'] }"
        }
      ]
    }
  ]
});

const response = msg.content[0].text;
const jsonData = JSON.parse(response);

writeFileSync('media_outlets.json', JSON.stringify(jsonData, null, 2));
console.log('Data saved to media_outlets.json');
console.log(msg);
