import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Leaf, Recycle, Users, ChefHat, Award, Heart, Sparkles } from "lucide-react";

const features = [
  { title: "Partnerships with top local restaurants", description: "We collaborate with the best restaurants in your area to bring you authentic flavors.", icon: Utensils },
  { title: "Premium, locally-sourced ingredients", description: "We prioritize fresh, high-quality ingredients from local suppliers.", icon: Leaf },
  { title: "Eco-friendly packaging", description: "Our commitment to sustainability extends to our packaging choices.", icon: Recycle },
  { title: "Flexible subscription options", description: "Choose the plan that fits your lifestyle and dietary needs.", icon: Users },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-green-800 text-center">About FreshPlate</h1>
      
      <div className="mb-8 flex justify-center">
        <ChefHat className="w-32 h-32 text-green-600" />
      </div>
      
      <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
        FreshPlate is a revolutionary meal kit service that brings restaurant-quality dishes to your home kitchen. 
        Founded in 2020, we've been on a mission to transform the way people experience food at home.
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            FreshPlate was born out of a simple idea: What if we could bring the excitement and quality of restaurant dining into people's homes? 
            Our founders, passionate food lovers and tech enthusiasts, set out to create a service that would make this possible.
          </p>
          <div className="flex justify-center">
            <Award className="w-24 h-24 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            At FreshPlate, we believe that everyone deserves to enjoy restaurant-quality meals in the comfort of their own home. 
            Our mission is to empower home cooks with the ingredients, recipes, and confidence to create extraordinary dining experiences.
          </p>
          <div className="flex justify-center">
            <Heart className="w-24 h-24 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">What Sets Us Apart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-700 flex items-center">
                <feature.icon className="w-6 h-6 mr-2" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <Link href="/waitlist">Join FreshPlate Waitlist</Link>
        </Button>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Sparkles className="w-16 h-16 text-green-600" />
      </div>
    </div>
  );
}