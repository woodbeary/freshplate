'use client';

import { RecipeGenerator } from '@/components/ui/recipe-generator';
import { Card, CardContent } from "@/components/ui/card";

export default function RecipePage() {
  return (
    <div className="max-w-xl mx-auto min-h-screen w-full px-4 sm:px-0">
      <Card className="shadow-none border-0">
        <CardContent className="p-0">
          <RecipeGenerator />
        </CardContent>
      </Card>
    </div>
  );
} 