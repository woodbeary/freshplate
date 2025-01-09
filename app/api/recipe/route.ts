import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const runtime = 'edge';

// Instacart Platform API Configuration
const INSTACART_API_KEY = process.env.INSTACART_API_KEY;
const INSTACART_API_URL = 'https://connect.dev.instacart.tools/idp/v1';

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

function parseIngredient(ingredient: string): ParsedIngredient {
  // Remove leading dash
  ingredient = ingredient.replace(/^-\s*/, '');

  // Regular expression to match quantity, unit, and ingredient name
  const measurementRegex = /^([\d./]+)\s*(cup|tablespoon|teaspoon|ounce|pound|tbsp|tsp|oz|lb|g|ml|cups|tablespoons|teaspoons|ounces|pounds)s?\b\s*(.+)$/i;
  const match = ingredient.match(measurementRegex);

  if (match) {
    const [, quantity, unit, name] = match;
    // Convert fractions to decimals
    const numericQuantity = quantity.includes('/')
      ? eval(quantity) // safely evaluate fraction
      : parseFloat(quantity);

    // Standardize units
    let standardUnit = unit.toLowerCase();
    switch (standardUnit) {
      case 'tbsp':
      case 'tablespoons':
        standardUnit = 'tablespoon';
        break;
      case 'tsp':
      case 'teaspoons':
        standardUnit = 'teaspoon';
        break;
      case 'oz':
      case 'ounces':
        standardUnit = 'ounce';
        break;
      case 'lb':
      case 'pounds':
        standardUnit = 'pound';
        break;
      case 'cups':
        standardUnit = 'cup';
        break;
    }

    return {
      name: name.split(',')[0].trim(), // Remove preparation instructions
      quantity: numericQuantity,
      unit: standardUnit
    };
  }

  // If no measurement found, return default values
  return {
    name: ingredient.split(',')[0].trim(),
    quantity: 1,
    unit: 'each'
  };
}

function cleanIngredientForSearch(ingredient: string): string {
  // Remove the leading dash, measurements, and any text in parentheses
  return ingredient
    .replace(/^-\s*/, '') // Remove leading dash
    .replace(/^\d+\/?\d*\s*(cup|tablespoon|teaspoon|ounce|pound|tbsp|tsp|oz|lb|g|ml|cups|tablespoons|teaspoons|ounces|pounds)s?\b/i, '') // Remove measurements
    .replace(/\([^)]*\)/g, '') // Remove text in parentheses
    .split(',')[0] // Take only the main ingredient, not preparation instructions
    .trim();
}

async function generateInstacartLink(ingredient: string): Promise<string> {
  const searchTerm = encodeURIComponent(cleanIngredientForSearch(ingredient));
  return `https://www.instacart.com/store/search/${searchTerm}`;
}

async function generateShoppingListLink(ingredients: string[]): Promise<string> {
  try {
    if (INSTACART_API_KEY) {
      const parsedIngredients = ingredients.map(ingredient => {
        const parsed = parseIngredient(ingredient);
        return {
          name: parsed.name,
          display_text: ingredient,
          measurements: [{
            quantity: parsed.quantity,
            unit: parsed.unit
          }]
        };
      });

      // Create a more concise recipe title
      const title = ingredients.length === 1 
        ? `Shopping List - ${ingredients[0]}`
        : `Shopping List - ${ingredients.length} items`;

      const response = await fetch(`${INSTACART_API_URL}/products/recipe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INSTACART_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': 'en-US'
        },
        body: JSON.stringify({
          title,
          ingredients: parsedIngredients,
          country_code: "US",
          landing_page_configuration: {
            enable_pantry_items: false
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.products_link_url;
      } else {
        console.error('Instacart API error:', await response.text());
        return '';
      }
    }
    return '';
  } catch (error) {
    console.error('Error creating recipe:', error);
    return '';
  }
}

// Language type
type SupportedLanguage = 'en' | 'es' | 'zh' | 'vi' | 'tl' | 'ko';

// Language mapping for Gemini API
const languageMap: Record<SupportedLanguage, string> = {
  'en': 'English',
  'es': 'Spanish',
  'zh': 'Chinese',
  'vi': 'Vietnamese',
  'tl': 'Tagalog',
  'ko': 'Korean'
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      zipCode, 
      dietary, 
      servings, 
      additionalInfo, 
      difficulty, 
      people, 
      mealType, 
      timezone,
      language 
    } = body;

    // Validate and cast language to SupportedLanguage
    const validLanguage: SupportedLanguage = (language || 'en') as SupportedLanguage;
    if (!Object.keys(languageMap).includes(validLanguage)) {
      throw new Error('Invalid language selected');
    }

    if (!zipCode?.trim()) {
      return NextResponse.json(
        { error: 'ZIP code is required' },
        { status: 400 }
      );
    }

    // Get location data from ZIP code using public API
    const locationResponse = await fetch(
      `https://api.zippopotam.us/us/${zipCode}`
    );
    
    let locationContext = '';
    let weatherContext = '';
    
    if (locationResponse.ok) {
      const locationData = await locationResponse.json();
      const city = locationData.places[0]?.['place name'];
      const state = locationData.places[0]?.state;
      const latitude = parseFloat(locationData.places[0]?.latitude);

      // Get current date info
      const date = new Date();
      const currentSeason = getSeason(date);
      
      // Calculate approximate temperature based on latitude and season
      const baseTemp = getBaseTemperature(latitude, currentSeason);
      const timeOfDay = getTimeOfDay(date);
      const weatherDesc = getWeatherDescription(baseTemp, timeOfDay);
      
      locationContext = `${city}, ${state}`;
      weatherContext = weatherDesc;
    }

    // Get current time in user's timezone
    const userTime = new Date().toLocaleString('en-US', { timeZone: timezone });
    const userDate = new Date(userTime);
    const currentSeason = getSeason(userDate);
    const timeOfDay = getTimeOfDay(userDate);

    // Format people information for the prompt
    const peopleContext = people?.length > 0 
      ? `\nDiners:\n${people.map((p: { name: string; description?: string }) => 
          `- ${p.name}${p.description ? ` (${p.description})` : ''}`).join('\n')}`
      : '';

    // Generate recipe using Gemini
    const prompt = `Create a ${difficulty || 'medium'}-level ${mealType} recipe in ${languageMap[validLanguage]} that connects with the current season in ${locationContext}.

    Format your response exactly as follows (in ${languageMap[validLanguage]}):

    **Recipe Name:** (Clear, descriptive title appropriate for ${mealType})

    **Context:**
    Brief explanation of why this recipe is perfect for ${mealType} during the current season and location. Include local ingredients and cultural significance.

    **Equipment Needed:**
    - Essential tools only
    - List alternatives if possible

    **Ingredients:**
    - [exact measurement] [ingredient], [brief description if needed]
    (List each ingredient with a dash, in order of use)

    **Method:**
    1. Clear, numbered steps
    2. Include exact temperatures and timings
    3. Describe visual/tactile cues for doneness
    (Number each step, be precise)

    **Chef's Notes:**
    - Essential tips for success
    - Substitution options
    - Storage instructions
    (Start each note with a dash)

    Additional Context:
    - Location: ${locationContext}
    - Season: ${currentSeason}
    - Weather: ${weatherContext}
    - Time of Day: ${timeOfDay}
    - Meal Type: ${mealType}
    - Servings: ${servings}
    - Dietary Needs: ${dietary || 'None specified'}
    - Health Goals: ${additionalInfo || 'General wellness'}${peopleContext}

    Keep the recipe practical, seasonal, and focused on local ingredients. Make sure it's appropriate for ${mealType} and the current time of day (${timeOfDay}). The entire response should be in ${languageMap[validLanguage]}.`;

    const response = await model.generateContent(prompt);
    const result = response.response.text();

    console.log('Raw AI Response:', result);

    // Parse recipe sections
    let recipeName = '';
    let context = '';
    let ingredients: string[] = [];
    let method: string[] = [];
    let chefNotes: string[] = [];

    // Extract recipe name from the first section
    const recipeNameMatch = result.match(/(?:\*\*Recipe Name:\*\*|## Recipe Name:|### Recipe Name:)([^#*]+)/);
    if (recipeNameMatch) {
      recipeName = recipeNameMatch[1].trim();
    }

    // Extract other sections
    const contextMatch = result.match(/(?:\*\*Context:\*\*|### Context:)([^#*]+)/);
    if (contextMatch) {
      context = contextMatch[1].trim();
    }

    const ingredientsMatch = result.match(/(?:\*\*Ingredients:\*\*|### Ingredients:)([^#*]+)/);
    if (ingredientsMatch) {
      ingredients = ingredientsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim());
    }

    const methodMatch = result.match(/(?:\*\*Method:\*\*|### Method:)([^#*]+)/);
    if (methodMatch) {
      method = methodMatch[1]
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          // Match both numbered lines and bold-formatted lines
          return trimmed && (
            /^\d+\./.test(trimmed) || 
            /\*\*[^:]+:\*\*/.test(trimmed)
          );
        })
        .map(line => {
          // Remove bold formatting if present
          return line.trim().replace(/\*\*([^:]+):\*\*/, '$1:');
        });
    }

    const notesMatch = result.match(/(?:\*\*Chef's Notes:\*\*|### Chef's Notes:)([^#*]+)/);
    if (notesMatch) {
      chefNotes = notesMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim());
    }

    // Debug logs
    console.log('Parsed Sections:', {
      recipeName,
      context,
      ingredientsCount: ingredients.length,
      methodCount: method.length,
      notesCount: chefNotes.length
    });

    // More lenient validation
    if (!ingredients.length && !method.length) {
      console.error('Failed to parse recipe sections:', result);
      throw new Error('Could not parse recipe format. Please try again.');
    }

    // Generate individual search links
    const individualLinks = await Promise.all(
      ingredients.map(async ingredient => ({
        ingredient,
        link: await generateInstacartLink(ingredient),
        isSelected: false
      }))
    );

    // Try to create a shopping list with ingredients
    const shoppingListUrl = await generateShoppingListLink(ingredients);
    
    // If we get a shopping list URL, return that, otherwise fall back to individual search links
    const shoppingList = [
      ...individualLinks,
      ...(shoppingListUrl ? [{
        ingredient: 'Full Recipe',
        link: shoppingListUrl,
        isSelected: false,
        isFullRecipe: true
      }] : [])
    ];

    // Return structured response
    const response_data = {
      recipe: result,
      recipeName,
      context,
      ingredients,
      method,
      chefNotes,
      shoppingList,
      difficulty: difficulty || 'medium',
      confidence: 0.95,
      weatherContext,
      locationContext
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

// Helper functions for weather and seasonal context
function getSeason(date: Date): string {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

function getBaseTemperature(latitude: number, season: string): number {
  // Rough temperature estimation based on latitude and season
  const baseTemp = 75 - Math.abs(latitude - 35);
  
  switch (season) {
    case 'Summer': return baseTemp + 15;
    case 'Winter': return baseTemp - 20;
    case 'Spring': return baseTemp;
    case 'Fall': return baseTemp - 5;
    default: return baseTemp;
  }
}

function getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getWeatherDescription(baseTemp: number, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): string {
  const descriptions = {
    morning: [
      'The crisp morning air suggests a hearty breakfast',
      'As the sun rises, the temperature is perfect for light, energizing meals',
      'The gentle morning breeze calls for comforting breakfast dishes'
    ],
    afternoon: [
      'The warm afternoon sun is ideal for fresh, vibrant dishes',
      'The peak day temperature invites refreshing meal choices',
      'The bright afternoon light complements colorful, seasonal ingredients'
    ],
    evening: [
      'The cooling evening air welcomes warming, satisfying dishes',
      'As the day winds down, the temperature is perfect for family-style meals',
      'The sunset brings a perfect atmosphere for intimate dining'
    ],
    night: [
      'The calm night air suggests soothing, relaxing flavors',
      'The peaceful nighttime atmosphere calls for gentle, digestible dishes',
      'The quiet night invites mindful, balanced eating'
    ]
  } as const;

  const timeDescriptions = descriptions[timeOfDay];
  const randomIndex = Math.floor(Math.random() * timeDescriptions.length);
  
  return `${timeDescriptions[randomIndex]}. Current estimated temperature: ${Math.round(baseTemp)}°F.`;
}

// Add this new endpoint for selected ingredients
export async function PUT(req: Request) {
  try {
    const { selectedIngredients } = await req.json();

    if (!selectedIngredients?.length) {
      return NextResponse.json(
        { error: 'No ingredients selected' },
        { status: 400 }
      );
    }

    // Create a shopping list with just the selected ingredients
    const shoppingListUrl = await generateShoppingListLink(selectedIngredients);
    
    if (!shoppingListUrl) {
      return NextResponse.json(
        { error: 'Failed to create shopping list' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: shoppingListUrl });
  } catch (error) {
    console.error('Error creating shopping list:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error creating shopping list';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 