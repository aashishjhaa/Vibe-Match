import { AiService, AiProvider, AI_PROVIDER_NAMES, ApiKeySettings } from '../types';
import GeminiAiServiceInstance from './geminiAiService';
import OpenaiAiServiceInstance from './openaiAiService';
import ClaudeAiServiceInstance from './claudeAiService';
import GroqAiServiceInstance from './groqAiService';

const services: Record<Exclude<AiProvider, ''>, AiService> = {
  gemini: GeminiAiServiceInstance,
  openai: OpenaiAiServiceInstance,
  claude: ClaudeAiServiceInstance,
  groq: GroqAiServiceInstance,
};

const providerToLocalStorageKey: Record<Exclude<AiProvider, ''>, keyof ApiKeySettings> = {
  gemini: 'geminiApiKey',
  openai: 'openaiApiKey',
  claude: 'claudeApiKey',
  groq: 'groqApiKey',
};

// To store which keys are currently confirmed by initialization
const activeApiKeys: Partial<ApiKeySettings> = {};


const initializeProvider = async (provider: Exclude<AiProvider, ''>, apiKey: string): Promise<boolean> => {
  const service = services[provider];
  if (service) {
    const success = await service.initializeWithKey(apiKey);
    if (success) {
      activeApiKeys[providerToLocalStorageKey[provider]] = apiKey;
    } else {
      delete activeApiKeys[providerToLocalStorageKey[provider]];
    }
    return success;
  }
  return false;
};

const getConfiguredProviders = (): Exclude<AiProvider, ''>[] => {
  return (Object.keys(services) as Exclude<AiProvider, ''>[]).filter(key => {
    const service = services[key];
    // Check if the key used for successful initialization is still considered active
    const localStorageKeyName = providerToLocalStorageKey[key];
    const isActive = service.isConfigured() && activeApiKeys[localStorageKeyName] === localStorage.getItem(`VIBEMATCH_API_KEY_${key.toUpperCase()}`);
    return isActive;
  });
};


const getAiService = (provider: Exclude<AiProvider, ''>): AiService | null => {
  const service = services[provider];
  if (service && service.isConfigured()) {
     // Ensure the service is configured with the *currently* stored key if it changed
     const storedKey = localStorage.getItem(`VIBEMATCH_API_KEY_${provider.toUpperCase()}`);
     if (storedKey && activeApiKeys[providerToLocalStorageKey[provider]] === storedKey) {
        return service;
     } else if (storedKey) {
        // Key changed in localStorage, try to re-initialize
        // This scenario is less likely if App.tsx manages re-initialization on key save
        console.warn(`API key for ${provider} may have changed. Consider re-initializing.`);
        // Attempt re-initialization on the fly - this might be too complex here
        // and better handled by App.tsx re-triggering initialization.
        // For now, if activeKey doesn't match stored, treat as not fully configured for this call.
        return null; // Or try re-init: await initializeProvider(provider, storedKey); return service.isConfigured() ? service : null;
     }
  }
  console.warn(`Service for provider ${provider} is not configured or API key mismatch.`);
  return null;
};

const getProviderName = (providerKey: Exclude<AiProvider, ''>): string => {
    return AI_PROVIDER_NAMES[providerKey] || 'Unknown AI Provider';
}

// Function to load and initialize all providers based on localStorage
const initializeAllProvidersFromStorage = async (): Promise<Exclude<AiProvider, ''>[]> => {
  const availableProviders: Exclude<AiProvider, ''>[] = [];
  for (const providerKey in services) {
    const provider = providerKey as Exclude<AiProvider, ''>;
    const apiKey = localStorage.getItem(`VIBEMATCH_API_KEY_${provider.toUpperCase()}`);
    if (apiKey) {
      if (await initializeProvider(provider, apiKey)) {
        availableProviders.push(provider);
      }
    } else {
      // Ensure service is marked as unconfigured if no key
      services[provider].initializeWithKey(''); // Clears internal state
      delete activeApiKeys[providerToLocalStorageKey[provider]];
    }
  }
  return availableProviders;
};


export const aiServiceFactory = {
  getAiService,
  getConfiguredProviders,
  getProviderName,
  initializeProvider,
  initializeAllProvidersFromStorage,
};