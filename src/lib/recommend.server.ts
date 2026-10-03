import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, streamText } from "ai";
import { chapters } from "./chapters";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export type Recommendation = {
  summary: string;
  coffees: { name: string; why: string; brew: string }[];
  chapters: { slug: string; title: string; why: string }[];
};

const MODEL = "openai/gpt-6-astra";

export async function recommendCoffee(taste: string): Promise<Recommendation> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured yet.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const chapterList = chapters.map((c) => `${c.slug}: ${c.title} — ${c.line}`).join("\n");
  const system = `You are a warm South Indian filter coffee expert for the site "Kappi".
Recommend 3 filter coffee styles (e.g. bean blends, chicory ratios, roast levels, strength/milk ratios — generic styles, not invented brands) and 2-3 chapters from the site that fit the person's taste.
Only use chapter slugs from this list:
${chapterList}
Reply with ONLY a JSON object, no markdown:
{"summary": string (1-2 sentences about their palate), "coffees": [{"name": string, "why": string (1 sentence), "brew": string (1 short brewing tip)}], "chapters": [{"slug": string, "why": string (1 sentence)}]}`;

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system,
      prompt: `My taste: ${taste}`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const text = await result.text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The AI didn't return a recommendation. Please try again.");
    const raw = JSON.parse(match[0]) as {
      summary?: string;
      coffees?: { name?: string; why?: string; brew?: string }[];
      chapters?: { slug?: string; why?: string }[];
    };
    return {
      summary: String(raw.summary ?? ""),
      coffees: (raw.coffees ?? []).slice(0, 3).map((c) => ({
        name: String(c.name ?? ""), why: String(c.why ?? ""), brew: String(c.brew ?? ""),
      })),
      chapters: (raw.chapters ?? []).flatMap((c) => {
        const found = chapters.find((ch) => ch.slug === c.slug);
        return found ? [{ slug: found.slug, title: found.title, why: String(c.why ?? "") }] : [];
      }).slice(0, 3),
    };
  } catch (error) {
    if (APICallError.isInstance(error)) {
      if (error.statusCode === 429) throw new Error("Too many requests right now. Please wait a moment and try again.");
      if (error.statusCode === 402) throw new Error("AI credits have run out. Please add credits to keep recommendations running.");
      if (error.statusCode === 403) throw new Error("AI access is currently blocked for this workspace.");
    }
    throw error instanceof Error ? error : new Error("Something went wrong.");
  }
}
