
import React, { useState, useCallback, FormEvent, useEffect, ChangeEvent } from 'react';
import { ColorPalette, BrandInspiration, AiProvider, AI_PROVIDER_NAMES, ApiKeySettings, ApiKeyName } from './types';
import { aiServiceFactory } from './services/aiServiceFactory';
import ColorPaletteCard from './components/ColorPaletteCard';
import LoadingSpinner from './components/LoadingSpinner';
import { 
  ExclamationTriangleIcon, 
  TagIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChatBubbleLeftEllipsisIcon,
  PencilSquareIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from './components/Icons';

const VIBE_OPTIONS = [
  "Modern & Minimalist", "Playful & Creative", "Corporate & Trustworthy", "Luxurious & Elegant",
  "Natural & Calming", "Bold & Energetic", "Vintage & Retro", "Tech & Futuristic",
  "Dark & Edgy", "Warm & Inviting"
];

const LS_API_KEY_PREFIX = 'VIBEMATCH_API_KEY_';

const initialApiKeysState: ApiKeySettings = {
  geminiApiKey: '', openaiApiKey: '', claudeApiKey: '', groqApiKey: ''
};

interface FormFieldProps {
  id: string;
  name: keyof BrandInspiration;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  options?: string[];
  Icon?: React.FC<{className?: string}>;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = React.memo(({ id, name, label, value, onChange, type = "text", placeholder, options, Icon, rows }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-red-400" />}
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 4}
        className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-500 transition-colors duration-200 shadow-sm"
      />
    ) : type === "select" ? (
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-500 transition-colors duration-200 shadow-sm"
      >
        <option value="">{placeholder || "Select an option"}</option>
        {options?.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-500 transition-colors duration-200 shadow-sm"
      />
    )}
  </div>
));
FormField.displayName = 'FormField';


const App: React.FC = () => {
  const [inspiration, setInspiration] = useState<BrandInspiration>({
    vibe: '', industry: '', targetAudience: '', keywords: '', story: ''
  });
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  const [configuredProviders, setConfiguredProviders] = useState<Exclude<AiProvider, ''>[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Exclude<AiProvider, ''> | ''>('');
  
  const [allSavedApiKeys, setAllSavedApiKeys] = useState<ApiKeySettings>(initialApiKeysState);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [apiKeySaveStatus, setApiKeySaveStatus] = useState<string | null>(null);

  const [selectedProviderInModal, setSelectedProviderInModal] = useState<Exclude<AiProvider, ''> | ''>('');
  const [currentModalApiKeyInput, setCurrentModalApiKeyInput] = useState<string>('');


  const [ideaLoadingStates, setIdeaLoadingStates] = useState<Record<number, boolean>>({});
  const [ideaErrorStates, setIdeaErrorStates] = useState<Record<number, string | null>>({});
  const [designPromptLoadingStates, setDesignPromptLoadingStates] = useState<Record<number, boolean>>({});
  const [designPromptErrorStates, setDesignPromptErrorStates] = useState<Record<number, string | null>>({});

  const loadApiKeysFromLocalStorage = useCallback(() => {
    const loadedKeys: Partial<ApiKeySettings> = {};
    (Object.keys(AI_PROVIDER_NAMES) as Exclude<AiProvider, ''>[]).forEach(provider => {
      const key = localStorage.getItem(`${LS_API_KEY_PREFIX}${provider.toUpperCase()}`);
      if (key) {
        const apiKeyField = `${provider}ApiKey` as keyof ApiKeySettings;
        loadedKeys[apiKeyField] = key;
      }
    });
    setAllSavedApiKeys(prev => ({ ...prev, ...loadedKeys }));
  }, []);
  
  useEffect(() => {
    loadApiKeysFromLocalStorage();
  }, [loadApiKeysFromLocalStorage]);

  useEffect(() => {
    const updateProvidersAndSelection = async () => {
      const available = await aiServiceFactory.initializeAllProvidersFromStorage();
      setConfiguredProviders(available);

      if (available.length > 0) {
        if (selectedProvider && available.includes(selectedProvider as Exclude<AiProvider, ''>)) {
          // Keep current selection if still valid
        } else {
          // Default selection logic
          setSelectedProvider(available.includes('gemini') ? 'gemini' : available[0]);
        }
      } else {
        setSelectedProvider(''); 
      }
    };
    updateProvidersAndSelection();
  }, [allSavedApiKeys]); 


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInspiration(prev => ({ ...prev, [name]: value }));
  }, []); 

  const handleModalApiKeyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentModalApiKeyInput(e.target.value);
  };

  const handleModalProviderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as Exclude<AiProvider, ''> | '';
    setSelectedProviderInModal(provider);
    if (provider) {
      const apiKeyField = `${provider}ApiKey` as keyof ApiKeySettings;
      setCurrentModalApiKeyInput(allSavedApiKeys[apiKeyField] || '');
    } else {
      setCurrentModalApiKeyInput('');
    }
  };
  
  const handleSaveSingleApiKey = async () => {
    if (!selectedProviderInModal) {
      setApiKeySaveStatus("Please select a provider from the dropdown first.");
      return;
    }
    setApiKeySaveStatus('Saving...');
    try {
      const provider = selectedProviderInModal as Exclude<AiProvider, ''>;
      const apiKey = currentModalApiKeyInput.trim();
      const apiKeyField = `${provider}ApiKey` as keyof ApiKeySettings;

      if (apiKey) {
        localStorage.setItem(`${LS_API_KEY_PREFIX}${provider.toUpperCase()}`, apiKey);
        setAllSavedApiKeys(prev => ({...prev, [apiKeyField]: apiKey})); 
        await aiServiceFactory.initializeProvider(provider, apiKey); 
        setApiKeySaveStatus(`${AI_PROVIDER_NAMES[provider]} API Key saved!`);
      } else {
        localStorage.removeItem(`${LS_API_KEY_PREFIX}${provider.toUpperCase()}`);
        setAllSavedApiKeys(prev => ({...prev, [apiKeyField]: ''})); 
        await aiServiceFactory.initializeProvider(provider, ''); 
        setApiKeySaveStatus(`${AI_PROVIDER_NAMES[provider]} API Key cleared.`);
      }
      setTimeout(() => setApiKeySaveStatus(null), 3000);
    } catch (e) {
      console.error("Error saving API key:", e);
      setApiKeySaveStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleClearSingleApiKey = async () => {
    if (!selectedProviderInModal) {
      setApiKeySaveStatus("Please select a provider to clear its key.");
      return;
    }
    setApiKeySaveStatus('Clearing key...');
    try {
        const provider = selectedProviderInModal as Exclude<AiProvider, ''>;
        const apiKeyField = `${provider}ApiKey` as keyof ApiKeySettings;

        localStorage.removeItem(`${LS_API_KEY_PREFIX}${provider.toUpperCase()}`);
        setAllSavedApiKeys(prev => ({...prev, [apiKeyField]: ''})); 
        setCurrentModalApiKeyInput(''); 
        await aiServiceFactory.initializeProvider(provider, ''); 
        
        setApiKeySaveStatus(`${AI_PROVIDER_NAMES[provider]} API Key cleared.`);
        setTimeout(() => setApiKeySaveStatus(null), 3000);
    } catch (e) {
        console.error("Error clearing API key:", e);
        setApiKeySaveStatus(`Error clearing key: ${e instanceof Error ? e.message : String(e)}`);
    }
  };


  const handleClearAllApiKeys = async () => {
    setApiKeySaveStatus('Clearing all keys...');
    (Object.keys(AI_PROVIDER_NAMES) as Exclude<AiProvider, ''>[]).forEach(provider => {
        localStorage.removeItem(`${LS_API_KEY_PREFIX}${provider.toUpperCase()}`);
        aiServiceFactory.initializeProvider(provider, ''); 
    });
    setAllSavedApiKeys(initialApiKeysState); 
    setCurrentModalApiKeyInput(''); 
    setSelectedProviderInModal(''); 
    setApiKeySaveStatus('All API Keys cleared from browser storage.');
    setTimeout(() => setApiKeySaveStatus(null), 3000);
  };

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    
    if (!selectedProvider) {
      setError("No AI provider is currently active. Please go to API Key Settings to configure one.");
      setShowResults(true);
      setPalettes([]);
      setIsLoading(false);
      return;
    }

    if (!inspiration.story.trim() && !inspiration.vibe && !inspiration.industry && !inspiration.keywords && !inspiration.targetAudience) {
      setError("Please provide some details about your vision in the form or the story section.");
      setPalettes([]); 
      setShowResults(true); 
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setPalettes([]); 
    setIdeaLoadingStates({}); 
    setIdeaErrorStates({}); 
    setDesignPromptLoadingStates({});
    setDesignPromptErrorStates({});
    setShowResults(true); 

    const aiService = aiServiceFactory.getAiService(selectedProvider as Exclude<AiProvider, ''>);
    if (!aiService || !aiService.isConfigured()) {
      setError(`AI Provider "${AI_PROVIDER_NAMES[selectedProvider as Exclude<AiProvider, ''>] || selectedProvider}" is not configured or the key is invalid. Please check API Key Settings.`);
      setIsLoading(false);
      return;
    }

    try {
      const generatedPalettes = await aiService.generateColorPalettes(inspiration);
      setPalettes(generatedPalettes);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Error with ${aiService.getProviderName()}: ${e.message}`);
      } else {
        setError(`An unexpected error occurred with ${aiService.getProviderName()} while generating palettes.`);
      }
      setPalettes([]);
    } finally {
      setIsLoading(false);
    }
  }, [inspiration, selectedProvider]);

  const handleGenerateIdeas = useCallback(async (paletteIndex: number) => {
    if (!selectedProvider) {
      setIdeaErrorStates(prev => ({ ...prev, [paletteIndex]: "No AI provider selected." }));
      return;
    }
    const targetPalette = palettes[paletteIndex];
    if (!targetPalette || targetPalette.implementationIdeas) return;

    setIdeaLoadingStates(prev => ({ ...prev, [paletteIndex]: true }));
    setIdeaErrorStates(prev => ({ ...prev, [paletteIndex]: null }));

    const aiService = aiServiceFactory.getAiService(selectedProvider as Exclude<AiProvider, ''>);
    if (!aiService || !aiService.isConfigured()) {
      setIdeaErrorStates(prev => ({ ...prev, [paletteIndex]: `AI Provider "${AI_PROVIDER_NAMES[selectedProvider as Exclude<AiProvider, ''>] || selectedProvider}" is not configured. Please set its API key in Settings.` }));
      setIdeaLoadingStates(prev => ({ ...prev, [paletteIndex]: false }));
      return;
    }

    try {
      const ideas = await aiService.generateImplementationIdeas(targetPalette, inspiration);
      setPalettes(prevPalettes => 
        prevPalettes.map((palette, index) => 
          index === paletteIndex ? { ...palette, implementationIdeas: ideas } : palette
        )
      );
    } catch (e) {
      if (e instanceof Error) {
        setIdeaErrorStates(prev => ({ ...prev, [paletteIndex]: `Error with ${aiService.getProviderName()}: ${e.message}` }));
      } else {
        setIdeaErrorStates(prev => ({ ...prev, [paletteIndex]: `An unexpected error with ${aiService.getProviderName()} occurred while generating ideas.` }));
      }
    } finally {
      setIdeaLoadingStates(prev => ({ ...prev, [paletteIndex]: false }));
    }
  }, [palettes, inspiration, selectedProvider]);

  const handleGenerateDesignPrompt = useCallback(async (paletteIndex: number) => {
     if (!selectedProvider) {
      setDesignPromptErrorStates(prev => ({ ...prev, [paletteIndex]: "No AI provider selected." }));
      return;
    }
    const targetPalette = palettes[paletteIndex];
    if (!targetPalette || targetPalette.designPrompt) return;

    setDesignPromptLoadingStates(prev => ({ ...prev, [paletteIndex]: true }));
    setDesignPromptErrorStates(prev => ({ ...prev, [paletteIndex]: null }));

    const aiService = aiServiceFactory.getAiService(selectedProvider as Exclude<AiProvider, ''>);
     if (!aiService || !aiService.isConfigured()) {
      setDesignPromptErrorStates(prev => ({ ...prev, [paletteIndex]: `AI Provider "${AI_PROVIDER_NAMES[selectedProvider as Exclude<AiProvider, ''>] || selectedProvider}" is not configured. Please set its API key in Settings.` }));
      setDesignPromptLoadingStates(prev => ({ ...prev, [paletteIndex]: false }));
      return;
    }

    try {
        const promptText = await aiService.generateDesignPrompt(targetPalette, inspiration);
        setPalettes(prevPalettes =>
            prevPalettes.map((palette, index) =>
                index === paletteIndex ? { ...palette, designPrompt: promptText } : palette
            )
        );
    } catch (e) {
        if (e instanceof Error) {
            setDesignPromptErrorStates(prev => ({ ...prev, [paletteIndex]: `Error with ${aiService.getProviderName()}: ${e.message}` }));
        } else {
            setDesignPromptErrorStates(prev => ({ ...prev, [paletteIndex]: `An unexpected error with ${aiService.getProviderName()} occurred while generating design prompt.` }));
        }
    } finally {
        setDesignPromptLoadingStates(prev => ({ ...prev, [paletteIndex]: false }));
    }
  }, [palettes, inspiration, selectedProvider]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-gray-200 selection:bg-red-500 selection:text-white">
      <header className="py-8 sm:py-12 text-center relative">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2">
            <span className="animated-vibematch-title">VibeMatch</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Match your brand's vibe with AI-generated color palettes and font suggestions.
          </p>
          <button
              onClick={() => {
                  setIsSettingsModalOpen(true);
                  // Pre-select the first configured provider or none if modal opens
                  if (configuredProviders.length > 0) {
                    const providerToSelect = configuredProviders.includes(selectedProvider as Exclude<AiProvider, ''>) ? selectedProvider : configuredProviders[0];
                    setSelectedProviderInModal(providerToSelect as Exclude<AiProvider, ''>);
                    const apiKeyField = `${providerToSelect}ApiKey` as keyof ApiKeySettings;
                    setCurrentModalApiKeyInput(allSavedApiKeys[apiKeyField] || '');
                  } else {
                    setSelectedProviderInModal('');
                    setCurrentModalApiKeyInput('');
                  }
              }}
              className="mt-6 flex items-center justify-center mx-auto px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200 font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-60 transition-all duration-300"
            >
              <KeyIcon className="w-5 h-5 mr-2" />
              API Key Settings
          </button>
        </div>
      </header>

      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out"
             onClick={() => setIsSettingsModalOpen(false)}>
          <div 
            className="bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg ring-1 ring-neutral-700 relative transform transition-all duration-300 ease-out scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors"
              aria-label="Close API Key Settings"
            >
              <XCircleIcon className="w-7 h-7" title="Close settings" />
            </button>
            <h2 className="text-2xl font-semibold text-red-500 mb-6">API Key Settings</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="modalAiProvider" className="block text-sm font-medium text-gray-300 mb-1.5">AI Provider</label>
                <select
                  id="modalAiProvider"
                  value={selectedProviderInModal}
                  onChange={handleModalProviderChange}
                  className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-500 transition-colors duration-200 shadow-sm"
                >
                  <option value="">Select a Provider</option>
                  {(Object.keys(AI_PROVIDER_NAMES) as Exclude<AiProvider, ''>[]).map(pKey => (
                    <option key={pKey} value={pKey}>{AI_PROVIDER_NAMES[pKey]}</option>
                  ))}
                </select>
              </div>

              {selectedProviderInModal && (
                <div>
                  <label htmlFor="modalApiKeyInput" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center">
                    API Key for {AI_PROVIDER_NAMES[selectedProviderInModal as Exclude<AiProvider, ''>]}
                    {allSavedApiKeys[`${selectedProviderInModal}ApiKey` as keyof ApiKeySettings] ? (
                       <CheckCircleIcon className="w-5 h-5 ml-2 text-green-500" title={`${AI_PROVIDER_NAMES[selectedProviderInModal as Exclude<AiProvider, ''>]} key is saved`} />
                    ) : (
                       <XCircleIcon className="w-5 h-5 ml-2 text-yellow-500" title={`${AI_PROVIDER_NAMES[selectedProviderInModal as Exclude<AiProvider, ''>]} key not saved or empty`} />
                    )}
                  </label>
                  <input
                    id="modalApiKeyInput"
                    type="password"
                    value={currentModalApiKeyInput}
                    onChange={handleModalApiKeyInputChange}
                    placeholder={`Enter your ${AI_PROVIDER_NAMES[selectedProviderInModal as Exclude<AiProvider, ''>]} API Key`}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-500 transition-colors duration-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            {apiKeySaveStatus && (
              <p className={`text-sm mb-4 p-2 rounded-md ${apiKeySaveStatus.startsWith('Error') ? 'bg-red-900/70 text-red-300' : 'bg-green-900/70 text-green-300'}`}>
                {apiKeySaveStatus}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveSingleApiKey}
                disabled={!selectedProviderInModal}
                className="w-full sm:w-auto flex-1 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {currentModalApiKeyInput ? 'Save Key' : 'Clear & Save Empty Key'}
              </button>
              <button
                onClick={handleClearSingleApiKey}
                disabled={!selectedProviderInModal || !allSavedApiKeys[`${selectedProviderInModal}ApiKey` as keyof ApiKeySettings]}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-600 hover:bg-neutral-500 text-gray-200 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Clear Selected Key
              </button>
            </div>
             <button
                onClick={handleClearAllApiKeys}
                className="w-full mt-3 px-5 py-2.5 bg-red-900 hover:bg-red-800 text-red-200 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-60"
              >
                Clear All Saved Keys
            </button>
            <p className="text-xs text-gray-500 mt-4">Your API keys are stored only in your browser's local storage and are never sent to our servers.</p>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <form onSubmit={handleSubmit} className="bg-neutral-800/70 p-6 sm:p-10 rounded-2xl shadow-xl ring-1 ring-neutral-700 space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-red-500 mb-2">
              Describe Your Vision
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Fill in the details below, or just tell us your story. The more context you give the AI, the better it can match your vibe!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <FormField id="vibe" name="vibe" label="Desired Vibe / Mood" value={inspiration.vibe} onChange={handleInputChange} type="select" Icon={TagIcon} options={VIBE_OPTIONS} placeholder="e.g., Modern & Minimalist" />
            <FormField id="industry" name="industry" label="Industry / Niche" value={inspiration.industry} onChange={handleInputChange} Icon={BuildingOfficeIcon} placeholder="e.g., Tech Startup, Coffee Shop" />
            <FormField id="targetAudience" name="targetAudience" label="Target Audience" value={inspiration.targetAudience} Icon={UsersIcon} onChange={handleInputChange} placeholder="e.g., Young Professionals, Gamers" />
            <FormField id="keywords" name="keywords" label="Key Concepts / Keywords" value={inspiration.keywords} Icon={ChatBubbleLeftEllipsisIcon} onChange={handleInputChange} placeholder="e.g., Innovation, Sustainability, Fun" />
          </div>
          <FormField id="story" name="story" label="Tell Your Story (or describe your project)" value={inspiration.story} Icon={PencilSquareIcon} onChange={handleInputChange} type="textarea" placeholder="Describe your brand, project, or the feeling you want to evoke. What makes it unique? What's its purpose?" rows={6} />
          
          {!selectedProvider && configuredProviders.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg text-sm flex items-start">
                <InformationCircleIcon className="w-5 h-5 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                <div>
                    <p className="font-semibold">No AI Provider Active</p>
                    <p>Please click "API Key Settings" above to add an API key for your preferred AI provider (e.g., Gemini, OpenAI, Claude, Groq). This app uses your key to generate palettes.</p>
                </div>
            </div>
          )}


          <button
            type="submit"
            disabled={isLoading || !selectedProvider}
            className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Generate Your Vibe Kit
          </button>
        </form>

        {showResults && (
          <section id="results" className="mt-12 sm:mt-16">
            {isLoading && <LoadingSpinner />}
            {error && !isLoading && (
              <div className="max-w-2xl mx-auto p-6 bg-red-900/60 border border-red-700 rounded-xl shadow-lg text-center">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-red-300 mb-2">Oops! Something went wrong.</h3>
                <p className="text-red-200 whitespace-pre-wrap">{error}</p>
                 {error.includes("API key") && (
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="mt-6 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-all duration-200"
                    >
                        Check API Key Settings
                    </button>
                )}
              </div>
            )}
            {!isLoading && !error && palettes.length > 0 && (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-red-500">Your Custom Vibe Kits</h2>
                 <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
                    Here are {palettes.length} unique vibe kits generated by {AI_PROVIDER_NAMES[selectedProvider as Exclude<AiProvider, ''>] || 'the AI'}. Click on a color swatch to copy its hex code.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                  {palettes.map((palette, index) => (
                    <ColorPaletteCard 
                        key={`${palette.name}-${index}`} 
                        palette={palette}
                        onGenerateIdeas={() => handleGenerateIdeas(index)}
                        isIdeaLoading={ideaLoadingStates[index] || false}
                        ideaError={ideaErrorStates[index] || null}
                        onGenerateDesignPrompt={() => handleGenerateDesignPrompt(index)}
                        isDesignPromptLoading={designPromptLoadingStates[index] || false}
                        designPromptError={designPromptErrorStates[index] || null}
                    />
                  ))}
                </div>
              </>
            )}
             {!isLoading && !error && palettes.length === 0 && showResults && (
                <div className="text-center py-12">
                    <InformationCircleIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-400">No palettes were generated.</p>
                    <p className="text-gray-500">Try adjusting your input or ensure your AI provider is correctly configured.</p>
                </div>
            )}
          </section>
        )}
      </main>

      <footer className="py-8 text-center border-t border-neutral-800">
        <p className="text-sm text-gray-500">
          VibeMatch &copy; {new Date().getFullYear()}. Powered by your chosen AI.
        </p>
         <p className="text-xs text-gray-600 mt-1">
          Remember to review AI outputs and adhere to provider terms of service.
        </p>
      </footer>
    </div>
  );
};

export default App;
