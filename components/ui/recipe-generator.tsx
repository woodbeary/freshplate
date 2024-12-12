'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChefHat, UtensilsCrossed, Lock, Unlock, ShoppingCart, ExternalLink, Check, Plus } from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Get beta access codes from environment variables
const BETA_ACCESS_CODES = (process.env.NEXT_PUBLIC_BETA_ACCESS_CODES || '').split(',');
const BETA_CONTACT_EMAIL = process.env.NEXT_PUBLIC_BETA_CONTACT_EMAIL || 'beta@freshplate.ai';

interface ShoppingListItem {
  ingredient: string;
  link: string;
  isSelected: boolean;
}

interface RecipeData {
  recipe: string;
  ingredients: string[];
  shoppingList: Array<{
    ingredient: string;
    link: string;
  }>;
}

export function RecipeGenerator() {
  const [preferences, setPreferences] = useState('');
  const [dietary, setDietary] = useState('');
  const [servings, setServings] = useState('2');
  const [accessCode, setAccessCode] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [recipe, setRecipe] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShoppingList([]);
    setSelectedItems(new Set());
    setRecipe('');

    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          dietary,
          servings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      const recipeData = data as RecipeData;
      setRecipe(recipeData.recipe);
      setShoppingList(
        recipeData.shoppingList.map(item => ({
          ...item,
          isSelected: false,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
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

  const openInstacartWithSelected = () => {
    shoppingList
      .filter(item => selectedItems.has(item.ingredient))
      .forEach(item => {
        window.open(item.link, '_blank');
      });
  };

  useEffect(() => {
    const existingAccess = sessionStorage.getItem('freshplate_beta_access');
    if (existingAccess === 'true') {
      setHasAccess(true);
    }
  }, []);

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
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            Recipe Generator (Beta)
          </CardTitle>
          <CardDescription>
            Generate personalized recipes and create Instacart shopping lists instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="preferences">What would you like to cook?</Label>
                <Textarea
                  id="preferences"
                  placeholder="E.g., Italian pasta, spicy curry, healthy salad..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dietary">Dietary Restrictions</Label>
                <Input
                  id="dietary"
                  placeholder="E.g., vegetarian, gluten-free, dairy-free..."
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="servings">Number of Servings</Label>
                <Select value={servings} onValueChange={setServings}>
                  <SelectTrigger>
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
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !preferences.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <UtensilsCrossed className="mr-2 h-4 w-4" />
                  Generate Recipe
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {recipe && (
        <>
          <Card>
            <CardContent className="pt-6">
              <ReactMarkdown 
                className="prose prose-green max-w-none"
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 text-green-800" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 text-green-700" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2 text-green-600" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                }}
              >
                {recipe}
              </ReactMarkdown>
            </CardContent>
          </Card>

          {shoppingList.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Instacart Shopping List
                </CardTitle>
                <CardDescription>
                  Select ingredients to add to your Instacart cart
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {shoppingList.map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          selectedItems.has(item.ingredient) 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleIngredient(item.ingredient)}
                          >
                            {selectedItems.has(item.ingredient) ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <span className="font-medium">{item.ingredient}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          asChild
                        >
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            View Item
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 items-center pt-4 border-t">
                    <Badge variant="secondary" className="mb-2">
                      {selectedItems.size} items selected
                    </Badge>
                    <Button 
                      className="w-full sm:w-auto"
                      onClick={openInstacartWithSelected}
                      disabled={selectedItems.size === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Open Selected in Instacart
                    </Button>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Coming soon: Direct add-to-cart and checkout functionality via Instacart Platform API
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
} 