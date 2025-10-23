---
title: "Creating Mock Travel Tools"
order: 2
description: "Build fake Irish travel APIs for train booking, hotels, and activities"
estimatedTime: "15 minutes"
---

# Creating Mock Travel Tools

We'll create realistic mock functions that simulate Irish travel booking APIs. These are fake, but they'll teach you how real multi-step tools work!

## Why Mock Tools?

For learning multi-step reasoning, we don't need real APIs. Mock tools let us:
- ✅ Focus on the agent logic, not API complexity
- ✅ Get instant, predictable responses
- ✅ Avoid API keys and rate limits
- ✅ Test safely without booking real trains!

Later, you can swap these for real APIs using the same patterns.

## Step 1: Update Types

First, let's add types for our new tools. Update your `types.ts`:

```typescript
// types.ts (add these to your existing types)

// Train booking types
export interface TrainRoute {
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  available: boolean;
}

export interface TrainBooking {
  bookingId: string;
  route: TrainRoute;
  passengerName: string;
  status: 'confirmed' | 'pending' | 'failed';
}

// Hotel types
export interface Hotel {
  id: string;
  name: string;
  city: string;
  pricePerNight: number;
  rating: number;
  available: boolean;
}

export interface HotelBooking {
  bookingId: string;
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'failed';
}

// Activity types
export interface Activity {
  name: string;
  city: string;
  description: string;
  duration: string;
  price: number;
}
```

## Step 2: Create Mock Data

Create a new file `mockData.ts` with Irish travel data:

```typescript
// mockData.ts
import type { TrainRoute, Hotel, Activity } from './types';

/**
 * Mock Irish Rail routes
 */
export const mockTrainRoutes: TrainRoute[] = [
  {
    from: 'Dublin',
    to: 'Galway',
    departure: '09:00',
    arrival: '11:30',
    duration: '2h 30m',
    price: 25,
    available: true
  },
  {
    from: 'Dublin',
    to: 'Galway',
    departure: '14:00',
    arrival: '16:30',
    duration: '2h 30m',
    price: 25,
    available: true
  },
  {
    from: 'Dublin',
    to: 'Cork',
    departure: '08:30',
    arrival: '11:00',
    duration: '2h 30m',
    price: 28,
    available: true
  },
  {
    from: 'Dublin',
    to: 'Cork',
    departure: '15:00',
    arrival: '17:30',
    duration: '2h 30m',
    price: 28,
    available: true
  },
  {
    from: 'Dublin',
    to: 'Belfast',
    departure: '09:30',
    arrival: '11:45',
    duration: '2h 15m',
    price: 22,
    available: true
  },
  {
    from: 'Galway',
    to: 'Dublin',
    departure: '16:00',
    arrival: '18:30',
    duration: '2h 30m',
    price: 25,
    available: true
  },
  {
    from: 'Cork',
    to: 'Dublin',
    departure: '17:00',
    arrival: '19:30',
    duration: '2h 30m',
    price: 28,
    available: true
  }
];

/**
 * Mock Irish hotels
 */
export const mockHotels: Hotel[] = [
  {
    id: 'h1',
    name: 'Clayton Hotel Galway',
    city: 'Galway',
    pricePerNight: 120,
    rating: 4.5,
    available: true
  },
  {
    id: 'h2',
    name: 'The g Hotel',
    city: 'Galway',
    pricePerNight: 180,
    rating: 4.8,
    available: true
  },
  {
    id: 'h3',
    name: 'Park House Hotel',
    city: 'Galway',
    pricePerNight: 95,
    rating: 4.2,
    available: true
  },
  {
    id: 'h4',
    name: 'Clayton Hotel Cork',
    city: 'Cork',
    pricePerNight: 110,
    rating: 4.4,
    available: true
  },
  {
    id: 'h5',
    name: 'The River Lee',
    city: 'Cork',
    pricePerNight: 150,
    rating: 4.7,
    available: true
  },
  {
    id: 'h6',
    name: 'Jurys Inn Belfast',
    city: 'Belfast',
    pricePerNight: 100,
    rating: 4.3,
    available: true
  }
];

/**
 * Mock activities by city
 */
export const mockActivities: Activity[] = [
  {
    name: 'Cliffs of Moher Tour',
    city: 'Galway',
    description: 'Visit the stunning Cliffs of Moher, one of Ireland\'s most visited attractions',
    duration: '6 hours',
    price: 55
  },
  {
    name: 'Galway Food Tour',
    city: 'Galway',
    description: 'Taste the best of Galway\'s food scene with a local guide',
    duration: '3 hours',
    price: 45
  },
  {
    name: 'Aran Islands Ferry',
    city: 'Galway',
    description: 'Day trip to the beautiful Aran Islands',
    duration: '8 hours',
    price: 35
  },
  {
    name: 'Blarney Castle Visit',
    city: 'Cork',
    description: 'Kiss the famous Blarney Stone and explore the castle grounds',
    duration: '4 hours',
    price: 18
  },
  {
    name: 'Cork City Food Tour',
    city: 'Cork',
    description: 'Discover Cork\'s culinary delights at the English Market and beyond',
    duration: '3 hours',
    price: 40
  },
  {
    name: 'Titanic Belfast',
    city: 'Belfast',
    description: 'Explore the world\'s largest Titanic visitor experience',
    duration: '3 hours',
    price: 25
  },
  {
    name: 'Giant\'s Causeway Tour',
    city: 'Belfast',
    description: 'Visit the UNESCO World Heritage Site of Giant\'s Causeway',
    duration: '7 hours',
    price: 50
  }
];
```

## Step 3: Add Travel Tools

Now add the mock tool functions to your `tools.ts`:

```typescript
// tools.ts (add to your existing file)
import type { 
  CalculatorOperation, 
  ToolResult,
  TrainRoute,
  TrainBooking,
  Hotel,
  HotelBooking,
  Activity
} from './types';
import { mockTrainRoutes, mockHotels, mockActivities } from './mockData';

// ... your existing calculator and getDadJoke functions ...

/**
 * Search for train routes between two cities
 */
export function searchTrainRoutes(from: string, to: string): ToolResult {
  const routes = mockTrainRoutes.filter(
    route => 
      route.from.toLowerCase() === from.toLowerCase() && 
      route.to.toLowerCase() === to.toLowerCase() &&
      route.available
  );
  
  if (routes.length === 0) {
    return `No train routes found from ${from} to ${to}`;
  }
  
  return JSON.stringify(routes, null, 2);
}

/**
 * Book a train ticket
 */
export function bookTrain(
  from: string, 
  to: string, 
  departure: string,
  passengerName: string = "Guest"
): ToolResult {
  const route = mockTrainRoutes.find(
    r => 
      r.from.toLowerCase() === from.toLowerCase() && 
      r.to.toLowerCase() === to.toLowerCase() &&
      r.departure === departure &&
      r.available
  );
  
  if (!route) {
    return `Error: No available train from ${from} to ${to} at ${departure}`;
  }
  
  const booking: TrainBooking = {
    bookingId: `TRAIN-${Date.now()}`,
    route,
    passengerName,
    status: 'confirmed'
  };
  
  return JSON.stringify(booking, null, 2);
}

/**
 * Search for hotels in a city
 */
export function searchHotels(city: string, maxPrice?: number): ToolResult {
  let hotels = mockHotels.filter(
    h => h.city.toLowerCase() === city.toLowerCase() && h.available
  );
  
  if (maxPrice) {
    hotels = hotels.filter(h => h.pricePerNight <= maxPrice);
  }
  
  if (hotels.length === 0) {
    return `No hotels found in ${city}${maxPrice ? ` under €${maxPrice}` : ''}`;
  }
  
  return JSON.stringify(hotels, null, 2);
}

/**
 * Book a hotel
 */
export function bookHotel(
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guestName: string = "Guest"
): ToolResult {
  const hotel = mockHotels.find(h => h.id === hotelId && h.available);
  
  if (!hotel) {
    return `Error: Hotel ${hotelId} not found or not available`;
  }
  
  // Simple night calculation (in real app, use proper date library)
  const nights = 2; // Mock: assume 2 nights
  
  const booking: HotelBooking = {
    bookingId: `HOTEL-${Date.now()}`,
    hotel,
    checkIn,
    checkOut,
    nights,
    totalPrice: hotel.pricePerNight * nights,
    status: 'confirmed'
  };
  
  return JSON.stringify(booking, null, 2);
}

/**
 * Get activities available in a city
 */
export function getActivities(city: string): ToolResult {
  const activities = mockActivities.filter(
    a => a.city.toLowerCase() === city.toLowerCase()
  );
  
  if (activities.length === 0) {
    return `No activities found in ${city}`;
  }
  
  return JSON.stringify(activities, null, 2);
}
```

## What We Built

We now have **5 new travel tools**:

1. **`searchTrainRoutes`** - Find available trains between cities
2. **`bookTrain`** - Book a specific train
3. **`searchHotels`** - Find hotels in a city
4. **`bookHotel`** - Book a specific hotel
5. **`getActivities`** - Get things to do in a city

These tools are designed to **work together**:
- Search trains → Pick one → Book it
- Search hotels → Pick one → Book it
- Get activities → Plan itinerary

## Testing the Tools

You can test these manually if you want:

```typescript
// Quick test
console.log(searchTrainRoutes('Dublin', 'Galway'));
console.log(bookTrain('Dublin', 'Galway', '09:00', 'John Doe'));
console.log(searchHotels('Galway', 150));
```

Next, we'll define these tools for OpenAI so the agent can use them autonomously!
