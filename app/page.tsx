'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FadeInSection } from "@/components/FadeInSection";

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
          <Button className="bg-green-600 hover:bg-green-700 text-white transition-colors text-sm px-3" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </motion.header>

      <main className="flex-grow pt-20"> {/* Increased padding-top */}
        <FadeInSection>
          <section className="max-w-md mx-auto text-center px-4 py-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-4xl font-bold mb-4 text-green-800"
            >
              Your Favorite Meals, Personalized and Delivered
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg mb-6 text-gray-600"
            >
              Custom meal plans inspired by your favorite restaurants, tailored to your health goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full transition-all transform hover:scale-105 w-full sm:w-auto" asChild>
                <Link href="/signup">Start Your Personalized Plan</Link>
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
          <section className="py-8">
            <div className="max-w-xs mx-auto text-center px-4">
              <h2 className="text-2xl font-bold mb-6 text-green-800">Ready to transform your meals?</h2>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-full transition-all transform hover:scale-105 w-full" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
              <div className="mt-4 inline-block">
                <Image
                  src="/health/health.svg"
                  alt="Works with Apple Health"
                  width={120}
                  height={24}
                  className="mx-auto"
                />
              </div>
            </div>
          </section>
        </FadeInSection>
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