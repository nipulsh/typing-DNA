import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

// Stream the response to get reasoning tokens in usage
const stream = await openrouter.chat.send({
  chatRequest: {
    model: process.env.NEXT_PUBLIC_MODEL_NAME,
    messages: [
      {
        role: "user",
        content: "How many r's are in the word 'strawberry'?",
      },
    ],
    stream: true,
  },
});

let response = "";
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    response += content;
    process.stdout.write(content);
  }

  // Usage information comes in the final chunk
  if (chunk.usage) {
    console.log("\nTotal tokens:", chunk.usage.totalTokens);
  }
}

console.log("\nResponse:", response);
