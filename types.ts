export interface ColorPalette {
  name: string;
  colors: string[];
  description: string;
  fontRecommendations: { // Changed from fontRecommendation: string
    heading: string;
    body: string;
  };
  implementationIdeas?: string;
  designPrompt?: string;
}

export interface ColorSwatchProps {
  color: string;
}

export interface BrandInspiration {
  vibe: string;
  industry: string;
  targetAudience: string;
  keywords: string;
  story: string;
}

export type AiProvider = 'gemini' | 'openai' | 'claude' | 'groq' | ''; // Added '' for unselected state

export const AI_PROVIDER_NAMES: Record<Exclude<AiProvider, ''>, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  claude: 'Anthropic Claude',
  groq: 'Groq',
};

export type ApiKeyName = 'geminiApiKey' | 'openaiApiKey' | 'claudeApiKey' | 'groqApiKey';

export interface ApiKeySettings {
  geminiApiKey: string;
  openaiApiKey: string;
  claudeApiKey: string;
  groqApiKey: string;
}

export interface AiService {
  isConfigured: () => boolean;
  getProviderName: () => string;
  initializeWithKey: (apiKey: string) => Promise<boolean>; // Method to re-initialize with a new key
  generateColorPalettes: (inspiration: BrandInspiration, modelName?: string) => Promise<ColorPalette[]>;
  generateImplementationIdeas: (palette: ColorPalette, inspiration: BrandInspiration, modelName?: string) => Promise<string>;
  generateDesignPrompt: (palette: ColorPalette, inspiration: BrandInspiration, modelName?: string) => Promise<string>;
}