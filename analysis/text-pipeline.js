import OpenAI from "openai";
import { text } from "stream/consumers";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});
//ai model to extract information from the article titles, such as sentiment, topics, and keywords
export async function analyzeText(titles) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
      You are given a JSON array of article titles.

      Return ONLY valid JSON in this format:

      {
        "results": [
          {
            "summary": "string",
            "sentiment": "positive | neutral | negative",
            "confidence": number,
            "impact": "low | medium | high",
            "topics": ["string"],
            "keywords": ["string"]
          }
        ]
      }

      STRICT RULES:
      - results.length MUST equal input array length
      - result[i] must correspond to input[i]
      - Do not merge or skip items
      - Do not add extra items
      - Do not reorder items
      - Output must be valid JSON only
      `,
      },
      {
        role: "user",
        content: JSON.stringify(titles),
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
