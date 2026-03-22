import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateImage(identity: string, scenario: string): Promise<string> {
  const prompt = `A highly detailed, professional photo of a person. Identity/Appearance: ${identity}. Scenario/Context: ${scenario}.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }

  throw new Error("Failed to generate image.");
}

export async function generateCaption(identity: string, scenario: string, imageBase64: string): Promise<string> {
  const prompt = `Write an engaging Instagram caption for a photo of this person. Identity: ${identity}. Scenario: ${scenario}. Keep it natural, add relevant emojis, and include 3-5 hashtags.`;
  
  // Extract base64 data without the prefix
  const base64Data = imageBase64.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/png',
          }
        },
        {
          text: prompt
        }
      ]
    }
  });

  return response.text || "No caption generated.";
}
