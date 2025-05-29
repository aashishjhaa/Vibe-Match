import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ColorPalette, BrandInspiration, AiService } from '../types';

const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

class GeminiAiService implements AiService {
  private ai: GoogleGenAI | null = null;
  private providerName: string = "Google Gemini";
  private currentApiKey: string | null = null;

  constructor() {
    // Key will be provided via initializeWithKey
  }

  async initializeWithKey(apiKey: string): Promise<boolean> {
    if (!apiKey) {
      this.ai = null;
      this.currentApiKey = null;
      console.warn("Attempted to initialize Gemini with an empty API key.");
      return false;
    }
    try {
      this.ai = new GoogleGenAI({ apiKey });
      this.currentApiKey = apiKey;
      console.log("GeminiAiService initialized with user-provided key.");
      return true;
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI for Gemini with provided key:", error);
      this.ai = null;
      this.currentApiKey = null;
      return false;
    }
  }

  isConfigured(): boolean {
    return this.ai !== null && this.currentApiKey !== null;
  }

  getProviderName(): string {
    return this.providerName;
  }

  private getStrictPalettePrompt(combinedInput: string): string {
    return `
You are an expert color theorist and brand designer named VibeMatch AI.
Based on the following brand information, generate EXACTLY 4 distinct color palettes.
Each palette MUST include:
1. A creative and descriptive name (e.g., "Crimson Energy", "Midnight Edge").
2. An array of 4 to 6 valid HEX color codes (e.g., ["#RRGGBB", "#RRGGBB", ...]). Ensure colors are distinct and complementary.
3. A brief description (1-2 sentences) explaining the mood, feel, and ideal application of the palette.
4. Font recommendations as an object with "heading" and "body" properties, both strings (e.g., { "heading": "Poppins", "body": "Roboto" }). Fonts should be commonly available web fonts.

Brand Information: "${combinedInput}"

Return the response as a single, valid JSON array of 4 objects. Each object in the array must strictly follow this structure:
{
  "name": "Palette Name",
  "colors": ["#RRGGBB", "#RRGGBB", "#RRGGBB", "#RRGGBB"],
  "description": "Palette description. This string must be valid JSON content, with any internal quotes or special characters properly escaped.",
  "fontRecommendations": {
    "heading": "Suggested Heading Font Name",
    "body": "Suggested Body Font Name"
  }
}

Example of a single palette object in the JSON array:
{
  "name": "Nocturne Power",
  "colors": ["#1A0000", "#3D0000", "#6B0F1A", "#940000", "#FF2D2D"],
  "description": "This palette evokes a sense of power, mystery, and modern intensity, ideal for bold or tech-focused brands. Internal \\"quotes\\" must be escaped.",
  "fontRecommendations": {
    "heading": "Bebas Neue",
    "body": "Montserrat"
  }
}

IMPORTANT JSON FORMATTING RULES:
1. The entire output MUST BE ONLY the JSON array. Do not include any introductory text, concluding text, or markdown backticks (like \`\`\`json) around the JSON array.
2. The JSON array must contain exactly 4 palette objects.
3. Each object must strictly adhere to the specified fields and data types.
4. All string values within the JSON must be properly escaped (e.g., double quotes inside strings as \\").
`;
  }


  async generateColorPalettes(inspiration: BrandInspiration, modelName: string = GEMINI_MODEL_NAME): Promise<ColorPalette[]> {
    if (!this.isConfigured() || !this.ai) {
      throw new Error("Gemini API client is not initialized. Please ensure your Gemini API key is set in settings.");
    }

    let combinedInput = "";
    if (inspiration.vibe) combinedInput += `Design Vibe: ${inspiration.vibe}. `;
    if (inspiration.industry) combinedInput += `Industry: ${inspiration.industry}. `;
    if (inspiration.targetAudience) combinedInput += `Target Audience: ${inspiration.targetAudience}. `;
    if (inspiration.keywords) combinedInput += `Keywords: ${inspiration.keywords}. `;
    if (inspiration.story) combinedInput += `Brand Story/Details: ${inspiration.story}.`;

    if (!combinedInput.trim()) {
      throw new Error("Please provide some information about your brand or vision.");
    }

    const prompt = this.getStrictPalettePrompt(combinedInput);
    let response: GenerateContentResponse | null = null;

    try {
      response = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8,
          topP: 0.95,
          topK: 50
        },
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }

      const parsedData = JSON.parse(jsonStr);

      if (!Array.isArray(parsedData) || parsedData.length !== 4 || parsedData.some(p =>
          typeof p.name !== 'string' ||
          !Array.isArray(p.colors) ||
          p.colors.some((c: any) => typeof c !== 'string' || !/^#[0-9A-Fa-f]{6}$/i.test(c) ) ||
          typeof p.description !== 'string' ||
          typeof p.fontRecommendations !== 'object' ||
          typeof p.fontRecommendations.heading !== 'string' ||
          typeof p.fontRecommendations.body !== 'string'
      )) {
          console.error("Invalid palette structure or count received from Gemini API:", parsedData);
          const rawResponseText = response ? response.text.substring(0, 300) + "..." : "N/A";
          throw new Error(`Gemini AI's response was not in the expected format (expected 4 palettes with new font structure). Raw response snippet: ${rawResponseText}`);
      }

      return parsedData.map(p => ({ ...p, implementationIdeas: undefined, designPrompt: undefined })) as ColorPalette[];

    } catch (error) {
      console.error("Error generating color palettes with Gemini:", error);
      const baseMessage = `Gemini API Error: Failed to generate palettes.`;
      if (error instanceof SyntaxError) {
          const rawText = response ? response.text : "API response text not available";
          console.error("Malformed JSON response from Gemini API:", rawText);
          throw new Error(`${baseMessage} Malformed JSON response. Snippet: ${rawText.substring(0,300)}...`);
      }
      if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
           throw new Error("The provided Gemini API key is invalid. Please check your settings.");
        }
        const errorDetails = response ? ` (API response snippet: ${String(response.text).substring(0,100)}...)` : "";
        throw new Error(`${baseMessage} ${error.message}${errorDetails}`);
      }
      throw new Error(`${baseMessage} An unknown error occurred.`);
    }
  }

  async generateImplementationIdeas(palette: ColorPalette, inspiration: BrandInspiration, modelName: string = GEMINI_MODEL_NAME): Promise<string> {
    if (!this.isConfigured() || !this.ai) {
      throw new Error("Gemini API client is not initialized. Please ensure your Gemini API key is set in settings.");
    }

    let combinedInspiration = "User's Original Brand Vision:\n";
    if (inspiration.vibe) combinedInspiration += `- Vibe/Mood: ${inspiration.vibe}\n`;
    if (inspiration.industry) combinedInspiration += `- Industry: ${inspiration.industry}\n`;
    if (inspiration.targetAudience) combinedInspiration += `- Target Audience: ${inspiration.targetAudience}\n`;
    if (inspiration.keywords) combinedInspiration += `- Keywords: ${inspiration.keywords}\n`;
    if (inspiration.story) combinedInspiration += `- Brand Story/Details: ${inspiration.story}\n\n`;
    else combinedInspiration += "\n";

    const paletteDetails = `Chosen Color Palette:
- Name: "${palette.name}"
- Colors: ${JSON.stringify(palette.colors)} (Primary: ${palette.colors[0]}, Secondary: ${palette.colors[1]}, Accent: ${palette.colors[palette.colors.length -1]})
- Description: "${palette.description}"
- Suggested Heading Font: "${palette.fontRecommendations.heading}"
- Suggested Body Font: "${palette.fontRecommendations.body}"
`;

    const isECommerce = [
      inspiration.industry?.toLowerCase(),
      inspiration.keywords?.toLowerCase(),
      inspiration.story?.toLowerCase(),
      inspiration.targetAudience?.toLowerCase()
    ].some(text => text && (text.includes('shop') || text.includes('store') || text.includes('product') || text.includes('sell') || text.includes('e-commerce') || text.includes('retail')));

    const shopSectionPrompt = isECommerce ? `
### Shop/Products Page:
*   Discuss product card styling (background, borders, text colors, imagery interaction).
*   How to display pricing effectively with the palette.
*   'Add to Cart' / 'Buy Now' button design (color, hover states, font usage).
*   Use of accent colors for sale badges, special offers, or featured products.
*   Styling for filters, sort controls, and pagination.
` : "";

    const prompt = `
You are VibeMatch AI, an expert UI/UX designer and branding consultant. Your task is to provide practical and creative website implementation ideas for a specific color palette and font suggestion, deeply considering the user's original brand vision.

${combinedInspiration}
${paletteDetails}

Based on ALL the information above, provide concrete, actionable ideas on how to apply this specific palette and font across a typical website structure. Be specific about which colors from the palette to use for different elements (e.g., 'Use ${palette.colors[0]} for backgrounds, ${palette.colors[3]} for primary call-to-action buttons'). Emphasize creating a cohesive and visually appealing user experience.

Structure your advice for the following sections. Use markdown for headings (### Section Name), bullet points (*), and bold text (**).

### Hero Section:
*   Overall first impression: How can the colors and fonts establish the brand's vibe immediately?
*   Background: Solid color, gradient, pattern, or image overlay with a color tint?
*   Headline: Font choice (${palette.fontRecommendations.heading}), size, color.
*   Sub-headline/Tagline: Complementary font usage (${palette.fontRecommendations.body}), color.
*   Primary Call-to-Action (CTA) button(s): Background color, text color, hover effects.
*   Imagery/Iconography: Interaction with palette.

### About Us Section:
*   Tone and Storytelling: How palette enhances narrative.
*   Layout & Visual Hierarchy: Color use for sections/key info.
*   Accent Colors: Impactful use (pull quotes, stats).
*   Font Usage: Conveying personality with ${palette.fontRecommendations.heading} for titles and ${palette.fontRecommendations.body} for text.

### Key UI Element Styling:
*   **Buttons:**
    *   Primary Button (e.g., 'Submit', 'Learn More'): Suggest background color (e.g., from ${palette.colors[2]} or ${palette.colors[3]}), text color (e.g., a light contrasting color like ${palette.colors[0]} or a dark one depending on button bg), border (if any), and hover/active states using specific colors from the palette.
    *   Secondary Button (e.g., 'Cancel', 'View Details'): Suggest styles (e.g., outline style using an accent color, or a less prominent background).
*   **Cards (for content display):**
    *   Suggest background color (e.g., a lighter shade from the palette or a contrasting neutral), border/shadow treatment, and text colors for headings and body content within cards.
*   **Form Inputs:**
    *   Suggest background color, border, text color, and focus state styling for typical input fields, ensuring readability and a cohesive look with the palette.

### Footer:
*   Background color.
*   Text color for links, copyright.
*   Subtle branding elements.

${shopSectionPrompt}

### General Design & UX Tips:
*   **Color Ratios & Balance:** Dominant, secondary, accent usage.
*   **Contrast & Accessibility:** Importance of text/background contrast.
*   **Font Hierarchy:** Headings (H1-H3 using ${palette.fontRecommendations.heading}), body text (${palette.fontRecommendations.body}), captions.
*   **Interactive Elements:** Hover, active, focus states for buttons, links, forms.
*   **White Space:** Enhancing palette impact.

Provide rich, descriptive ideas. Goal: empower user to visualize website.
Ensure the output is only the markdown formatted text. No other explanatory text.
`;
    let response: GenerateContentResponse | null = null;
    try {
      response = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40
        },
      });
      return response.text.trim();
    } catch (error) {
      console.error("Error generating implementation ideas with Gemini:", error);
      const baseMessage = "Gemini API Error: Failed to generate implementation ideas.";
      if (error instanceof Error) {
        const errorDetails = response ? ` (API response snippet: ${String(response.text).substring(0,100)}...)` : "";
        throw new Error(`${baseMessage} ${error.message}${errorDetails}`);
      }
      throw new Error(`${baseMessage} An unknown error occurred.`);
    }
  }

  async generateDesignPrompt(palette: ColorPalette, inspiration: BrandInspiration, modelName: string = GEMINI_MODEL_NAME): Promise<string> {
    if (!this.isConfigured() || !this.ai) {
      throw new Error("Gemini API client is not initialized. Please ensure your Gemini API key is set in settings.");
    }

    let combinedInspiration = "Original Brand Vision:\n";
    if (inspiration.vibe) combinedInspiration += `- Desired Vibe: ${inspiration.vibe}\n`;
    if (inspiration.industry) combinedInspiration += `- Industry: ${inspiration.industry}\n`;
    if (inspiration.targetAudience) combinedInspiration += `- Target Audience: ${inspiration.targetAudience}\n`;
    if (inspiration.keywords) combinedInspiration += `- Key Concepts: ${inspiration.keywords}\n`;
    if (inspiration.story) combinedInspiration += `- Brand Story: ${inspiration.story}\n\n`;
    else combinedInspiration += "\n";

    const paletteDetails = `Selected Color Palette:
- Name: "${palette.name}"
- Colors: ${JSON.stringify(palette.colors)} (Primary: ${palette.colors[0]}, Accent: ${palette.colors[palette.colors.length - 1]})
- Description: "${palette.description}"
- Recommended Heading Font: "${palette.fontRecommendations.heading}"
- Recommended Body Font: "${palette.fontRecommendations.body}"
`;

    const prompt = `
You are VibeMatch AI, an expert design prompt generator for AI visual tools.
User's Brand Information:
${combinedInspiration}
Palette & Font Details:
${paletteDetails}

Generate a concise, rich descriptive prompt for AI "vibe coding" or visual generation tools.
The prompt must guide an AI to:
1.  **Establish Core Vibe:** Start with a phrase capturing overall mood.
2.  **Specify Color Application:** Main background, text colors, CTA buttons, accent colors. Be specific with hex codes.
3.  **Define Font Usage:** Primary font style and application (e.g., "${palette.fontRecommendations.heading} for headings, ${palette.fontRecommendations.body} for body text to convey...").
4.  **Describe UI Element Styling (Briefly):** Feel for cards, nav bars, footers.
5.  **Overall Aesthetic Notes:** E.g., "clean, modern interface with ample whitespace."

Output: A single block of descriptive text, formatted as a continuous prompt. No markdown.
Example: "Create a website with a luxurious vibe. Use #1A2B3C as primary background. Text in #F0F0F0, headings in Oswald font, body text in Lato. CTAs in #C0A080 gold. Accent with #D4AF37. Minimalist, sophisticated aesthetic."

Generate only the textual prompt. No intro/conclusion.
`;
    let response: GenerateContentResponse | null = null;
    try {
      response = await this.ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.6,
          topP: 0.9,
          topK: 30
        },
      });
      return response.text.trim();
    } catch (error) {
      console.error("Error generating design prompt with Gemini:", error);
      const baseMessage = "Gemini API Error: Failed to generate design prompt.";
      if (error instanceof Error) {
        const errorDetails = response ? ` (API response snippet: ${String(response.text).substring(0,100)}...)` : "";
        throw new Error(`${baseMessage} ${error.message}${errorDetails}`);
      }
      throw new Error(`${baseMessage} An unknown error occurred.`);
    }
  }
}

export default new GeminiAiService();