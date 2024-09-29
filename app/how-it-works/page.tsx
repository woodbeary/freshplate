import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Utensils, ChefHat, Truck, CookingPot } from "lucide-react";

const steps = [
  { title: "Choose Your Favorites", description: "Browse our curated selection of dishes from top local restaurants. Select the meals that excite your taste buds.", icon: Utensils },
  { title: "We Create the Recipe", description: "Our AI analyzes your choices and creates custom recipes inspired by restaurant dishes, tailored to home cooking.", icon: ChefHat },
  { title: "Fresh Ingredients Delivered", description: "We source high-quality, locally-grown ingredients and deliver them to your doorstep in eco-friendly packaging.", icon: Truck },
  { title: "Cook and Enjoy", description: "Follow our easy step-by-step instructions to cook restaurant-quality meals in your own kitchen. Impress yourself and your loved ones!", icon: CookingPot }
];

const faqs = [
  { q: "How often will I receive deliveries?", a: "You can choose weekly, bi-weekly, or monthly deliveries based on your preferences." },
  { q: "Can I skip a week or pause my subscription?", a: "Absolutely! You have full control over your subscription and can skip or pause at any time." },
  { q: "Are there options for dietary restrictions?", a: "Yes, we offer vegetarian, vegan, gluten-free, and other dietary options. You can set your preferences in your account." },
  { q: "How long do the ingredients stay fresh?", a: "Our ingredients are carefully packaged to stay fresh for up to 5 days after delivery." }
];

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">How FreshPlate Works</h1>
      
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