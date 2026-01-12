
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

export const analyzeRepository = async (
  repoName: string, 
  readme: string, 
  fileStructure: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this GitHub repository: ${repoName}
    
    README Content:
    ${readme.substring(0, 5000)}
    
    File Structure:
    ${fileStructure}
    
    Please provide a detailed technical analysis including:
    1. A concise summary of what this project does.
    2. The primary tech stack (languages, frameworks, libraries).
    3. Key features discovered from the readme and structure.
    4. An architectural suggestion or observation.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          techStack: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          keyFeatures: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          architectureSuggestion: { type: Type.STRING }
        },
        required: ["summary", "techStack", "keyFeatures", "architectureSuggestion"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Invalid response from AI model");
  }
};

export const getCodeExplanation = async (filename: string, content: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Explain the following code file (${filename}) in simple terms, highlighting its purpose and logic:
  
  \`\`\`
  ${content.substring(0, 10000)}
  \`\`\``;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text || "No explanation generated.";
};
