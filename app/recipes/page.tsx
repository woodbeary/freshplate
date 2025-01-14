'use client';

import { RecipeGenerator } from '@/components/ui/recipe-generator';
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from 'react';

// Add type declaration for Instacart widget
declare global {
  interface Window {
    instacart?: {
      widgets?: {
        recipe?: {
          click: () => void;
        };
      };
    };
  }
}

export default function RecipePage() {
  useEffect(() => {
    // Silently set up Instacart affiliate tracking
    const script = document.createElement('script');
    script.innerHTML = `
      (function (d, s, id, a) { 
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; } 
        js = d.createElement(s); 
        js.id = id;
        js.src = "https://widgets.instacart.com/widget-bundle-v2.js"; 
        js.async = true;
        js.dataset.source_origin = "affiliate_hub"; 
        fjs.parentNode.insertBefore(js, fjs); 
      })(document, "script", "standard-instacart-widget-v1");
    `;
    document.head.appendChild(script);

    // Inject hidden button that will be "clicked" programmatically
    const hiddenButton = document.createElement('div');
    hiddenButton.id = "shop-with-instacart-v1";
    hiddenButton.setAttribute('data-affiliate_id', '5487');
    hiddenButton.setAttribute('data-source_origin', 'affiliate_hub');
    hiddenButton.setAttribute('data-affiliate_platform', 'recipe_widget');
    hiddenButton.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none;';
    document.body.appendChild(hiddenButton);

    // Intercept all clicks on the page that go to Instacart
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link?.href?.includes('instacart.com')) {
        e.preventDefault();
        // Simulate widget click before redirect
        if (window.instacart?.widgets?.recipe) {
          window.instacart.widgets.recipe.click();
        }
        // Add affiliate parameters
        const url = new URL(link.href);
        url.searchParams.set('aid', '5487');
        url.searchParams.set('utm_source', 'affiliate_hub');
        url.searchParams.set('utm_medium', 'recipe_widget');
        window.location.href = url.toString();
      }
    });
  }, []);

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