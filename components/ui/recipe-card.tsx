import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, Clock, Users, Printer, Download, Share } from "lucide-react";
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
    link.download = `${recipe.recipeName.toLowerCase().replace(/\s+/g, '-')}-recipe.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    // Implement share functionality
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
          <h1 className="text-3xl font-serif mb-3">{recipe.recipeName}</h1>
          <p className="text-gray-600 italic mb-4 max-w-2xl mx-auto">
            {recipe.context}
          </p>

          {/* Recipe Meta Info */}
          <div className="flex justify-center gap-6 text-gray-600">
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

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>{ingredient.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.method.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="font-semibold text-green-600 flex-shrink-0">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Chef's Notes */}
        {recipe.chefNotes && recipe.chefNotes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Chef's Notes</h2>
            <ul className="space-y-2">
              {recipe.chefNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instacart Integration */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="max-w-xl mx-auto p-4 space-y-4">
            <div className="flex gap-2">
              <Button 
                className="flex-1 flex items-center justify-center gap-2 bg-[#003D29] hover:bg-[#002D1F] text-[#FAF1E5] h-[46px] px-[18px] py-[16px] rounded-full"
                onClick={() => window.open(recipe.instacartUrl, '_blank')}
              >
                <img 
                  src="/instacart/Instacart_Carrot.png" 
                  alt="Instacart" 
                  className="h-[22px] w-[22px] object-contain"
                />
                Get Recipe on Instacart
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="h-[46px] w-[46px] rounded-full p-0"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
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