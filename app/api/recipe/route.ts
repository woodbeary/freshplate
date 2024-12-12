import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const runtime = 'edge';

interface RecipeResponse {
  recipe: string;
  ingredients: string[];
  shoppingList: Array<{
    ingredient: string;
    link: string;
  }>;
}

// Instacart Platform API Configuration
const INSTACART_API_KEY = process.env.INSTACART_API_KEY;

function cleanIngredientForSearch(ingredient: string): string {
  // Remove the leading dash and measurements
  return ingredient
    .replace(/^-/, '') // Remove leading dash
    .replace(/^\d+\/?\d*\s*(cup|tablespoon|teaspoon|ounce|pound|tbsp|tsp|oz|lb|g|ml|cups|tablespoons|teaspoons|ounces|pounds)s?\b/i, '') // Remove measurements
    .trim()
    .split(',')[0] // Take only the main ingredient, not preparation instructions
    .trim();
}

async function generateInstacartLink(ingredient: string): Promise<string> {
  const cleanedIngredient = cleanIngredientForSearch(ingredient);
  const searchTerm = encodeURIComponent(cleanedIngredient);
  
  try {
    if (INSTACART_API_KEY) {
      const response = await fetch('https://api.instacart.com/v3/platform/products/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INSTACART_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: cleanedIngredient,
          limit: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        // For now, return the search URL until we properly handle the API response
        return `https://www.instacart.com/store/search/${searchTerm}`;
      }
    }
    
    // Fallback to search URL if API call fails or no API key
    return `https://www.instacart.com/store/search/${searchTerm}`;
  } catch (error) {
    console.error('Error accessing Instacart Platform API:', error);
    // Fallback to search URL
    return `https://www.instacart.com/store/search/${searchTerm}`;
  }
}

export async function POST(req: Request) {
  try {
    const { preferences, dietary, servings } = await req.json();

    if (!preferences?.trim()) {
      return NextResponse.json(
        { error: 'Recipe preferences are required' },
        { status: 400 }
      );
    }

    // Generate recipe using Gemini
    const prompt = `As a professional chef and nutritionist, create a detailed, healthy recipe that is easy to follow.
    
    Recipe requirements:
    - Preferences: ${preferences}
    - Dietary Restrictions: ${dietary || 'None'}
    - Servings: ${servings}
    
    Format the response in a structured way with these exact sections:
    1. Recipe Name
    2. Description
    3. Ingredients (with exact measurements, each ingredient on a new line with a dash prefix)
    4. Instructions (step by step, numbered)
    5. Nutritional Information (per serving)
    6. Tips and Notes

    For the ingredients section:
    - Start each ingredient with a dash (-)
    - Include precise measurements (e.g., "2 cups", "1 tablespoon")
    - List ingredients in order of use
    - Specify any preparation needed (e.g., "diced", "minced")
    
    Example format for ingredients:
    - 2 cups all-purpose flour, sifted
    - 1 tablespoon extra virgin olive oil
    - 3 cloves garlic, minced
    
    Keep measurements precise and use standard kitchen measurements (cups, tablespoons, teaspoons, ounces, etc.).
    Ensure all ingredients are commonly available in grocery stores.
    `;

    const response = await model.generateContent(prompt);
    const result = response.response.text();

    // Parse ingredients from the response
    const ingredientsSection = result.split('Ingredients')[1]?.split('Instructions')[0];
    if (!ingredientsSection) {
      throw new Error('Invalid recipe format received');
    }

    const ingredients = ingredientsSection
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim());

    if (ingredients.length === 0) {
      throw new Error('No ingredients found in recipe');
    }

    // Generate shopping list with Instacart links
    const shoppingList = await Promise.all(
      ingredients.map(async ingredient => ({
        ingredient,
        link: await generateInstacartLink(ingredient)
      }))
    );

    // Return structured response
    const response_data: RecipeResponse = {
      recipe: result,
      ingredients,
      shoppingList
    };

    return NextResponse.json(response_data);
  } catch (error) {
    console.error('Error generating recipe:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error generating recipe';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 