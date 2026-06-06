export interface AITemplate {
  id: number;
  key: string;
  label: string;
  description: string;
}

export interface ServerAITemplate extends AITemplate {
  systemPrompt: string;
}
