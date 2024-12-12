'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import InstacartLogo from '@/components/InstacartLogo';

const pricingPlans = [
  { 
    name: "Basic", 
    price: 9.99, 
    betaPrice: 4.99, 
    features: [
      "AI-generated recipes",
      "Instant Instacart shopping lists",
      "Basic meal customization",
      "Email support"
    ] 
  },
  { 
    name: "Pro", 
    price: 19.99, 
    betaPrice: 9.99, 
    features: [
      "Everything in Basic",
      "Advanced recipe customization",
      "Nutritional tracking",
      "Priority support",
      "Early access to new features"
    ] 
  },
  { 
    name: "Enterprise", 
    price: 49.99, 
    betaPrice: 24.99, 
    features: [
      "Everything in Pro",
      "Custom API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees"
    ] 
  }
];

const faqs = [
  { q: "What's included in the beta?", a: "Beta subscribers get access to our AI recipe generation and instant Instacart shopping lists at a special discounted price. You'll also be first to try new features as we roll them out." },
  { q: "When will direct ordering be available?", a: "We're working on integrating direct ordering and delivery tracking. Beta subscribers will get early access when these features launch." },
  { q: "Can I cancel my subscription?", a: "Yes, you can cancel your subscription at any time. No long-term commitment required." },
  { q: "Will prices increase after beta?", a: "Beta subscribers will keep their special pricing for life. Regular pricing will apply to new subscribers after the beta period." }
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-800 text-center">Beta Launch Special Pricing</h1>
        
        <div className="mb-12 w-full max-w-[400px] mx-auto">
          <p className="text-sm text-gray-600 text-center mb-4">powered by</p>
          <InstacartLogo />
        </div>
        
        <p className="text-lg mb-8 text-center max-w-2xl mx-auto">Join our beta program today and lock in special pricing for life. Get instant access to AI-powered recipe generation and Instacart shopping lists.</p>
        
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
          <h2 className="text-2xl font-bold mb-4 text-green-700">Coming Soon</h2>
          <p className="mb-4">Direct ordering and delivery tracking through our platform</p>
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/health/healthicon.png"
              alt="Apple Health Icon"
              width={48}
              height={48}
              className="mr-2"
            />
            <span className="text-lg font-semibold">Plus Apple Health integration</span>
          </div>
          <p className="text-sm text-gray-600">Beta subscribers will get early access to all new features!</p>
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