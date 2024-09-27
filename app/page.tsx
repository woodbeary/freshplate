import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 to-white">
      <header className="p-4 flex justify-between items-center bg-white shadow-sm">
        <Link href="/">
          <Image
            src="/freshplate-logo.png"
            alt="FreshPlate Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/about" className="text-green-800 hover:text-green-600">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/how-it-works" className="text-green-800 hover:text-green-600">How It Works</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pricing" className="text-green-800 hover:text-green-600">Pricing</Link>
          </Button>
          <Button variant="outline" asChild className="text-green-800 border-green-800 hover:bg-green-50">
            <Link href="/login">Log In</Link>
          </Button>
          <Button className="bg-green-700 hover:bg-green-800 text-white" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
        <Button variant="ghost" className="md:hidden text-green-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </Button>
      </header>

      <main className="flex-grow px-4 py-8 md:py-16">
        <section className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900">
                Restaurant-Quality Meals,<br className="hidden md:inline" /> Crafted in Your Kitchen
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-700">
                Experience the joy of cooking your favorite restaurant dishes at home. FreshPlate brings you chef-curated recipes and premium ingredients, delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Input placeholder="Enter your email" className="max-w-xs" />
                <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white">
                  Get Started
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Join 50,000+ food enthusiasts already cooking with FreshPlate
              </p>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/hero-meal.jpg"
                alt="Delicious meal prepared with FreshPlate"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-green-800">How FreshPlate Brings Restaurants to Your Kitchen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Discover Local Favorites", description: "Browse and select dishes from top-rated restaurants in your area", icon: "/icon-discover.svg" },
                { title: "AI-Powered Recipe Creation", description: "Our advanced AI crafts restaurant-inspired recipes tailored to your preferences", icon: "/icon-ai.svg" },
                { title: "Premium Ingredients Delivered", description: "Receive pre-portioned, locally sourced, restaurant-quality ingredients", icon: "/icon-ingredients.svg" },
                { title: "Cook Like a Pro", description: "Follow our easy-to-use, step-by-step instructions to create gourmet meals at home", icon: "/icon-cook.svg" }
              ].map((step, index) => (
                <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
                  <Image src={step.icon} alt={step.title} width={64} height={64} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-green-800 text-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah L.", quote: "FreshPlate has transformed my weeknight dinners. I feel like a gourmet chef!", rating: 5, image: "/testimonial-sarah.jpg" },
                { name: "Michael R.", quote: "The quality of ingredients is outstanding. It's like having a farmers market delivered to my door.", rating: 5, image: "/testimonial-michael.jpg" },
                { name: "Emily T.", quote: "I've discovered so many new favorite dishes. FreshPlate has expanded my culinary horizons!", rating: 5, image: "/testimonial-emily.jpg" }
              ].map((testimonial, index) => (
                <div key={index} className="bg-green-700 p-6 rounded-lg">
                  <Image src={testimonial.image} alt={testimonial.name} width={80} height={80} className="rounded-full mx-auto mb-4" />
                  <p className="mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-green-800">Ready to Start Your Culinary Adventure?</h2>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link href="/onboarding">Begin Your Journey</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FreshPlate</h3>
            <p>Bringing restaurant quality meals to your home kitchen.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>Email: support@freshplate.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Culinary St, Foodville, CA 90210</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </Link>
              <Link href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          © 2023 FreshPlate. All rights reserved. | <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
