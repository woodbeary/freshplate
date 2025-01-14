import { Card, CardContent } from "./card";
import { Button } from "./button";

interface RecipeDisplayProps {
  recipeName: string;
  context: string;
  ingredients: string[];
  method: string[];
  chefNotes: string[];
  shoppingList: Array<{
    ingredient: string;
    link: string;
    isSelected: boolean;
  }>;
}

export function RecipeDisplay({ 
  recipeName, 
  context, 
  ingredients, 
  method, 
  chefNotes,
  shoppingList 
}: RecipeDisplayProps) {
  const handleInstacartClick = (url: string) => {
    // Redirect through our proxy
    window.location.href = `/api/instacart-redirect?url=${encodeURIComponent(url)}`;
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{recipeName}</h2>
        
        <div className="mb-6">
          <p className="text-gray-700">{context}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
          <ul className="list-disc pl-5">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700 flex items-center justify-between">
                <span>{ingredient}</span>
                {shoppingList[index]?.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInstacartClick(shoppingList[index].link)}
                    className="ml-2"
                  >
                    Add to Cart
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Method</h3>
          <ol className="list-decimal pl-5">
            {method.map((step, index) => (
              <li key={index} className="text-gray-700 mb-2">{step}</li>
            ))}
          </ol>
        </div>

        {chefNotes.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Chef's Notes</h3>
            <ul className="list-disc pl-5">
              {chefNotes.map((note, index) => (
                <li key={index} className="text-gray-700">{note}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 