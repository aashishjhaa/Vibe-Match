import Groq from "groq-sdk";
import { ColorPalette, BrandInspiration, AiService } from '../types';

const GROQ_MODEL_NAME = 'llama3-8b-8192';

class GroqAiService implements AiService {
  private groq: Groq | null = null;
  private providerName: string = "Groq";
  private currentApiKey: string | null = null;

  constructor() {
    // Key will be provided via initializeWithKey
  }

  async initializeWithKey(apiKey: string): Promise<boolean> {
    if (!apiKey) {
      this.groq = null;
      this.currentApiKey = null;
      console.warn("Attempted to initialize Groq with an empty API key.");
      return false;
    }
    try {
      this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      this.currentApiKey = apiKey;
      console.log("GroqAiService initialized with user-provided key.");
      return true;
    } catch (error) {
      console.error("Failed to initialize Groq client with provided key:", error);
      this.groq = null;
      this.currentApiKey = null;
      return false;
    }
  }

  isConfigured(): boolean {
    return this.groq !== null && this.currentApiKey !== null;
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

IMPORTANT:
- Output ONLY the JSON array. No introductory text, no concluding text, no markdown backticks.
- The JSON array must contain exactly 4 palette objects.
- All string values in the JSON must be properly escaped.
`;
  }

  async generateColorPalettes(inspiration: BrandInspiration, modelName: string = GROQ_MODEL_NAME): Promise<ColorPalette[]> {
    if (!this.isConfigured() || !this.groq) {
      throw new Error("Groq client is not initialized. Please ensure your Groq API key is set in settings.");
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

    const promptContent = this.getStrictPalettePrompt(combinedInput);
    let responseText: string | null = null;

    try {
      const completion = await this.groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "You are an AI assistant that strictly follows instructions and outputs only valid JSON as requested." },
          { role: "user", content: promptContent }
        ],
        temperature: 0.7,
        // Groq's API (OpenAI compatible) might support response_format: { type: "json_object" }
        // but it depends on the underlying model. Llama3 through Groq typically handles JSON well with direct prompting.
      });

      responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("Groq API returned an empty response.");
      }

      let jsonStr = responseText.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }

      const parsedData = JSON.parse(jsonStr);

      if (!Array.isArray(parsedData) || parsedData.length !== 4 || parsedData.some(p =>
          typeof p.name !== 'string' ||
          !Array.isArray(p.colors) ||
          p.colors.some((c: any) => typeof c !== 'string' || !/^#[0-9A-Fa-f]{6}$/i.test(c)) ||
          typeof p.description !== 'string' ||
          typeof p.fontRecommendations !== 'object' ||
          typeof p.fontRecommendations.heading !== 'string' ||
          typeof p.fontRecommendations.body !== 'string'
      )) {
          console.error("Invalid palette structure or count received from Groq API:", parsedData);
          throw new Error(`Groq API's response was not in the expected format (expected 4 palettes with new font structure). Raw response snippet: ${responseText.substring(0, 300)}...`);
      }

      return parsedData.map(p => ({ ...p, implementationIdeas: undefined, designPrompt: undefined })) as ColorPalette[];

    } catch (error) {
      console.error("Error generating color palettes with Groq:", error);
      const baseMessage = `Groq API Error: Failed to generate palettes.`;
      if (error instanceof SyntaxError) {
          const rawText = responseText || "API response text not available";
          console.error("Malformed JSON response from Groq API:", rawText);
          throw new Error(`${baseMessage} Malformed JSON response. Snippet: ${rawText.substring(0,300)}...`);
      }
      if (error instanceof Error) {
        throw new Error(`${baseMessage} ${error.message} (Raw response snippet: ${String(responseText).substring(0,100)}...)`);
      }
      throw new Error(`${baseMessage} An unknown error occurred.`);
    }
  }

  async generateImplementationIdeas(palette: ColorPalette, inspiration: BrandInspiration, modelName: string = GROQ_MODEL_NAME): Promise<string> {
    if (!this.isConfigured() || !this.groq) {
      throw new Error("Groq client is not initialized. Please ensure your Groq API key is set in settings.");
    }

    let combinedInspiration = "User's Original Brand Vision:\n";
    if (inspiration.vibe) combinedInspiration += `- Vibe/Mood: ${inspiration.vibe}\n`;
    if (inspiration.industry) combinedInspiration += `- Industry: ${inspiration.industry}\n`;
    if (inspiration.targetAudience) combinedInspiration += `- Target Audience: ${inspiration.targetAudience}\n`;
    if (inspiration.keywords) combinedInspiration += `- Keywords: ${inspiration.keywords}\n`;
    if (inspiration.story) combinedInspiration += `- Brand Story/Details: ${inspiration.story}\n\n`; else combinedInspiration += "\n";

    const paletteDetails = `Chosen Color Palette:
- Name: "${palette.name}"
- Colors: ${JSON.stringify(palette.colors)} (Primary: ${palette.colors[0]}, Accent: ${palette.colors[palette.colors.length -1]})
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
You are VibeMatch AI, an expert UI/UX designer. Provide practical website implementation ideas for the given color palette, fonts, and brand vision.

${combinedInspiration}
${paletteDetails}

Structure advice using markdown (### Section, *, **). Focus on:
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
    *   Primary Button (e.g., 'Submit', 'Learn More'): Suggest background color (e.g., from ${palette.colors[2]} or ${palette.colors[3]}), text color, border (if any), and hover/active states using specific colors from the palette.
    *   Secondary Button (e.g., 'Cancel', 'View Details'): Suggest styles (e.g., outline style using an accent color, or a less prominent background).
*   **Cards (for content display):**
    *   Suggest background color, border/shadow treatment, and text colors for headings and body content within cards.
*   **Form Inputs:**
    *   Suggest background color, border, text color, and focus state styling for typical input fields.

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

Provide rich, descriptive ideas. Output only markdown.
`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "You are a helpful UI/UX design consultant providing website implementation ideas in markdown format." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      });
      const text = completion.choices[0]?.message?.content;
      if (!text) throw new Error("Groq API returned an empty response for implementation ideas.");
      return text.trim();
    } catch (error) {
      console.error("Error generating implementation ideas with Groq:", error);
      const baseMessage = "Groq API Error: Failed to generate implementation ideas.";
      if (error instanceof Error) {
        throw new Error(`${baseMessage} ${error.message}`);
      }
      throw new Error(`${baseMessage} An unknown error occurred.`);
    }
  }

  async generateDesignPrompt(palette: ColorPalette, inspiration: BrandInspiration, modelName: string = GROQ_MODEL_NAME): Promise<string> {
    if (!this.isConfigured() || !this.groq) {
      throw new Error("Groq client is not initialized. Please ensure your Groq API key is set in settings.");
    }

    let combinedInspiration = "Original Brand Vision:\n";
    if (inspiration.vibe) combinedInspiration += `- Desired Vibe: ${inspiration.vibe}\n`;
    if (inspiration.industry) combinedInspiration += `- Industry: ${inspiration.industry}\n`;
    if (inspiration.targetAudience) combinedInspiration += `- Target Audience: ${inspiration.targetAudience}\n`;
    if (inspiration.keywords) combinedInspiration += `- Key Concepts: ${inspiration.keywords}\n`;
    if (inspiration.story) combinedInspiration += `- Brand Story: ${inspiration.story}\n\n`; else combinedInspiration += "\n";

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
1.  **Establish Core Vibe.**
2.  **Specify Color Application** (backgrounds, text, CTAs, accents with hex codes).
3.  **Define Font Usage** (style and application of "${palette.fontRecommendations.heading}" for headings and "${palette.fontRecommendations.body}" for body text).
4.  **Describe UI Element Styling (Briefly)** (cards, nav bars, footers).
5.  **Overall Aesthetic Notes.**

Output: A single block of descriptive text, continuous prompt. No markdown.
Example: "Create a website with a luxurious vibe. Use #1A2B3C as primary background. Text in #F0F0F0, headings in Oswald font, body text in Lato. CTAs in #C0A080 gold. Accent with #D4AF37. Minimalist, sophisticated aesthetic."

Generate only the textual prompt. No intro/conclusion.
`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: "You are an AI assistant that generates concise design prompts as a single block of text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
      });
      const text = completion.choices[0]?.message?.content;
      if (!text) throw new Error("Groq API returned an empty response for design prompt.");
      return text.trim();
    } catch (error) {
      console.error("Error generating design prompt with Groq:", error);
      const baseMessage = "Groq API Error: Failed to generate design prompt.";
      if (error instanceof Error) {
        throw new Error(`${baseMessage} ${error.message}`);
      }
      throw new Error(`${baseMessage} An unknown error occurred.`);
    }
  }
}

export default new GroqAiService();