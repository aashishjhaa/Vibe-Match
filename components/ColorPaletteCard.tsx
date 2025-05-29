
import React, { useState, useEffect } from 'react';
import { ColorPalette } from '../types';
import {
    LightBulbIcon,
    SwatchIcon,
    ClipboardDocumentIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CommandLineIcon,
    PencilSquareIcon,
    CodeBracketSquareIcon, 
    CodeBracketIcon,
    PaintBrushIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from './Icons';
import { calculateContrastRatio, getWCAGRatings, WCAGRating } from '../utils/colorUtils';

interface ColorPaletteCardProps {
  palette: ColorPalette;
  onGenerateIdeas: () => void;
  isIdeaLoading: boolean;
  ideaError: string | null;
  onGenerateDesignPrompt: () => void;
  isDesignPromptLoading: boolean;
  designPromptError: string | null;
}

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const ColorPaletteCard: React.FC<ColorPaletteCardProps> = ({
    palette,
    onGenerateIdeas,
    isIdeaLoading,
    ideaError,
    onGenerateDesignPrompt,
    isDesignPromptLoading,
    designPromptError
}) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isIdeasCopied, setIsIdeasCopied] = useState<boolean>(false);
  const [isIdeasExpanded, setIsIdeasExpanded] = useState<boolean>(false);
  const [isDesignPromptCopied, setIsDesignPromptCopied] = useState<boolean>(false);
  const [isDesignPromptExpanded, setIsDesignPromptExpanded] = useState<boolean>(false);
  const [isCssVarsCopied, setIsCssVarsCopied] = useState<boolean>(false);
  const [isTailwindConfigCopied, setIsTailwindConfigCopied] = useState<boolean>(false);
  const [isCssInJsThemeCopied, setIsCssInJsThemeCopied] = useState<boolean>(false);

  // New state for collapsible sections
  const [isDevToolsVisible, setIsDevToolsVisible] = useState<boolean>(false);
  const [isAiContentVisible, setIsAiContentVisible] = useState<boolean>(false);

  const handleColorClick = (color: string) => {
    navigator.clipboard.writeText(color)
      .then(() => {
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy color: ', err);
        alert('Failed to copy color. Your browser might not support this feature or requires permissions.');
      });
  };

  const handleCopyGeneric = (textToCopy: string | undefined, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>, successMessage: string, errorMessage: string) => {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopiedState(true);
          setTimeout(() => setCopiedState(false), 2500);
        })
        .catch(err => {
          console.error(errorMessage, err);
          alert(`${errorMessage}. Your browser might not support this feature or requires permissions.`);
        });
    }
  };

  const handleCopyIdeas = () => handleCopyGeneric(palette.implementationIdeas, setIsIdeasCopied, 'Ideas Copied!', 'Failed to copy implementation ideas');
  const handleCopyDesignPrompt = () => handleCopyGeneric(palette.designPrompt, setIsDesignPromptCopied, 'Prompt Copied!', 'Failed to copy design prompt');
  
  const handleCopyCssVariables = () => {
    const paletteSlug = slugify(palette.name);
    const cssVars = `/* Palette: ${palette.name} */\n` +
      palette.colors.map((color, index) => `--palette-${paletteSlug}-color-${index + 1}: ${color};`).join('\n') +
      `\n\n/* Fonts for: ${palette.name} */\n` +
      `--font-heading-${paletteSlug}: "${palette.fontRecommendations.heading}", sans-serif;\n` +
      `--font-body-${paletteSlug}: "${palette.fontRecommendations.body}", sans-serif;`;
    handleCopyGeneric(cssVars, setIsCssVarsCopied, 'CSS Variables Copied!', 'Failed to copy CSS Variables');
  };

  const handleCopyTailwindConfig = () => {
    const paletteSlug = slugify(palette.name);
    const colorConfig = palette.colors.map((color, index) => 
      `        'vm-${paletteSlug}-${index + 1}': '${color}',`
    ).join('\n');
    const tailwindConfig = 
`// For tailwind.config.js theme.extend:
// Palette: ${palette.name}
module.exports = {
  theme: {
    extend: {
      colors: {
${colorConfig}
      },
      fontFamily: {
        'vm-heading-${paletteSlug}': ['${palette.fontRecommendations.heading}', 'sans-serif'],
        'vm-body-${paletteSlug}': ['${palette.fontRecommendations.body}', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`;
    handleCopyGeneric(tailwindConfig.trim(), setIsTailwindConfigCopied, 'Tailwind Config Copied!', 'Failed to copy Tailwind Config');
  };

  const handleCopyCssInJsTheme = () => {
    const colorTheme = palette.colors.map((color, index) => 
      `    color${index + 1}: '${color}',`
    ).join('\n');
    const cssInJsTheme = 
`// For CSS-in-JS (e.g., Styled Components, Emotion)
// Theme: ${palette.name}
const theme = {
  colors: {
${colorTheme}
  },
  fonts: {
    heading: "'${palette.fontRecommendations.heading}', sans-serif",
    body: "'${palette.fontRecommendations.body}', sans-serif",
  }
};

export default theme;`;
    handleCopyGeneric(cssInJsTheme.trim(), setIsCssInJsThemeCopied, 'CSS-in-JS Theme Copied!', 'Failed to copy CSS-in-JS Theme');
  };

  useEffect(() => {
    setIsIdeasExpanded(false);
    setIsDesignPromptExpanded(false);
    setIsDevToolsVisible(false);
    setIsAiContentVisible(false);
  }, [palette.name]);

  const previewMaxHeight = '14rem';

  const ContrastDisplay: React.FC<{color1: string, color2: string, name1: string, name2: string}> = React.memo(({color1, color2, name1, name2}) => {
    const ratio = calculateContrastRatio(color1, color2);
    const ratings = getWCAGRatings(ratio);
    return (
        <div className="p-3 bg-neutral-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full border border-neutral-500" style={{backgroundColor: color1}}></div>
                    <span className="text-xs text-gray-400">vs</span>
                    <div className="w-5 h-5 rounded-full border border-neutral-500" style={{backgroundColor: color2}}></div>
                </div>
                <span className="text-lg font-semibold text-red-300">{ratio.toFixed(2)}:1</span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{name1} on {name2}</p>
            <div className="space-y-1">
                {ratings.map(r => (
                    <div key={`${r.level}-${r.size}`} className={`flex items-center justify-between text-xs px-2 py-0.5 rounded ${r.passes ? 'bg-green-800/70 text-green-300' : 'bg-red-800/70 text-red-300'}`}>
                        <span>{r.level} ({r.size})</span>
                        {r.passes ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <XCircleIcon className="w-3.5 h-3.5" />}
                    </div>
                ))}
            </div>
        </div>
    );
  });
  ContrastDisplay.displayName = 'ContrastDisplay';


  const ToggleButton: React.FC<{
    onClick: () => void;
    isExpanded: boolean;
    icon: React.ReactNode;
    text: string;
    className?: string;
  }> = ({ onClick, isExpanded, icon, text, className }) => (
    <button
      onClick={onClick}
      aria-expanded={isExpanded}
      className={`flex-1 w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-60 transition-all duration-300 ${
        isExpanded ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200'
      } ${className || ''}`}
    >
      {icon}
      {text}
      {isExpanded ? <ChevronUpIcon className="w-4 h-4 ml-2" /> : <ChevronDownIcon className="w-4 h-4 ml-2" />}
    </button>
  );
  ToggleButton.displayName = 'ToggleButton';

  return (
    <div className="bg-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-red-600/40 ring-1 ring-neutral-700 space-y-6">
      {/* Core Info: Name & Description */}
      <div>
        <h3 className="text-3xl font-semibold text-red-500 mb-2">{palette.name}</h3>
        <p className="text-gray-300 text-base leading-relaxed">{palette.description}</p>
      </div>

      {/* Core Info: Colors */}
      <div className="mb-0"> {/* Reduced mb from mb-6 */}
          <h4 className="text-sm font-medium text-red-400 mb-2 uppercase tracking-wider flex items-center">
              <SwatchIcon className="w-4 h-4 mr-2 text-red-500" />
              Colors
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"> {/* Adjusted grid for up to 6 colors */}
            {palette.colors.map((color, index) => (
              <div
                key={index}
                className="relative h-28 sm:h-32 rounded-xl shadow-lg flex flex-col items-center justify-end p-2.5 cursor-pointer transform hover:scale-105 transition-transform duration-200 group"
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                onKeyPress={(e) => e.key === 'Enter' && handleColorClick(color)}
                tabIndex={0}
                role="button"
                aria-label={`Copy color ${color}`}
              >
                <span
                  className="text-xs font-medium px-2 py-1 rounded-md shadow-sm"
                  style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff', fontFamily: "'Roboto Mono', monospace" }}
                >
                  {color}
                </span>
                {copiedColor === color && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-10">
                    Copied!
                  </span>
                )}
              </div>
            ))}
          </div>
      </div>

      {/* Core Info: Font Suggestions */}
      <div className="mb-0"> {/* Reduced mb from mb-6 */}
          <h4 className="text-sm font-medium text-red-400 mb-2 uppercase tracking-wider flex items-center">
            <PencilSquareIcon className="w-4 h-4 mr-2 text-red-500" />
            Font Suggestions
          </h4>
          <div className="space-y-2">
            <div>
                <p className="text-xs text-gray-400">Heading Font:</p>
                <p
                    className="text-xl font-semibold text-gray-100 bg-neutral-700/60 inline-block px-3 py-1.5 rounded-lg shadow"
                    style={{ fontFamily: `"${palette.fontRecommendations.heading}", Poppins, sans-serif` }}
                >
                    {palette.fontRecommendations.heading}
                </p>
            </div>
            <div>
                <p className="text-xs text-gray-400">Body Font:</p>
                <p
                    className="text-lg text-gray-200 bg-neutral-700/60 inline-block px-3 py-1.5 rounded-lg shadow"
                    style={{ fontFamily: `"${palette.fontRecommendations.body}", Poppins, sans-serif` }}
                >
                    {palette.fontRecommendations.body}
                </p>
            </div>
          </div>
      </div>
      
      {/* Toggle Buttons for Collapsible Sections */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-700/50">
        <ToggleButton
          onClick={() => setIsDevToolsVisible(!isDevToolsVisible)}
          isExpanded={isDevToolsVisible}
          icon={<CodeBracketIcon className="w-4 h-4 mr-2" />}
          text="Developer Utilities"
        />
        <ToggleButton
          onClick={() => setIsAiContentVisible(!isAiContentVisible)}
          isExpanded={isAiContentVisible}
          icon={<LightBulbIcon className="w-4 h-4 mr-2" />}
          text="AI Insights & Ideas"
        />
      </div>

      {/* Developer Utilities Section (Collapsible) */}
      {isDevToolsVisible && (
        <div className="pt-6 border-t border-neutral-700/50 space-y-6 animate-fadeIn"> {/* Added animate-fadeIn */}
          {/* CSS Variables Button */}
           <div>
                <h5 className="text-base font-semibold text-red-400 mb-2 flex items-center">
                    <CommandLineIcon className="w-4 h-4 mr-2" /> CSS Variables
                </h5>
                <button
                    onClick={handleCopyCssVariables}
                    disabled={isCssVarsCopied}
                    className="flex items-center px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-70"
                    aria-label="Copy CSS Variables"
                >
                    <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                    {isCssVarsCopied ? 'Variables Copied!' : 'Copy CSS Variables'}
                </button>
            </div>

          {/* Theme Configuration Exports Buttons */}
          <div>
                <h5 className="text-base font-semibold text-red-400 mb-2 flex items-center">
                    <CodeBracketSquareIcon className="w-4 h-4 mr-2" /> Theme Configuration Exports
                </h5>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleCopyTailwindConfig}
                        disabled={isTailwindConfigCopied}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-70"
                        aria-label="Copy Tailwind CSS Config"
                    >
                        <CodeBracketSquareIcon className="w-4 h-4 mr-2" />
                        {isTailwindConfigCopied ? 'Tailwind Copied!' : 'Copy Tailwind Config'}
                    </button>
                    <button
                        onClick={handleCopyCssInJsTheme}
                        disabled={isCssInJsThemeCopied}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-70"
                        aria-label="Copy CSS-in-JS Theme Object"
                    >
                        <PaintBrushIcon className="w-4 h-4 mr-2" />
                        {isCssInJsThemeCopied ? 'CSS-in-JS Copied!' : 'Copy CSS-in-JS Theme'}
                    </button>
                </div>
            </div>

          {/* Accessibility Insights */}
           <div>
                <h5 className="text-base font-semibold text-red-400 mb-3 flex items-center">
                    <EyeIcon className="w-4 h-4 mr-2" /> Accessibility Insights
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {palette.colors.length >= 3 && (
                        <ContrastDisplay color1={palette.colors[2]} color2={palette.colors[0]} name1="Color 3" name2="Color 1" />
                    )}
                    {palette.colors.length >= 4 && (
                        <ContrastDisplay color1={palette.colors[3]} color2={palette.colors[0]} name1="Color 4" name2="Color 1" />
                    )}
                    <ContrastDisplay color1={palette.colors[0]} color2="#FFFFFF" name1="Color 1" name2="White" />
                    <ContrastDisplay color1={palette.colors[0]} color2="#1F2937" name1="Color 1" name2="Dark Gray" />
                    <ContrastDisplay color1={palette.colors[palette.colors.length - 1]} color2="#FFFFFF" name1={`Color ${palette.colors.length}`} name2="White" />
                    {palette.colors.length >= 3 && (
                        <ContrastDisplay color1={palette.colors[2]} color2="#000000" name1="Color 3" name2="Black" />
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    Contrast ratios are approximate. Always test with actual content. "Large Text" is typically 18pt+ or 14pt+ bold.
                </p>
            </div>
        </div>
      )}

      {/* AI Insights & Ideas Section (Collapsible) */}
      {isAiContentVisible && (
        <div className="pt-6 border-t border-neutral-700/50 animate-fadeIn"> {/* Added animate-fadeIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {/* AI Design Prompt Section */}
            <div className="space-y-3"> {/* Removed pt-6 and border-t as parent has it */}
              <div className="flex justify-between items-center min-h-10">
                  <h4 className="text-lg font-semibold text-red-400 flex items-center">
                      <CommandLineIcon className="w-5 h-5 mr-2 text-red-500" />
                      AI Design Prompt
                  </h4>
                  {palette.designPrompt && !isDesignPromptLoading && (
                       <button
                          onClick={handleCopyDesignPrompt}
                          disabled={isDesignPromptCopied}
                          className="relative flex items-center px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200 text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-70"
                          aria-label="Copy AI design prompt"
                      >
                          <ClipboardDocumentIcon className="w-4 h-4 mr-1.5" />
                          {isDesignPromptCopied ? 'Copied!' : 'Copy Prompt'}
                      </button>
                  )}
              </div>
              <p className="text-xs text-gray-400 -mt-2">A textual prompt for AI vibe/visual generation tools.</p>

              {!palette.designPrompt && !isDesignPromptLoading && !designPromptError && (
                  <button
                  onClick={onGenerateDesignPrompt}
                  disabled={isDesignPromptLoading || !!palette.designPrompt}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-60 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                  >
                  <CommandLineIcon className="w-5 h-5 mr-2" />
                  Generate AI Design Prompt
                  </button>
              )}
              {isDesignPromptLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-400 mx-auto"></div>
                  <p className="text-sm text-red-300 mt-2">Generating Prompt...</p>
                </div>
              )}
              {designPromptError && !isDesignPromptLoading && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-sm">
                  <p className="font-semibold">Error:</p>
                  <p>{designPromptError}</p>
                </div>
              )}
              {palette.designPrompt && !isDesignPromptLoading && (
                  <div className="mt-2 relative">
                      <div
                          className={`max-w-none text-gray-300
                                      transition-all duration-300 ease-in-out overflow-hidden relative
                                      ${isDesignPromptExpanded ? 'max-h-[1000px]' : `max-h-[${previewMaxHeight}]`}`}
                      >
                          <pre
                              className="whitespace-pre-wrap font-sans bg-neutral-700/30 p-4 rounded-md text-sm leading-relaxed"
                              style={{fontFamily: 'inherit'}}
                          >
                              {palette.designPrompt}
                          </pre>
                          {!isDesignPromptExpanded && (
                               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none"></div>
                          )}
                      </div>
                      <button
                          onClick={() => setIsDesignPromptExpanded(!isDesignPromptExpanded)}
                          className="mt-3 flex items-center text-sm text-red-400 hover:text-red-300 focus:outline-none font-medium"
                          aria-expanded={isDesignPromptExpanded}
                      >
                          {isDesignPromptExpanded ? <ChevronUpIcon className="w-4 h-4 mr-1.5" /> : <ChevronDownIcon className="w-4 h-4 mr-1.5" />}
                          {isDesignPromptExpanded ? 'Show Less' : 'Show More'}
                      </button>
                  </div>
              )}
            </div>

            {/* Implementation Ideas Section */}
            <div className="space-y-3"> {/* Removed pt-6 and border-t */}
              <div className="flex justify-between items-center min-h-10">
                  <h4 className="text-lg font-semibold text-red-400 flex items-center">
                      <LightBulbIcon className="w-5 h-5 mr-2 text-red-500" />
                      Implementation Ideas
                  </h4>
                  {palette.implementationIdeas && !isIdeaLoading && (
                       <button
                          onClick={handleCopyIdeas}
                          disabled={isIdeasCopied}
                          className="relative flex items-center px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-red-300 hover:text-red-200 text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-70"
                          aria-label="Copy implementation ideas"
                      >
                          <ClipboardDocumentIcon className="w-4 h-4 mr-1.5" />
                          {isIdeasCopied ? 'Copied!' : 'Copy Ideas'}
                      </button>
                  )}
              </div>
              <p className="text-xs text-gray-400 -mt-2">Detailed suggestions for applying this palette.</p>

              {!palette.implementationIdeas && !isIdeaLoading && !ideaError && (
                  <button
                  onClick={onGenerateIdeas}
                  disabled={isIdeaLoading || !!palette.implementationIdeas}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-60 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                  >
                  Generate Implementation Ideas
                  </button>
              )}
              {isIdeaLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-400 mx-auto"></div>
                  <p className="text-sm text-red-300 mt-2">Generating Ideas...</p>
                </div>
              )}
              {ideaError && !isIdeaLoading && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300 text-sm">
                  <p className="font-semibold">Error:</p>
                  <p>{ideaError}</p>
                </div>
              )}
              {palette.implementationIdeas && !isIdeaLoading && (
                  <div className="mt-2 relative">
                      <div
                          className={`prose prose-sm prose-invert max-w-none text-gray-300
                                      prose-headings:text-red-400 prose-strong:text-red-300
                                      prose-bullets:marker:text-red-500 prose-a:text-red-400 hover:prose-a:text-red-300
                                      transition-all duration-300 ease-in-out overflow-hidden relative
                                      ${isIdeasExpanded ? 'max-h-[1000px]' : `max-h-[${previewMaxHeight}]`}`}
                      >
                          <pre
                              className="whitespace-pre-wrap font-sans bg-neutral-700/30 p-4 rounded-md text-sm leading-relaxed"
                              style={{fontFamily: 'inherit'}}
                          >
                              {palette.implementationIdeas}
                          </pre>
                          {!isIdeasExpanded && (
                               <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none"></div>
                          )}
                      </div>
                      <button
                          onClick={() => setIsIdeasExpanded(!isIdeasExpanded)}
                          className="mt-3 flex items-center text-sm text-red-400 hover:text-red-300 focus:outline-none font-medium"
                          aria-expanded={isIdeasExpanded}
                      >
                          {isIdeasExpanded ? <ChevronUpIcon className="w-4 h-4 mr-1.5" /> : <ChevronDownIcon className="w-4 h-4 mr-1.5" />}
                          {isIdeasExpanded ? 'Show Less' : 'Show More'}
                      </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteCard;
