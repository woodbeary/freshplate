import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does FreshPlate work?",
    a: "FreshPlate brings restaurant-quality meals to your home. You choose your favorite dishes, we create custom recipes, deliver fresh ingredients, and you cook amazing meals at home."
  },
  {
    q: "How often will I receive deliveries?",
    a: "You can choose weekly, bi-weekly, or monthly deliveries based on your preferences."
  },
  {
    q: "Can I skip a week or pause my subscription?",
    a: "Absolutely! You have full control over your subscription and can skip or pause at any time."
  },
  {
    q: "Are there options for dietary restrictions?",
    a: "Yes, we offer vegetarian, vegan, gluten-free, and other dietary options. You can set your preferences in your account."
  },
  {
    q: "How long do the ingredients stay fresh?",
    a: "Our ingredients are carefully packaged to stay fresh for up to 5 days after delivery."
  },
  {
    q: "Can I change my plan?",
    a: "Yes, you can upgrade, downgrade, or cancel your plan at any time."
  },
  {
    q: "Is there a commitment?",
    a: "No long-term commitment required. You can cancel your subscription anytime."
  },
  {
    q: "Are there additional fees?",
    a: "No hidden fees. The price you see includes delivery and all ingredients for your meals."
  },
  {
    q: "Can I gift a subscription?",
    a: "Absolutely! FreshPlate makes a great gift. Check out our gift options for more details."
  }
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="mb-12">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-semibold text-green-700">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-gray-700">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="text-center">
        <p className="text-lg mb-6">Still have questions? We're here to help!</p>
        
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}