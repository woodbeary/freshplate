import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Utensils, ChefHat, Truck, CookingPot } from "lucide-react";

const steps = [
  { 
    title: "Share Your Preferences", 
    description: "Tell our AI about your favorite dishes, dietary restrictions, and health goals. Our advanced AI will learn your tastes to create perfect recipes.", 
    icon: Utensils 
  },
  { 
    title: "Get AI-Generated Recipes", 
    description: "Our AI creates custom recipes inspired by your preferences, optimized for home cooking and your health goals.", 
    icon: ChefHat 
  },
  { 
    title: "Instant Shopping Lists", 
    description: "Generate Instacart shopping lists with one click. Beta: Instant lists. Coming Soon: Direct ordering and delivery tracking.", 
    icon: Truck 
  },
  { 
    title: "Cook with Confidence", 
    description: "Follow our detailed instructions to create restaurant-quality meals at home, with AI-powered tips and tricks.", 
    icon: CookingPot 
  }
];

const faqs = [
  { 
    q: "How does the AI recipe generation work?", 
    a: "Our AI analyzes your preferences, dietary needs, and favorite dishes to create personalized recipes that you'll love. It continuously learns from your feedback to improve recommendations." 
  },
  { 
    q: "What's included in the beta version?", 
    a: "Beta subscribers get access to AI-powered recipe generation and instant Instacart shopping list creation. Direct ordering and delivery tracking features are coming soon." 
  },
  { 
    q: "Can I customize the recipes?", 
    a: "Yes! You can adjust portions, ingredients, and cooking methods. Our AI will remember your preferences for future recommendations." 
  },
  { 
    q: "How does the Instacart integration work?", 
    a: "Currently, we generate instant shopping lists that you can use on Instacart. In the upcoming full version, you'll be able to order and track deliveries directly from our platform." 
  }
];

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">How FreshPlate Works</h1>
      
      <p className="text-lg mb-12 text-center max-w-3xl mx-auto">
        Experience the future of home cooking with AI-powered recipe generation and seamless Instacart integration. 
        Get started with our beta version today and be the first to try new features as they launch.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {steps.map((step, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-700 flex items-center">
                <span className="mr-2">{index + 1}.</span> {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-center mb-4">
                <step.icon className="w-24 h-24 text-green-600" />
              </div>
              <p>{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="mb-12 max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-semibold text-green-700">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-gray-700">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="text-center">
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <Link href="/waitlist">Join the Waitlist</Link>
        </Button>
      </div>
    </div>
  );
}