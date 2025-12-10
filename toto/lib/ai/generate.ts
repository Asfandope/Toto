import Anthropic from "@anthropic-ai/sdk";
import type { GeneratedCard } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GENERATION_PROMPT = `You are an expert educator creating flashcards for spaced repetition learning.

Given the following Wikipedia article content, generate flashcards that:
- Focus on the most important facts, definitions, and relationships
- Ask clear, unambiguous questions
- Provide concise answers (1-3 sentences)
- Avoid trivial details or overly specific minutiae
- Cover the breadth of the article, not just the introduction
- Create questions that test understanding, not just memorization

Output ONLY a valid JSON array with no additional text:
[
  {"front": "question", "back": "answer", "reversible": false},
  ...
]

Generate 15-25 flashcards depending on article length and content density.

Article content:
`;

export async function generateFlashcards(
  content: string
): Promise<GeneratedCard[]> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: GENERATION_PROMPT + content,
      },
    ],
  });

  // Extract text content from response
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  // Parse JSON from response
  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse flashcard JSON from response");
  }

  const cards: GeneratedCard[] = JSON.parse(jsonMatch[0]);

  // Validate structure
  if (!Array.isArray(cards)) {
    throw new Error("Response is not an array");
  }

  for (const card of cards) {
    if (typeof card.front !== "string" || typeof card.back !== "string") {
      throw new Error("Invalid card structure");
    }
  }

  return cards;
}
