import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from 'fs';

const anthropic = new Anthropic();

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
