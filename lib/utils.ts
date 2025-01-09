import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface LocationInfo {
  city: string;
  state: string;
  description: string;
}

// This would ideally be backed by a proper geocoding service
// For now, we'll use a simple mapping for demonstration
const ZIP_LOCATION_MAP: Record<string, LocationInfo> = {
  "92620": {
    city: "Orange County",
    state: "CA",
    description: "a vibrant coastal region known for its Mediterranean climate, fresh produce, and diverse culinary scene"
  },
  "94105": {
    city: "San Francisco",
    state: "CA",
    description: "a culinary hub known for its fresh seafood, sourdough traditions, and farm-to-table movement"
  },
  // Add more mappings as needed
};

export function getLocationInfo(zipCode: string): LocationInfo {
  return ZIP_LOCATION_MAP[zipCode] || {
    city: "your area",
    state: "",
    description: "with its unique local ingredients and culinary traditions"
  };
}
