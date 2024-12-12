import { RecipeGenerator } from "@/components/ui/recipe-generator";

export default function RecipesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
        AI Recipe Generator (Beta)
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Welcome to our beta program! Generate personalized recipes with AI and get instant Instacart shopping lists. 
        Enter your beta access code to get started.
      </p>
      <RecipeGenerator />
    </div>
  );
} 