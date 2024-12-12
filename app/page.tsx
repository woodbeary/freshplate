'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FadeInSection } from "@/components/FadeInSection";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-3 flex justify-between items-center bg-white shadow-sm fixed w-full z-10"
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="FreshPlate Logo"
            width={50}
            height={50}
            priority
          />
        </Link>
        <nav className="flex space-x-2">
          <Button variant="ghost" asChild className="text-green-800 hover:text-green-600 transition-colors text-sm px-3">
            <Link href="/pricing">Pricing</Link>
          </Button>
          <Button variant="ghost" asChild className="text-green-800 hover:text-green-600 transition-colors text-sm px-3">
            <Link href="/recipes">Try Beta</Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white transition-colors text-sm px-3" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </motion.header>

      <main className="flex-grow pt-20">
        <FadeInSection>
          <section className="max-w-md mx-auto text-center px-4 py-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold mb-4 text-green-800"
            >
              AI-Powered Recipe Generation with Instant Instacart Shopping
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg mb-6 text-gray-600"
            >
              Generate personalized recipes with our AI and get instant Instacart shopping lists. Try our beta version today!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full transition-all transform hover:scale-105" 
                asChild
              >
                <Link href="/recipes">Try Beta Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-green-700 border-green-600 hover:bg-green-50 text-base px-6 py-3 rounded-full transition-all transform hover:scale-105" 
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </motion.div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-8 bg-green-50">
            <div className="max-w-xs mx-auto px-4">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "Discover", icon: "🍽️" },
                  { title: "Personalize", icon: "👨‍🍳" },
                  { title: "Deliver", icon: "🚚" },
                  { title: "Enjoy", icon: "😋" }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <h3 className="text-sm font-semibold text-green-800">{step.title}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6 text-green-800 text-center">Why What You Eat Matters—And How Fresh Plate Makes It Easier.</h2>
              <p className="text-lg mb-6 text-center text-gray-600">
                At Fresh Plate, we believe eating well shouldn't mean sacrificing the foods you love or spending hours meal planning. We turn your favorite restaurant-inspired meals into personalized plans that fit your health goals, with groceries delivered right to your door.
              </p>
              <p className="text-lg mb-6 text-center text-gray-600">
                Food profoundly impacts our daily lives—how we feel, perform, and live. Fresh Plate helps you eat delicious, healthy meals effortlessly, so you can focus on enjoying your life.
              </p>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-12 bg-green-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-green-800">How Fresh Plate Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Tell Us About You", description: "Share your food preferences and health goals with our AI to generate personalized recipes.", icon: "🍔" },
                  { title: "Get Your Custom Recipes", description: "Receive AI-generated recipes inspired by your favorite dishes, with automatic Instacart shopping lists.", icon: "🎯" },
                  { title: "Shop with One Click", description: "Beta: Generate Instacart shopping lists instantly. Coming Soon: Direct ordering and delivery tracking.", icon: "📦" }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                    className="text-center bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-green-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-green-800">What People Are Saying</h2>
              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <p className="text-lg mb-4 text-gray-700">"Fresh Plate made healthy eating effortless. I love that I can enjoy my favorite foods and still meet my health goals!"</p>
                  <p className="text-sm text-green-700 font-semibold">- Sarah Johnson, San Francisco</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-12 bg-green-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Why Choose Fresh Plate?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "AI-Powered Personalization", description: "Our AI learns your tastes to generate perfect recipes just for you.", icon: "🎯" },
                  { title: "Instant Shopping Lists", description: "Generate Instacart shopping lists with one click. Direct ordering coming soon!", icon: "🛒" },
                  { title: "Health-Focused Recipes", description: "AI-generated recipes that match your health goals and dietary needs.", icon: "💪" }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                    className="text-center bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-green-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-green-800">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {[
                  { q: "How often will I receive deliveries?", a: "You can choose weekly, bi-weekly, or monthly deliveries based on your preferences." },
                  { q: "Can I skip a week or pause my subscription?", a: "Absolutely! You have full control over your subscription and can skip or pause at any time." },
                  { q: "Are there options for dietary restrictions?", a: "Yes, we offer vegetarian, vegan, gluten-free, and other dietary options. You can set your preferences in your account." },
                ].map((faq, index) => (
                  <div key={index} className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2 text-green-800">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild>
                  <Link href="/faq">View All FAQs</Link>
                </Button>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section className="py-12 bg-green-50">
            <div className="max-w-md mx-auto text-center px-4">
              <h2 className="text-3xl font-bold mb-6 text-green-800">Ready to Transform Your Cooking Experience?</h2>
              <p className="text-lg mb-6 text-gray-600">Join our beta program today and be the first to experience AI-powered recipe generation with instant Instacart shopping lists.</p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full transition-all transform hover:scale-105 w-full" asChild>
                <Link href="/pricing">Start Your Free Trial</Link>
              </Button>
              <p className="text-sm mt-4 text-gray-500">Limited time beta pricing available now!</p>
            </div>
          </section>
        </FadeInSection>
      </main>

      <footer className="bg-green-800 text-white py-6">
        <div className="max-w-xs mx-auto px-4 flex flex-col items-center">
          <div className="mb-4">
            <Image
              src="/health/health.svg"
              alt="Works with Apple Health"
              width={120}
              height={24}
              className="mx-auto"
            />
          </div>
          <p className="mb-4 text-sm text-center">© 2024 FreshPlate. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-sm hover:text-green-200 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm hover:text-green-200 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}