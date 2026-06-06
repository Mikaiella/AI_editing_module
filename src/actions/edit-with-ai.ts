"use server";

import OpenAI from "openai";
import { aiConfig } from "@/lib/ai-config";
import { aiTemplates } from "@/lib/ai-templates";

const client = new OpenAI({
  apiKey: aiConfig.apiKey,
  baseURL: aiConfig.baseUri,
});

export async function editWithAIAction(templateKey: string, text: string) {
  const template = aiTemplates.find((t) => t.key === templateKey);
  if (!template) throw new Error("Template not found");

  try {
    const response = await client.chat.completions.create({
      model: aiConfig.model,
      messages: [
        { role: "system", content: template.systemPrompt },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty AI-response");

    return JSON.parse(content);
  } catch (error) {
    console.error("AI error:", error);
    throw new Error("AI-editing failed");
  }
}

export async function getAITemplatesAction() {
  return aiTemplates.map(({ id, key, label, description }) => ({
    id,
    key,
    label,
    description,
  }));
}
