'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
  { name: "Starter", meals: 2, price: 39.99, betaPrice: 0, features: ["2 meals per week", "Curated restaurant dishes", "Premium ingredients", "Step-by-step recipes"] },
  { name: "Popular", meals: 3, price: 59.99, betaPrice: 0, features: ["3 meals per week", "Curated restaurant dishes", "Premium ingredients", "Step-by-step recipes", "Free side dish"] },
  { name: "Foodie", meals: 4, price: 79.99, betaPrice: 0, features: ["4 meals per week", "Curated restaurant dishes", "Premium ingredients", "Step-by-step recipes", "Free side dish", "Exclusive chef tips"] }
];

const faqs = [
  { q: "Can I change my plan?", a: "Yes, you can upgrade, downgrade, or cancel your plan at any time." },
  { q: "Is there a commitment?", a: "No long-term commitment required. You can cancel your subscription anytime." },
  { q: "Are there additional fees?", a: "No hidden fees. The price you see includes delivery and all ingredients for your meals." },
  { q: "Can I gift a subscription?", a: "Absolutely! FreshPlate makes a great gift. Check out our gift options for more details." }
];

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-3 flex justify-between items-center bg-white shadow-sm fixed w-full z-10">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="FreshPlate Logo"
            width={50}
            height={50}
            priority
          />
        </Link>
        <Button variant="ghost" asChild className="flex items-center text-green-800 hover:text-green-600">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </header>

      <main className="flex-grow pt-20 container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">FreshPlate Pricing</h1>
        
        <p className="text-lg mb-8 text-center max-w-2xl mx-auto">Choose the plan that fits your lifestyle. All plans include free delivery and serve 2 people per meal.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-green-700">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4">
                  <span className="line-through text-gray-400">${plan.price}</span>
                  <span className="text-green-600 ml-2">${plan.betaPrice}</span>
                  <span className="text-sm font-normal">/week</span>
                </p>
                <p className="text-sm text-green-600 mb-4">Free during beta!</p>
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
                  <Link href="/waitlist">Join Beta Waitlist</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-green-50 p-6 rounded-lg mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-700">Special Beta Offer</h2>
          <p className="mb-4">Get lifetime access to Apple Health integration for just $5!</p>
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/health/healthicon.png"
              alt="Apple Health Icon"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-lg font-semibold">Import health data from your iPhone</span>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Get Lifetime Access for $5
          </Button>
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
      </main>

      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-xs mx-auto px-4 flex flex-col items-center">
          <p className="mb-4 text-sm text-center">© 2023 FreshPlate. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-sm hover:text-green-200 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm hover:text-green-200 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}