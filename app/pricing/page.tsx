import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

const pricingPlans = [
  { name: "Starter", meals: 2, price: 39.99, features: ["2 meals per week", "Curated restaurant dishes", "Premium ingredients", "Step-by-step recipes"] },
  { name: "Popular", meals: 3, price: 59.99, features: ["3 meals per week", "Curated restaurant dishes", "Premium ingredients", "Step-by-step recipes", "Free side dish"] },
  { name: "Foodie", meals: 4, price: 79.99, features: ["4 meals per week", "Curated restaurant dishes", "Premium ingredients", "Step-by-step recipes", "Free side dish", "Exclusive chef tips"] }
];

const faqs = [
  { q: "Can I change my plan?", a: "Yes, you can upgrade, downgrade, or cancel your plan at any time." },
  { q: "Is there a commitment?", a: "No long-term commitment required. You can cancel your subscription anytime." },
  { q: "Are there additional fees?", a: "No hidden fees. The price you see includes delivery and all ingredients for your meals." },
  { q: "Can I gift a subscription?", a: "Absolutely! FreshPlate makes a great gift. Check out our gift options for more details." }
];

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">FreshPlate Pricing</h1>
      
      <p className="text-lg mb-8 text-center max-w-2xl mx-auto">Choose the plan that fits your lifestyle. All plans include free delivery and serve 2 people per meal.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-700">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-4xl font-bold mb-4">${plan.price}<span className="text-sm font-normal">/week</span></p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Link href="/signup">Choose {plan.name}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}