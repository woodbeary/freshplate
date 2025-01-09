'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChefHat, UtensilsCrossed, Lock, Unlock, ShoppingCart, ExternalLink, Check, Plus, ArrowLeft, MapPin, Users, Apple, Heart, HelpCircle, User, Clock, ShoppingBasket, ListOrdered, FileText, Cloud, ChevronRight, Share, Globe } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLocationInfo } from "@/lib/utils";
import { PeopleManager, type Person } from "./people-manager";
import { RecipeCard } from "./recipe-card";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

const LOADING_MESSAGES = [
  "Consulting the culinary constellations... ✨",
  "Harmonizing with the harvest moon... 🌕",
  "Channeling ancient kitchen wisdom... 🔮",
  "Aligning ingredients with the cosmos... 🌟",
  "Dancing with seasonal spirits... 🍂",
  "Whispering to garden fairies... 🧚‍♂️",
  "Brewing kitchen magic... 🪄",
  "Stirring in moonlit memories... 🌙",
  "Gathering wisdom from kitchen elders... 👵",
  "Blessing the recipe with mountain mist... ⛰️",
  "Infusing with spring's first light... 🌅",
  "Capturing autumn's golden whispers... 🍁"
];

// Get beta access codes from environment variables
const BETA_ACCESS_CODES = (process.env.NEXT_PUBLIC_BETA_ACCESS_CODES || '').split(',');
const BETA_CONTACT_EMAIL = process.env.NEXT_PUBLIC_BETA_CONTACT_EMAIL || 'beta@freshplate.ai';

interface ShoppingListItem {
  ingredient: string;
  link: string;
  isSelected: boolean;
  isFullRecipe?: boolean;
}

interface RecipeData {
  recipe: string;
  ingredients: string[];
  shoppingList: Array<{
    ingredient: string;
    link: string;
  }>;
  difficulty: string;
  confidence: number;
}

const DIFFICULTY_EXAMPLES = {
  easy: "Simple recipes with basic techniques (e.g., boiling pasta, basic stir-fry)",
  medium: "Intermediate skills like sauce-making, proper knife work (e.g., homemade pizza, curry)",
  difficult: "Advanced techniques like pastry work, complex timing (e.g., beef wellington, soufflé)",
  expert: "Professional equipment and techniques (e.g., sous vide, smoking, molecular gastronomy)"
} as const;

type Difficulty = keyof typeof DIFFICULTY_EXAMPLES;

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  difficult: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800"
} as const;

interface Ingredient {
  item: string;
  instacartUrl?: string;
}

export interface Recipe {
  title: string;
  cookingTime: string;
  difficulty: string;
  localContext: string;
  weatherContext: string;
  instacartUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  notes: string[];
}

// Simple SVG animations
const AnimatedSVG = ({ type }: { type: 'location' | 'servings' | 'chef' | 'dietary' | 'cooking' | 'people' }) => {
  const animations = {
    location: (
      <svg className="w-full h-full animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    servings: (
      <svg className="w-full h-full animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    people: (
      <svg className="w-full h-full animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    chef: (
      <svg className="w-full h-full animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    dietary: (
      <svg className="w-full h-full animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    cooking: (
      <svg className="w-full h-full animate-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  };

  return (
    <div className="text-green-600 transform transition-transform hover:scale-110">
      {animations[type]}
    </div>
  );
};

export function RecipeGenerator() {
  const [preferences, setPreferences] = useState('');
  const [dietary, setDietary] = useState('');
  const [servings, setServings] = useState('2');
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [step, setStep] = useState<'form' | 'recipe' | 'shopping'>('form');
  const [currentStep, setCurrentStep] = useState(1);
  const [zipCode, setZipCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [locationInfo, setLocationInfo] = useState({ city: "", state: "", description: "" });
  const [people, setPeople] = useState<Person[]>([]);
  const [showDifficultyInfo, setShowDifficultyInfo] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner');
  const [timezone, setTimezone] = useState('');
  const [language, setLanguage] = useState<'en' | 'es' | 'zh' | 'vi' | 'tl' | 'ko'>('en');

  const languageOptions = {
    'en': 'English',
    'es': 'Spanish',
    'zh': 'Chinese',
    'vi': 'Vietnamese',
    'tl': 'Tagalog',
    'ko': 'Korean'
  };

  useEffect(() => {
    if (zipCode) {
      setLocationInfo(getLocationInfo(zipCode));
    }
  }, [zipCode]);

  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      const interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    // Detect timezone on component mount
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCode,
          servings,
          dietary,
          additionalInfo,
          people,
          difficulty,
          mealType,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const data = await response.json();
      
      // Improved recipe parsing
      const recipeData: Recipe = {
        title: data.recipeName || '',
        cookingTime: '30-45 minutes',
        difficulty,
        localContext: data.context || '',
        weatherContext: data.weatherContext || '',
        instacartUrl: '',
        ingredients: data.ingredients?.map((item: string) => ({
          item,
          instacartUrl: data.shoppingList?.find((sl: any) => 
            sl.ingredient.trim() === item.trim()
          )?.link || ''
        })) || [],
        instructions: data.method || [],
        notes: data.chefNotes || []
      };

      // Set Instacart URL if available
      const fullRecipeItem = data.shoppingList?.find((item: any) => item.isFullRecipe);
      if (fullRecipeItem) {
        recipeData.instacartUrl = fullRecipeItem.link;
      }

      setRecipe(recipeData);
      setShoppingList(data.shoppingList || []);
      setStep('recipe');
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!zipCode.trim() || !/^\d{5}$/.test(zipCode))) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    if (currentStep === 5) {
      handleSubmit();
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
    setError(null);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (BETA_ACCESS_CODES.includes(accessCode.trim())) {
      setHasAccess(true);
      setAccessError('');
      sessionStorage.setItem('freshplate_beta_access', 'true');
    } else {
      setAccessError('Invalid beta access code. Please try again.');
    }
  };

  const toggleIngredient = (ingredient: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(ingredient)) {
      newSelected.delete(ingredient);
    } else {
      newSelected.add(ingredient);
    }
    setSelectedItems(newSelected);

    setShoppingList(prevList => 
      prevList.map(item => ({
        ...item,
        isSelected: newSelected.has(item.ingredient)
      }))
    );
  };

  const openInstacartWithSelected = async () => {
    if (isLoadingCart) return;
    
    setIsLoadingCart(true);
    const selectedIngredientsList = shoppingList
      .filter(item => selectedItems.has(item.ingredient))
      .map(item => item.ingredient);

    try {
      const response = await fetch('/api/recipe', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedIngredients: selectedIngredientsList,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shopping list');
      }

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating shopping list:', error);
      selectedIngredientsList.forEach(ingredient => {
        const item = shoppingList.find(i => i.ingredient === ingredient);
        if (item?.link) {
          window.open(item.link, '_blank');
        }
      });
    } finally {
      setIsLoadingCart(false);
    }
  };

  useEffect(() => {
    const existingAccess = sessionStorage.getItem('freshplate_beta_access');
    if (existingAccess === 'true') {
      setHasAccess(true);
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !(currentStep === 1 && !zipCode.trim())) {
        handleNextStep();
      }
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
  };

  const handleShare = async () => {
    if (!recipe) return;

    const shareText = `Check out this ${recipe.difficulty} recipe for ${recipe.title} on FreshPlate!\n\n` +
      `🕒 ${recipe.cookingTime}\n` +
      `👥 ${servings} servings\n\n` +
      `${recipe.localContext.split('.')[0]}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipe.title} - FreshPlate Recipe`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  const renderFormStep = () => {
    const getStepAnimation = (step: number) => {
      switch (step) {
        case 1: return 'location';
        case 2: return 'servings';
        case 3: return 'chef';
        case 4: return 'dietary';
        case 5: return 'cooking';
        default: return 'cooking';
      }
    };

    const stepContent = (() => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <MapPin className="h-5 w-5 text-green-600" />
                <h2 className="text-base sm:text-lg font-semibold">Where are you located?</h2>
              </div>
              <div>
                <Label htmlFor="zipCode">Enter your ZIP code</Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 94105"
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  onKeyDown={handleKeyPress}
                  className="mt-1 text-base sm:text-base"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={{ fontSize: '16px' }}
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2">We'll find fresh, local ingredients in your area</p>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-6" onKeyDown={handleKeyPress}>
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold">How many people are eating?</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="servings">Number of Servings</Label>
                    <Select value={servings} onValueChange={(value) => {
                      setServings(value);
                      // Reset people list if new servings is less than current people
                      if (parseInt(value) < people.length) {
                        setPeople([]);
                      }
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select servings" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'serving' : 'servings'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm font-medium">Add diners (Optional)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-green-600"
                        onClick={() => {
                          if (people.length < parseInt(servings)) {
                            setPeople([...people, { name: '', description: '' }]);
                          }
                        }}
                        disabled={people.length >= parseInt(servings)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Person
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {people.map((person, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Name"
                            value={person.name}
                            onChange={(e) => {
                              const newPeople = [...people];
                              newPeople[index].name = e.target.value;
                              setPeople(newPeople);
                            }}
                            className="flex-1 text-base"
                            style={{ fontSize: '16px' }}
                          />
                          <Input
                            placeholder="Details (e.g., vegetarian)"
                            value={person.description || ''}
                            onChange={(e) => {
                              const newPeople = [...people];
                              newPeople[index].description = e.target.value;
                              setPeople(newPeople);
                            }}
                            className="flex-1 text-base"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-4" onKeyDown={handleKeyPress}>
              <div className="flex items-center gap-2 mb-6">
                <ChefHat className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold">What's your cooking comfort level?</h2>
              </div>
              <div>
                <Label htmlFor="difficulty">Recipe Difficulty</Label>
                <div className="relative flex items-center">
                  <div className="flex-1">
                    <Select value={difficulty} onValueChange={(value: Difficulty) => {
                      setDifficulty(value);
                      setShowDifficultyInfo(false);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DIFFICULTY_EXAMPLES).map(([level, example]) => (
                          <SelectItem key={level} value={level}>
                            <span className="capitalize">{level}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-2 shrink-0 touch-auto active:scale-95 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            if ('ontouchstart' in window) {
                              setShowDifficultyInfo(!showDifficultyInfo);
                            }
                          }}
                        >
                          <HelpCircle className={cn(
                            "h-4 w-4 transition-colors",
                            showDifficultyInfo ? "text-green-600" : "text-gray-400"
                          )} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right" 
                        className="max-w-[200px] z-50 hidden sm:block"
                        sideOffset={5}
                      >
                        <p className="text-sm">{DIFFICULTY_EXAMPLES[difficulty]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Mobile-friendly info panel */}
                {showDifficultyInfo && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <ChefHat className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800 mb-1 capitalize">{difficulty} Level</h4>
                        <p className="text-sm text-green-700">{DIFFICULTY_EXAMPLES[difficulty]}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Help text */}
                <p className="text-xs text-gray-500 mt-2">
                  Tap the help icon to see example recipes for this difficulty level
                </p>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold">What meal would you like to make?</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Meal Type</Label>
                  <Select value={mealType} onValueChange={(value: 'breakfast' | 'lunch' | 'dinner') => setMealType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    Your timezone: {timezone.replace('_', ' ')}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="dietary">Dietary Restrictions (Optional)</Label>
                  <Input
                    id="dietary"
                    placeholder="e.g., vegetarian, gluten-free, dairy-free..."
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="mt-1 text-base"
                    style={{ fontSize: '16px' }}
                  />
                  <p className="text-sm text-gray-500 mt-2">Leave blank if none</p>
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="language">Recipe Language</Label>
                  <Select value={language} onValueChange={(value: 'en' | 'es' | 'zh' | 'vi' | 'tl' | 'ko') => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languageOptions).map(([code, name]) => (
                        <SelectItem key={code} value={code}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    This will generate the recipe in your chosen language. For the rest of the page, use your browser's built-in translation.
                  </p>
                </div>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold">Tell us about yourself</h2>
              </div>
              <div>
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="e.g., I'm looking for recipes that help with hormonal balance and reduce inflammation..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleNextStep();
                    }
                  }}
                  className="mt-1 text-base"
                  style={{ fontSize: '16px' }}
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-2">This helps us personalize your recipe recommendations</p>
              </div>
            </div>
          );
        default:
          return null;
      }
    })();

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
            <AnimatedSVG type={getStepAnimation(currentStep)} />
          </div>
        </div>
        <div className="bg-white rounded-lg">
          {stepContent}
        </div>
      </div>
    );
  };

  const renderRecipeHeader = () => {
    if (!recipe) return null;
    
    return (
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">{recipe.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="text-sm sm:text-base">{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="text-sm sm:text-base">{servings} servings</span>
          </div>
          <Badge variant="outline" className="font-normal text-sm">
            {recipe.difficulty || 'Medium'}
          </Badge>
        </div>

        <div className="grid gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{recipe.localContext}</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Cloud className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{recipe.weatherContext}</p>
            </div>
          </div>
        </div>

        {recipe && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 mt-4"
            onClick={() => {
              const script = document.createElement('script');
              script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
              document.body.appendChild(script);
              window.googleTranslateElementInit = function() {
                const google = (window as any).google;
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'es,zh,vi,tl,ko',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
              };
            }}
          >
            <Globe className="h-4 w-4" />
            Translate Page
          </Button>
        )}

        <div id="google_translate_element" className="mt-2"></div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="text-center py-12">
      <div className="w-32 h-32 mx-auto mb-6">
        <AnimatedSVG type="cooking" />
      </div>
      <p className="text-lg font-medium text-gray-700 mb-2 animate-pulse">
        {loadingMessage}
      </p>
      <p className="text-sm text-gray-500">
        Crafting your perfect recipe...
      </p>
    </div>
  );

  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Beta Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div>
                <Label htmlFor="accessCode">Enter Beta Access Code</Label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Enter your beta access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="mt-1"
                />
              </div>
              {accessError && (
                <p className="text-sm text-red-600">{accessError}</p>
              )}
              <Button 
                type="submit" 
                className="w-full"
                disabled={!accessCode.trim()}
              >
                <Unlock className="mr-2 h-4 w-4" />
                Access Beta
              </Button>
              <p className="text-sm text-gray-500 text-center mt-4">
                Need a beta access code? Contact us at {BETA_CONTACT_EMAIL}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen flex flex-col w-full px-4 sm:px-0">
      <Card className="shadow-none border-0 flex-1 flex flex-col relative pb-[72px] sm:pb-[80px]">
        <CardHeader className="pb-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            {step !== 'form' && (
              <Button
                variant="ghost"
                onClick={() => setStep('form')}
                className="mr-2 -ml-2 h-9 w-9 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <ChefHat className="h-5 w-5 text-green-600" />
              <span className="hidden sm:inline">Recipe Generator</span>
              <span className="sm:hidden">Recipe</span>
              <Badge variant="secondary" className="ml-1 font-normal text-sm bg-green-50 text-green-800">Beta</Badge>
            </CardTitle>
          </div>
          <CardDescription className="text-base mt-2 text-gray-600">
            Let's craft your perfect recipe
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-auto">
          {step === 'form' && (
            <div className="flex-1 flex flex-col">
              <div className="relative mb-6 sm:mb-8">
                <div className="flex justify-between mb-4 px-2 sm:px-4 pt-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ${
                        currentStep >= step 
                          ? 'bg-green-600 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{step}</span>
                      {currentStep === step && (
                        <div className="absolute inset-0 rounded-full animate-ping bg-green-400/20" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 -z-10">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {error && (
                  <div className="mx-4 mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 text-red-500 mt-0.5">⚠️</div>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 px-2 sm:px-4 pb-20">
                  {renderFormStep()}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t shadow-sm">
                  <div className="flex justify-between max-w-xl mx-auto w-full px-4 sm:px-0">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="w-20 sm:w-24"
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      type="button"
                      className={`ml-auto min-w-[5rem] sm:min-w-[6rem] ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      onClick={handleNextStep}
                      disabled={isLoading || (currentStep === 1 && !zipCode.trim())}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : currentStep === 5 ? (
                        'Create'
                      ) : (
                        'Next'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'recipe' && (
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {recipe ? (
                <div className="p-3 sm:p-6 pb-20">
                  {renderRecipeHeader()}
                  <div className="space-y-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="ingredients">
                        <AccordionTrigger className="flex items-center justify-between py-4 w-full text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <ShoppingBasket className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                            <h2 className="text-base sm:text-lg font-medium">Ingredients</h2>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {recipe.ingredients?.map((ingredient, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="text-sm sm:text-base text-gray-700">{ingredient.item}</span>
                                {ingredient.instacartUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0"
                                    onClick={() => window.open(ingredient.instacartUrl, '_blank')}
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="instructions">
                        <AccordionTrigger className="flex items-center justify-between py-4 w-full text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <ListOrdered className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                            <h2 className="text-base sm:text-lg font-medium">Instructions</h2>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 sm:space-y-4 pt-2">
                            {recipe.instructions?.map((instruction, index) => (
                              <div
                                key={index}
                                className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                              >
                                <span className="text-green-600 font-medium text-sm sm:text-base">{index + 1}.</span>
                                <p className="text-sm sm:text-base text-gray-700">{instruction}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="notes">
                        <AccordionTrigger className="flex items-center justify-between py-4 w-full text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                            <h2 className="text-base sm:text-lg font-medium">Chef's Notes</h2>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 sm:space-y-3 pt-2">
                            {recipe.notes?.map((note, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg"
                              >
                                <span className="text-green-600 text-sm sm:text-base">💡</span>
                                <p className="text-sm sm:text-base text-gray-700">{note}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {recipe.instacartUrl && (
                      <div className="sticky bottom-0 pt-3 sm:pt-4 pb-4 sm:pb-6 bg-white border-t">
                        <div className="flex gap-2">
                          <Button
                            size="lg"
                            className="flex-1 flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-3"
                            onClick={() => window.open(recipe.instacartUrl, '_blank')}
                          >
                            <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
                            View in Instacart
                          </Button>
                          {'share' in navigator && (
                            <Button
                              variant="outline"
                              size="lg"
                              className="flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-3"
                              onClick={handleShare}
                            >
                              <Share className="h-4 sm:h-5 w-4 sm:w-5" />
                              <span className="sr-only">Share Recipe</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-center text-sm text-gray-500 pt-4 border-t">
                      <p>Generated with ❤️ by FreshPlate</p>
                      <p className="mt-1">www.freshplate.ai</p>
                    </div>
                  </div>
                </div>
              ) : (
                renderLoading()
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 