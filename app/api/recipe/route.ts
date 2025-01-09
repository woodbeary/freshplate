import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const runtime = 'edge';

// Instacart Platform API Configuration
const IS_PRODUCTION = (req: Request) => {
  const host = req.headers.get('host') || '';
  return host.includes('freshplate.vercel.app');
};

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

function parseFraction(fractionStr: string): number {
  const parts = fractionStr.split('/');
  if (parts.length === 2) {
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    if (denominator !== 0) {
      return numerator / denominator;
    }
  }
  return parseFloat(fractionStr);
}

function parseIngredient(ingredient: string): ParsedIngredient {
  // Remove leading dash
  ingredient = ingredient.replace(/^-\s*/, '');

  // Regular expression to match quantity, unit, and ingredient name
  const measurementRegex = /^([\d./]+)\s*(cup|tablespoon|teaspoon|ounce|pound|tbsp|tsp|oz|lb|g|ml|cups|tablespoons|teaspoons|ounces|pounds)s?\b\s*(.+)$/i;
  const match = ingredient.match(measurementRegex);

  if (match) {
    const [, quantity, unit, name] = match;
    // Convert fractions to decimals using our safe function
    const numericQuantity = parseFraction(quantity);

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

async function generateShoppingListLink(ingredients: string[], req: Request): Promise<string> {
  try {
    const INSTACART_API_KEY = IS_PRODUCTION(req) ? process.env.PROD_INSTACART_API_KEY : process.env.INSTACART_API_KEY;
    const INSTACART_API_URL = IS_PRODUCTION(req)
      ? 'https://connect.instacart.com/idp/v1'
      : 'https://connect.dev.instacart.tools/idp/v1';
    const TASTEMAKERS_ID = '5487';

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
          'Accept-Language': 'en-US',
          'X-Instacart-Affiliate-Id': TASTEMAKERS_ID
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

// Add difficulty level descriptions
const DIFFICULTY_GUIDELINES = {
  easy: `
    - Use basic cooking techniques only (e.g., boiling, simple sautéing)
    - Minimal knife work, mostly basic chopping
    - Maximum of 5-6 ingredients
    - No complex timing or temperature management
    - Simple one-pan or one-pot recipes
    - Total cooking time under 30 minutes
  `,
  medium: `
    - Intermediate techniques (e.g., sauce-making, proper knife work)
    - Multiple cooking methods may be combined
    - 6-10 ingredients
    - Some timing coordination required
    - May use multiple pans/pots
    - Total cooking time 30-60 minutes
  `,
  difficult: `
    - Advanced techniques (e.g., pastry work, complex sauces)
    - Precise knife skills required
    - 10+ ingredients with some specialty items
    - Complex timing and temperature management
    - Multiple components cooked separately
    - Total cooking time 1-2 hours
  `,
  expert: `
    - Professional techniques (e.g., sous vide, smoking, lamination)
    - Expert knife skills and precision required
    - Specialty ingredients and equipment needed
    - Complex multi-step processes
    - Multiple components with precise timing
    - Total cooking time 2+ hours
  `
};

async function getWeatherData(latitude: string, longitude: string) {
  try {
    // First, get the grid coordinates from lat/lon
    const pointsResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`,
      {
        headers: {
          'User-Agent': '(freshplate.ai, contact@freshplate.ai)',
          'Accept': 'application/json'
        }
      }
    );

    if (!pointsResponse.ok) {
      console.error('Weather API points error:', await pointsResponse.text());
      return null;
    }

    const pointsData = await pointsResponse.json();
    const forecastUrl = pointsData.properties.forecast;

    // Then, get the actual forecast
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': '(freshplate.ai, contact@freshplate.ai)',
        'Accept': 'application/json'
      }
    });

    if (!forecastResponse.ok) {
      console.error('Weather API forecast error:', await forecastResponse.text());
      return null;
    }

    const forecastData = await forecastResponse.json();
    const currentPeriod = forecastData.properties.periods[0];

    return {
      temp: currentPeriod.temperature,
      description: currentPeriod.shortForecast.toLowerCase(),
      timeOfDay: getTimeOfDay(new Date())
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

function getWeatherDescription(weatherData: { temp: number; description: string; timeOfDay: string } | null, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): string {
  if (!weatherData) {
    // Fallback to the old estimation if weather API fails
    const descriptions = {
      morning: [
        `The morning air is mild, perfect for a hearty breakfast`,
        `As the sun rises, the temperature is ideal for energizing meals`,
        `The gentle morning breeze calls for comforting breakfast dishes`
      ],
      afternoon: [
        `The afternoon is perfect for fresh, vibrant dishes`,
        `The weather invites refreshing meal choices`,
        `The pleasant afternoon warmth complements colorful, seasonal ingredients`
      ],
      evening: [
        `The evening sets the mood for a satisfying dinner`,
        `The temperature is perfect for a comforting meal`,
        `The pleasant evening calls for flavorful dinner options`
      ],
      night: [
        `The night air is perfect for cozy, warming dishes`,
        `The cool night temperature suggests comforting flavors`,
        `The night calls for satisfying late dishes`
      ]
    };
    return descriptions[timeOfDay][Math.floor(Math.random() * descriptions[timeOfDay].length)];
  }

  const { temp, description } = weatherData;
  const descriptions = {
    morning: [
      `At ${temp}°F with ${description}, it's perfect for a hearty breakfast`,
      `The ${description} morning at ${temp}°F calls for an energizing start`,
      `With ${description} and ${temp}°F, enjoy a fresh morning meal`
    ],
    afternoon: [
      `The ${description} afternoon at ${temp}°F is ideal for fresh, vibrant dishes`,
      `At ${temp}°F with ${description}, the weather invites refreshing meal choices`,
      `The ${temp}°F afternoon with ${description} complements seasonal ingredients`
    ],
    evening: [
      `The ${description} evening at ${temp}°F sets the mood for dinner`,
      `With ${temp}°F and ${description}, it's perfect for a comforting meal`,
      `The ${temp}°F evening with ${description} calls for flavorful options`
    ],
    night: [
      `The ${description} night at ${temp}°F is perfect for cozy dishes`,
      `At ${temp}°F with ${description}, enjoy warming comfort food`,
      `The ${temp}°F night with ${description} calls for satisfying flavors`
    ]
  };

  return descriptions[timeOfDay][Math.floor(Math.random() * descriptions[timeOfDay].length)];
}

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
      const latitude = locationData.places[0]?.latitude;
      const longitude = locationData.places[0]?.longitude;

      // Get current date info
      const date = new Date();
      const timeOfDay = getTimeOfDay(date);
      
      // Get real weather data
      const weatherData = await getWeatherData(latitude, longitude);
      const weatherDesc = getWeatherDescription(weatherData, timeOfDay);
      
      locationContext = `${city}, ${state}`;
      weatherContext = weatherDesc;
    }

    // Format people information for the prompt
    const peopleContext = people?.length > 0 
      ? `\nDiners:\n${people.map((p: { name: string; description?: string }) => 
          `- ${p.name}${p.description ? ` (${p.description})` : ''}`).join('\n')}`
      : '';

    // Generate recipe using Gemini
    const prompt = `Create a ${difficulty || 'medium'}-level ${mealType} recipe that showcases the local ingredients and flavors of ${locationContext}.

    The recipe MUST strictly follow these ${difficulty} level guidelines:
    ${DIFFICULTY_GUIDELINES[difficulty as keyof typeof DIFFICULTY_GUIDELINES]}

    Format your response exactly as follows:

    **Recipe Name:** (Clear, descriptive title appropriate for ${mealType})

    **Context:**
    Brief explanation connecting this recipe to the local ingredients and cultural elements of ${locationContext}. Consider both traditional and modern interpretations.

    **Equipment Needed:**
    - Essential tools only
    - List alternatives if possible
    (Equipment should match the ${difficulty} difficulty level)

    **Ingredients:**
    - [exact measurement] [ingredient], [brief description if needed]
    (List each ingredient with a dash, in order of use)
    (Number of ingredients should match ${difficulty} level requirements)

    **Method:**
    1. Clear, numbered steps
    2. Include exact temperatures and timings
    3. Describe visual/tactile cues for doneness
    (Number each step, be precise, complexity should match ${difficulty} level)

    **Chef's Notes:**
    - Essential tips for success
    - Substitution options
    - Storage instructions
    (Start each note with a dash)

    Additional Context:
    - Location: ${locationContext}
    - Weather: ${weatherContext}
    - Meal Type: ${mealType}
    - Servings: ${servings}
    - Dietary Needs: ${dietary || 'None specified'}
    - Health Goals: ${additionalInfo || 'General wellness'}${peopleContext}

    Focus on creating a unique and flavorful dish that combines local ingredients with cooking techniques appropriate for the ${difficulty} level. The recipe should be achievable for someone with the corresponding skill level, while still being challenging enough to match the difficulty rating. Consider the current weather (${weatherContext}) for appropriate cooking methods and serving temperature, but don't limit the recipe selection to only seasonal dishes.

    Remember: This recipe MUST match the ${difficulty} difficulty level in terms of techniques, timing, and complexity. Do not include techniques or steps that exceed or fall below this difficulty level.`;

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
    const shoppingListUrl = await generateShoppingListLink(ingredients, req);
    
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

// Helper functions for time of day
function getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
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

    // Update the shopping list generation to pass the request
    const shoppingListUrl = await generateShoppingListLink(selectedIngredients, req);
    
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