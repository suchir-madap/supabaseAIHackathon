import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const msg = await anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 1000,
temperature: 0,
system: "Respond only with short poems.",
messages: [
    {
    "role": "user",
    "content": [
        {
        "type": "text",
        "text": "Why is the ocean salty?"
        }
    ]
    }
]
});
console.log(msg);