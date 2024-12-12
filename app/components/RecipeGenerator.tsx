'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChefHat, UtensilsCrossed } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export function RecipeGenerator() {
  const [preferences, setPreferences] = useState('');
  const [dietary, setDietary] = useState('');
  const [servings, setServings] = useState('2');

  const {
    completion,
    complete,
    isLoading,
    error
  } = useCompletion({
    api: '/api/recipe',
    body: {
      preferences,
      dietary,
      servings,
    },
    onResponse: (response) => {
      // Optional: Handle streaming response events
      console.log('Streaming response started');
    },
    onFinish: (completion) => {
      // Optional: Handle completion
      console.log('Generation completed');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await complete(''); // The actual prompt is constructed on the server
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            Recipe Generator
          </CardTitle>
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
            <p className="text-red-700">Error generating recipe. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {completion && (
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
                p: ({node, ...props}) => <p className="mb-4" {...props} />
              }}
            >
              {completion}
            </ReactMarkdown>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 