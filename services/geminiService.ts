import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateRecipes = async (files: File[], textQuery: string, cookingStyle?: string): Promise<Recipe[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const hasImages = files.length > 0;
  const hasText = textQuery.trim() !== '';

  if (!hasImages && !hasText) {
    return []; // Should be handled by the caller, but as a safeguard.
  }

  let prompt = `You are a witty and creative AI chef with a great sense of humor. Your primary task is to determine the user's intent.

**Standard Mode Instructions:**
- If the user's input appears to be legitimate food ingredients, proceed in "Standard Mode".
- Generate 3 distinct and creative recipe options based on the provided ingredients or preferences.
- You can include common pantry staples (like salt, pepper, oil, flour, sugar, common spices, etc.) to make the recipes more complete.

**Humorous Mode Detection:**
First, analyze the user's text input and any provided images.
- If the text input is clearly nonsensical, a joke, or contains obviously inedible items (e.g., 'a rock', 'plastic fork', 'dirty socks', 'sadness'), you MUST enter "Humorous Mode".
- Also, if the user provides images containing clearly non-food items (like a shoe, a car, or a cute animal), you MUST enter "Humorous Mode".

**Humorous Mode Instructions:**
- If in "Humorous Mode", generate **ONLY ONE** hilariously absurd and completely inedible "recipe" based on the user's input.
- This recipe must be a parody. Make it sound like a real recipe but with a funny, nonsensical twist. For example, the ingredients might be "one cup of existential dread" or "a pinch of forgotten dreams". The instructions should be equally ridiculous.
- Ensure the single humorous recipe still populates all the required JSON fields: recipeName, description, servings, difficulty, ingredients, instructions, quickTip, and nutrition (with funny values like '0 calories, 100% regret').

`;

  if (cookingStyle && cookingStyle.trim() !== '') {
    prompt += `\n- The user has requested a specific cooking style: "${cookingStyle}". Please tailor the recipes to fit this style.`;
  }

  prompt += `

**Final Output Format:**
For all recipes (real or funny), you must provide a name, a brief description, an estimated number of servings (e.g., "Serves 2-4"), a difficulty level (Easy, Medium, or Hard), a list of ingredients, step-by-step instructions, a friendly, helpful quick tip, and an estimated nutritional summary (calories, protein, carbs). Ensure your entire response is in the requested JSON format. Remember, if in Humorous Mode, only one recipe object should be in the 'recipes' array. Otherwise, provide three.`;

  const imageParts = hasImages ? await Promise.all(files.map(fileToGenerativePart)) : [];

  const fullPrompt = [
    { text: prompt }
  ];

  if(hasText){
    fullPrompt.push({ text: `\nHere is the user's text query: "${textQuery}"` });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        ...fullPrompt,
        ...imageParts,
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                recipeName: {
                  type: Type.STRING,
                  description: "The name of the recipe."
                },
                description: {
                  type: Type.STRING,
                  description: "A short, enticing description of the dish."
                },
                servings: {
                  type: Type.STRING,
                  description: "Estimated number of servings, e.g., 'Serves 2-4'."
                },
                difficulty: {
                  type: Type.STRING,
                  description: "The difficulty level: Easy, Medium, or Hard."
                },
                ingredients: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "A list of all ingredients required for the recipe."
                },
                instructions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Step-by-step instructions to prepare the dish."
                },
                quickTip: {
                    type: Type.STRING,
                    description: "A friendly and helpful tip for the recipe."
                },
                nutrition: {
                  type: Type.OBJECT,
                  description: "Estimated nutritional information for the recipe.",
                  properties: {
                    calories: {
                      type: Type.STRING,
                      description: "Estimated total calories, e.g., '450 kcal'."
                    },
                    protein: {
                      type: Type.STRING,
                      description: "Estimated total protein, e.g., '30g'."
                    },
                    carbs: {
                      type: Type.STRING,
                      description: "Estimated total carbohydrates, e.g., '50g'."
                    }
                  },
                  required: ["calories", "protein", "carbs"]
                }
              },
              required: ["recipeName", "description", "difficulty", "servings", "ingredients", "instructions", "quickTip", "nutrition"]
            }
          }
        },
        required: ["recipes"]
      },
    },
  });

  try {
    const jsonResponse = JSON.parse(response.text);
    if (jsonResponse.recipes && Array.isArray(jsonResponse.recipes)) {
      return jsonResponse.recipes as Recipe[];
    } else {
      throw new Error("Invalid response format from Gemini API.");
    }
  } catch (e) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not understand the recipe format from the AI. Please try again.");
  }
};