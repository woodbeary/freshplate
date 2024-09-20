"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function HealthSync() {
  const [syncMethod, setSyncMethod] = useState("manual");

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Sync Your Health Data</h1>
      
      <p className="mb-6">
        Syncing your health data helps us provide personalized meal recommendations 
        that align with your nutritional needs and fitness goals.
      </p>

      <RadioGroup value={syncMethod} onValueChange={setSyncMethod} className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual">Enter data manually</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="apple" id="apple" />
          <Label htmlFor="apple">Sync with Apple Health</Label>
        </div>
      </RadioGroup>

      {syncMethod === "manual" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input type="number" id="age" placeholder="Enter your age" />
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input type="number" id="height" placeholder="Enter your height in cm" />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input type="number" id="weight" placeholder="Enter your weight in kg" />
          </div>
          <div>
            <Label htmlFor="activity">Activity Level</Label>
            <select id="activity" className="w-full p-2 border rounded">
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="light">Lightly active (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
              <option value="active">Active (hard exercise 6-7 days/week)</option>
              <option value="very-active">Very active (very hard exercise & physical job)</option>
            </select>
          </div>
        </div>
      )}

      {syncMethod === "apple" && (
        <div className="text-center">
          <Image 
            src="/apple-health-icon.png" 
            alt="Apple Health" 
            width={100} 
            height={100} 
            className="mx-auto mb-4"
          />
          <p className="mb-4">Click the button below to sync with Apple Health</p>
          <Button>Connect to Apple Health</Button>
        </div>
      )}

      <div className="mt-8">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          Save and Continue
        </Button>
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        By syncing your health data, you agree to our <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>.
      </p>
    </div>
  );
}