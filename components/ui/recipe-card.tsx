import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Clock, Users, Printer, Download } from "lucide-react";
import { Recipe } from "./recipe-generator";

interface RecipeCardProps {
  recipe: Recipe;
  servings: number;
}

export function RecipeCard({ recipe, servings }: RecipeCardProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    // Create a blob from the recipe card HTML
    const recipeCardHtml = document.getElementById('recipe-card')?.outerHTML;
    if (!recipeCardHtml) return;

    const blob = new Blob([recipeCardHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipe.title.toLowerCase().replace(/\s+/g, '-')}-recipe.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print Recipe
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Save as PDF
        </Button>
      </div>

      <Card id="recipe-card" className="p-8 bg-white shadow-lg print:shadow-none">
        {/* Elegant Header */}
        <div className="text-center mb-8 border-b pb-6">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif mb-3">{recipe.title}</h1>
          <p className="text-gray-600 italic mb-4 max-w-2xl mx-auto">
            {recipe.localContext}
          </p>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{recipe.cookingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{servings} servings</span>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-serif mb-4 text-green-800">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-baseline gap-2">
                  <span className="text-green-600">•</span>
                  <span>{ingredient.item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-serif mb-4 text-green-800">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="font-serif text-green-600 font-bold">
                    {index + 1}.
                  </span>
                  <p className="text-gray-700">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Notes & Tips */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-serif mb-4 text-green-800">Chef's Notes</h2>
          <ul className="space-y-3">
            {recipe.notes.map((note, index) => (
              <li key={index} className="flex items-baseline gap-2">
                <span className="text-green-600">💡</span>
                <p className="text-gray-700">{note}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
          <p>Generated with ❤️ by FreshPlate</p>
          <p className="mt-1">www.freshplate.ai</p>
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #recipe-card,
          #recipe-card * {
            visibility: visible;
          }
          #recipe-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
          }
          @page {
            margin: 2cm;
          }
        }
      `}</style>
    </div>
  );
} 