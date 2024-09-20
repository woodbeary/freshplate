"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const totalSteps = 8; // Increased total steps

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <Progress value={(step / totalSteps) * 100} className="mb-8" />
      
      {step === 1 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Where are you located?</h2>
          <Input placeholder="Enter your zip code" className="mb-4" />
          <p className="text-sm text-gray-500 mb-4">We'll use this to find restaurants and delivery options near you.</p>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Discover Local Restaurants</h2>
          <Input placeholder="Search for restaurants or cuisines" className="mb-4" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            {['Italian Trattoria', 'Sushi Spot', 'Taco Haven', 'Burger Joint'].map((restaurant) => (
              <Card key={restaurant} className="cursor-pointer hover:bg-green-50">
                <CardContent className="flex items-center p-4">
                  <Checkbox id={restaurant} className="mr-2" />
                  <Label htmlFor={restaurant}>{restaurant}</Label>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Select Your Favorite Dishes</h2>
          <p className="mb-4">Choose dishes from Italian Trattoria:</p>
          <div className="space-y-4">
            {['Spaghetti Carbonara', 'Margherita Pizza', 'Chicken Parmesan', 'Tiramisu'].map((dish) => (
              <div key={dish} className="flex items-center space-x-2">
                <Checkbox id={dish} />
                <Label htmlFor={dish}>{dish}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Personalize Your Meal Preferences</h2>
          <p className="mb-4">Based on your selections, we think you might like:</p>
          <ul className="list-disc list-inside mb-6">
            <li>Italian cuisine with a focus on pasta dishes</li>
            <li>Comfort food with rich flavors</li>
            <li>Both meat and vegetarian options</li>
          </ul>
          <p>Does this sound right?</p>
          <div className="flex space-x-4 mt-4">
            <Button>Yes, that's me!</Button>
            <Button variant="outline">Adjust Preferences</Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Choose Your Meal Plan</h2>
          <RadioGroup defaultValue="option-two">
            <div className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">2 meals per week (2 servings each)</Label>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">3 meals per week (2 servings each)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-three" id="option-three" />
              <Label htmlFor="option-three">4 meals per week (2 servings each)</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Set Your Delivery Schedule</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery-day">Preferred Delivery Day</Label>
              <Select>
                <SelectTrigger id="delivery-day">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="delivery-time">Preferred Delivery Time</Label>
              <Select>
                <SelectTrigger id="delivery-time">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                  <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {step === 7 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Personalize Your Nutrition</h2>
          <p className="mb-4">Would you like to sync your health data for personalized meal recommendations?</p>
          <div className="flex space-x-4 mt-4">
            <Button onClick={() => setStep(8)}>Yes, personalize my meals</Button>
            <Button variant="outline" onClick={() => setStep(8)}>Skip for now</Button>
          </div>
        </div>
      )}

      {step === 8 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Complete Your Subscription</h2>
          <p className="mb-4">Your weekly plan: 3 meals for 2 people</p>
          <p className="text-2xl font-bold mb-6">Total: $59.99/week</p>
          <Input placeholder="Email" className="mb-4" />
          <Input type="password" placeholder="Password" className="mb-4" />
          <Button className="w-full">Start My Subscription</Button>
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button onClick={prevStep} variant="outline">
            Back
          </Button>
        )}
        <Button onClick={nextStep} className="ml-auto">
          {step === totalSteps ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}