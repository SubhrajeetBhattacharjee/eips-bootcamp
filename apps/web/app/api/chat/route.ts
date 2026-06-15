import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Determine if OPENAI_API_KEY is configured
  if (!process.env.OPENAI_API_KEY) {
    // Return a mock streaming response
    return new Response(
      new ReadableStream({
        async start(controller) {
          const mockText = "I am a simulated AI Assistant. To get real intelligent responses about EIPs and Ethereum, please add an `OPENAI_API_KEY` to the `.env.local` file.\n\nHowever, I can tell you that **EIP-1559** introduced a base fee that is burned, and **ERC-20** is the standard for fungible tokens!";
          const encoder = new TextEncoder();
          
          for (let i = 0; i < mockText.length; i++) {
            // Encode using the Vercel AI SDK specific format for text chunks: 0:"text"
            const chunk = `0:"${mockText[i].replace(/"/g, '\\"')}"\n`;
            controller.enqueue(encoder.encode(chunk));
            await new Promise(r => setTimeout(r, 20)); // simulated typing delay
          }
          controller.close();
        }
      }),
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Vercel-AI-Data-Stream': 'v1' } }
    );
  }

  const result = await streamText({
    model: openai('gpt-4o-mini') as any,
    messages,
    system: `You are the friendly and knowledgeable Site Assistant for the EIPsInsight Bootcamp.
Your goal is to help users navigate the Ethereum ecosystem, explain EIPs, ERCs, and governance concepts accurately.
Rules:
- Give a short, precise answer first.
- Provide practical information and avoid repetition.
- Do not hallucinate facts about Ethereum. Stick to established protocols (EIP-1559, EIP-4844, ERC-20, ERC-721, etc.).
- If applicable, recommend the user to check out the 'Learn' or 'Dashboard' sections on the website.
- Keep your tone professional yet accessible to newcomers.`
  });

  return result.toAIStreamResponse();
}
