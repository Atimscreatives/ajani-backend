# Listing API Documentation

## Overview

The Listing API allows vendors to create, manage, and display listings for hotels, restaurants, shortlets, services, and events. This API provides comprehensive functionality for listing management with automatic price calculations.

**Base URL:** `http://localhost:<PORT>/api/v1/listings`  
**Content-Type:** `application/json`  
**Authentication:** Required for create/update operations

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Listing Categories](#2-listing-categories)
3. [Create Listing](#3-create-listing)
4. [Get All Listings](#4-get-all-listings)
5. [Get Single Listing](#5-get-single-listing)
6. [Get Listings by Vendor](#6-get-listings-by-vendor)
7. [Update Listing](#7-update-listing)
8. [Delete Listing](#8-delete-listing)
9. [Filtering & Search](#9-filtering--search)
10. [Sorting & Pagination](#10-sorting--pagination)
11. [Price Calculation](#11-price-calculation)
12. [Frontend Integration Guide](#12-frontend-integration-guide)
13. [Error Handling](#13-error-handling)

---

## 1. Authentication

### Required Headers

```javascript
headers: {
  'Authorization': 'Bearer <your-jwt-token>',
  'Content-Type': 'application/json'
}
```

### Authentication Required For:

- Creating listings
- Updating listings
- Deleting listings
- Getting vendor-specific listings

### Public Endpoints:

- Get all listings
- Get single listing by ID
- Public listing search

---

## 2. Listing Categories

The API supports 5 main categories, each with specific required fields:

### Hotel

- **Required Fields:** `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.roomTypes`
- **Price Fields:** `basePrice`, `discountedRate` (auto-calculates `salesPrice`)
- **Special:** Multiple room types supported

### Restaurant

- **Required Fields:** `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.yearsOfOperation`, `details.cuisineType`
- **Price Fields:** `details.priceRangePerMeal`

### Shortlet

- **Required Fields:** `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.description`, `details.numberOfRooms`
- **Price Fields:** `details.pricePerNight`, `details.pricePerWeek`

### Services

- **Required Fields:** `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.serviceCategory`, `details.businessDescription`
- **Price Fields:** `details.pricingRange`

### Event

- **Required Fields:** `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.hallDescription`, `details.numberOfHalls`
- **Price Fields:** `details.priceRange`

---

## 3. Create Listing

### Endpoint

```bash
POST /api/v1/listings
```

### Authentication Required: Yes

### Request Body Structure

#### Hotel Example

```json
{
  "name": "Grand Plaza Hotel",
  "category": "hotel",
  "about": "Luxury hotel in the heart of the city",
  "whatWeDo": "We provide comfortable accommodation with top-notch facilities",
  "location": {
    "address": "123 Main Street",
    "area": "Central Business District",
    "geolocation": {
      "lat": 6.4572,
      "lng": 3.3823
    }
  },
  "contactInformation": {
    "phone": "+2348012345678",
    "whatsapp": "+2348012345678",
    "email": "info@grandplazahotel.com"
  },
  "images": ["https://example.com/hotel-main.jpg"],
  "details": {
    "roomTypes": [
      {
        "name": "Deluxe Suite",
        "bedType": "King Size",
        "roomType": "Suite",
        "view": "City View",
        "pricePerNight": 150000,
        "discountedRate": 10,
        "basePrice": 150000,
        // salesPrice will be automatically calculated as 135000
        "breakfastIncluded": true,
        "breakfastCost": 15000,
        "amenities": ["Free WiFi", "Air Conditioning", "Mini Bar"],
        "maxOccupancy": 2,
        "roomImages": ["https://example.com/suite1.jpg"],
        "status": "available"
      }
    ]
  }
}
```

#### Restaurant Example

```json
{
  "name": "Tasty Bites Restaurant",
  "category": "restaurant",
  "about": "Authentic Nigerian cuisine served in a cozy atmosphere",
  "whatWeDo": "Specializing in authentic Nigerian dishes",
  "location": {
    "address": "78 Food Court Avenue",
    "area": "Lekki Phase 1"
  },
  "contactInformation": {
    "phone": "+2348034567890",
    "whatsapp": "+2348034567890",
    "email": "orders@tastybites.ng"
  },
  "images": ["https://example.com/restaurant-exterior.jpg"],
  "details": {
    "yearsOfOperation": 5,
    "cuisineType": ["Nigerian", "West African"],
    "openingHours": "Mon-Sun: 10:00 AM - 10:00 PM",
    "acceptsReservations": true,
    "maxGuestsPerReservation": 20,
    "menuCategories": ["Main Course", "Appetizers"],
    "priceRangePerMeal": {
      "priceFrom": 1000,
      "priceTo": 5000
    },
    "specialMeals": ["Jollof Rice", "Pounded Yam"],
    "diningOptions": ["Dine-In", "Takeaway", "Delivery"],
    "parkingAvailable": true,
    "outdoorSeating": true,
    "deliveryService": true,
    "takeawayService": true
  }
}
```

### Important Notes for Hotel Listings

#### Price Calculation

- **DO NOT** provide `salesPrice` in the request
- Provide `basePrice` and `discountedRate` instead
- `salesPrice` will be automatically calculated using:
  ```
  salesPrice = basePrice - (basePrice × discountedRate ÷ 100)
  ```

#### Examples:

```javascript
// Example 1: 10% discount
{
  "basePrice": 100000,
  "discountedRate": 10,
  // salesPrice will be: 100000 - (100000 × 10 ÷ 100) = 90000
}

// Example 2: No discount
{
  "basePrice": 50000,
  "discountedRate": 0,
  // salesPrice will be: 50000 - (50000 × 0 ÷ 100) = 50000
}

// Example 3: 25% discount
{
  "basePrice": 200000,
  "discountedRate": 25,
  // salesPrice will be: 200000 - (200000 × 25 ÷ 100) = 150000
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Listing created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "vendorId": "507f1f77bcf86cd799439012",
    "category": "hotel",
    "name": "Grand Plaza Hotel",
    "about": "Luxury hotel in the heart of the city",
    "whatWeDo": "We provide comfortable accommodation with top-notch facilities",
    "location": {
      "address": "123 Main Street",
      "area": "Central Business District",
      "geolocation": {
        "lat": 6.4572,
        "lng": 3.3823
      }
    },
    "contactInformation": {
      "phone": "+2348012345678",
      "whatsapp": "+2348012345678",
      "email": "info@grandplazahotel.com"
    },
    "images": [
      {
        "url": "https://example.com/hotel-main.jpg",
        "public_id": "hotel-main"
      }
    ],
    "status": "pending",
    "details": {
      "roomTypes": [
        {
          "name": "Deluxe Suite",
          "bedType": "King Size",
          "roomType": "Suite",
          "view": "City View",
          "pricePerNight": 150000,
          "discountedRate": 10,
          "basePrice": 150000,
          "salesPrice": 135000, // Automatically calculated
          "breakfastIncluded": true,
          "breakfastCost": 15000,
          "amenities": ["Free WiFi", "Air Conditioning", "Mini Bar"],
          "maxOccupancy": 2,
          "roomImages": ["https://example.com/suite1.jpg"],
          "status": "available"
        }
      ]
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 4. Get All Listings

### Endpoint

```bash
GET /api/v1/listings
```

### Authentication Required: No

### Query Parameters

#### Filtering

```bash
# Filter by category
GET /api/v1/listings?category=hotel

# Filter by status
GET /api/v1/listings?status=approved

# Filter by price range
GET /api/v1/listings?price[gte]=10000&price[lte]=50000

# Filter by location
GET /api/v1/listings?location.area=Lagos%20Island

# Combine filters
GET /api/v1/listings?category=hotel&status=approved&price[gte]=20000
```

#### Sorting

```bash
# Sort by price (low to high)
GET /api/v1/listings?sort=price

# Sort by price (high to low)
GET /api/v1/listings?sort=-price

# Sort by newest first (default)
GET /api/v1/listings?sort=-createdAt

# Sort by multiple fields
GET /api/v1/listings?sort=category,price
```

#### Pagination

```bash
# Get first page with 10 results
GET /api/v1/listings?page=1&limit=10

# Get second page
GET /api/v1/listings?page=2&limit=10
```

#### Field Selection

```bash
# Get only specific fields
GET /api/v1/listings?fields=title,price,category,location.area

# Exclude fields (not needed, __v is excluded by default)
```

### Success Response

```json
{
  "status": "success",
  "message": "Listings retrieved successfully",
  "results": 10,
  "data": {
    "listings": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Grand Plaza Hotel",
        "category": "hotel",
        "about": "Luxury hotel in the heart of the city",
        "location": {
          "address": "123 Main Street",
          "area": "Central Business District"
        },
        "contactInformation": {
          "phone": "+2348012345678"
        },
        "images": [
          {
            "url": "https://example.com/hotel-main.jpg",
            "public_id": "hotel-main"
          }
        ],
        "status": "approved",
        "details": {
          "roomTypes": [
            {
              "name": "Deluxe Suite",
              "pricePerNight": 150000,
              "basePrice": 150000,
              "salesPrice": 135000, // Calculated field
              "discountedRate": 10,
              "amenities": ["Free WiFi", "Air Conditioning"]
            }
          ]
        },
        "vendorId": {
          "_id": "507f1f77bcf86cd799439012",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. Get Single Listing

### Endpoint

```bash
GET /api/v1/listings/:id
```

### Authentication Required: No

### Success Response

```json
{
  "message": "Listing retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Grand Plaza Hotel",
    "category": "hotel",
    "about": "Luxury hotel in the heart of the city",
    "whatWeDo": "We provide comfortable accommodation with top-notch facilities",
    "location": {
      "address": "123 Main Street",
      "area": "Central Business District",
      "geolocation": {
        "lat": 6.4572,
        "lng": 3.3823
      }
    },
    "contactInformation": {
      "phone": "+2348012345678",
      "whatsapp": "+2348012345678",
      "email": "info@grandplazahotel.com"
    },
    "images": [
      {
        "url": "https://example.com/hotel-main.jpg",
        "public_id": "hotel-main"
      }
    ],
    "status": "approved",
    "details": {
      "roomTypes": [
        {
          "name": "Deluxe Suite",
          "bedType": "King Size",
          "roomType": "Suite",
          "view": "City View",
          "pricePerNight": 150000,
          "discountedRate": 10,
          "basePrice": 150000,
          "salesPrice": 135000, // Automatically calculated
          "breakfastIncluded": true,
          "breakfastCost": 15000,
          "amenities": ["Free WiFi", "Air Conditioning", "Mini Bar"],
          "maxOccupancy": 2,
          "roomImages": ["https://example.com/suite1.jpg"],
          "status": "available"
        }
      ]
    },
    "vendorId": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 6. Get Listings by Vendor

### Endpoint

```bash
GET /api/v1/listings/vendor/:vendorId
```

### Authentication Required: No (but vendor can only see their own listings)

### Success Response

```json
{
  "message": "Listings retrieved successfully",
  "results": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Grand Plaza Hotel",
      "category": "hotel",
      "status": "approved",
      "details": {
        "roomTypes": [
          {
            "name": "Deluxe Suite",
            "salesPrice": 135000, // Calculated field
            "basePrice": 150000,
            "discountedRate": 10
          }
        ]
      }
    }
  ]
}
```

---

## 7. Update Listing

### Endpoint

```bash
PUT /api/v1/listings/:id
```

### Authentication Required: Yes

### Important Notes:

- Only the listing owner or admin can update listings
- Category cannot be changed
- Vendor cannot be changed (only by admin)
- Status can only be changed by admin
- For hotels: Provide `basePrice` and `discountedRate`, `salesPrice` will be recalculated

### Request Body Example

```json
{
  "name": "Updated Hotel Name",
  "about": "Updated description",
  "details": {
    "roomTypes": [
      {
        "name": "Deluxe Suite",
        "bedType": "King Size",
        "roomType": "Suite",
        "pricePerNight": 160000,
        "discountedRate": 15, // Updated discount
        "basePrice": 160000, // Updated base price
        // salesPrice will be automatically recalculated as 136000
        "breakfastIncluded": true,
        "breakfastCost": 15000,
        "amenities": ["Free WiFi", "Air Conditioning", "Mini Bar", "Gym"]
      }
    ]
  }
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Listing updated successfully",
  "data": {
    // Updated listing object with recalculated salesPrice
    "details": {
      "roomTypes": [
        {
          "name": "Deluxe Suite",
          "pricePerNight": 160000,
          "discountedRate": 15,
          "basePrice": 160000,
          "salesPrice": 136000, // Recalculated: 160000 - (160000 × 15 ÷ 100)
          "breakfastIncluded": true,
          "breakfastCost": 15000,
          "amenities": ["Free WiFi", "Air Conditioning", "Mini Bar", "Gym"]
        }
      ]
    }
  }
}
```

---

## 8. Delete Listing

### Endpoint

```bash
DELETE /api/v1/listings/:id
```

### Authentication Required: Yes

### Notes:

- Only the listing owner or admin can delete listings
- All associated images are automatically deleted from cloud storage
- Soft delete may be implemented (status change instead of actual deletion)

### Success Response

```json
{
  "status": "success",
  "message": "Listing deleted successfully"
}
```

---

## 9. Filtering & Search

### Basic Filtering

```javascript
// Filter by exact match
const filters = {
  category: "hotel",
  status: "approved",
};

// Build query string
const queryString = new URLSearchParams(filters).toString();
// Result: "category=hotel&status=approved"
```

### Advanced Price Filtering

```javascript
// Price range filtering
const filters = {
  "price[gte]": 10000,
  "price[lte]": 50000,
};

// For hotel listings, this filters by salesPrice (calculated field)
```

### Location Filtering

```javascript
// Filter by area
const filters = {
  "location.area": "Lagos Island",
};

// Filter by address
const filters = {
  "location.address": "Main Street",
};
```

### Complex Filtering Example

```javascript
// Get approved hotels in Lagos Island with price between 20k-100k
const filters = {
  category: "hotel",
  status: "approved",
  "location.area": "Lagos Island",
  "price[gte]": 20000,
  "price[lte]": 100000,
};
```

---

## 10. Sorting & Pagination

### Sorting Options

```javascript
const sortOptions = {
  newest: "-createdAt", // Newest first
  oldest: "createdAt", // Oldest first
  priceLowToHigh: "price", // Cheapest first
  priceHighToLow: "-price", // Most expensive first
  titleAtoZ: "name", // Title alphabetical
  titleZtoA: "-name", // Title reverse alphabetical
};
```

### Pagination Implementation

```javascript
// Calculate total pages
const totalPages = Math.ceil(totalResults / limit);

// Check if next/previous page exists
const hasNextPage = currentPage < totalPages;
const hasPrevPage = currentPage > 1;

// Build pagination URL
const nextPageUrl = `/api/v1/listings?page=${currentPage + 1}&limit=${limit}`;
const prevPageUrl = `/api/v1/listings?page=${currentPage - 1}&limit=${limit}`;
```

### Pagination Example

```javascript
// Get page 2 with 10 results per page
const response = await fetch("/api/v1/listings?page=2&limit=10");
const data = await response.json();

console.log("Current page:", 2);
console.log("Results per page:", 10);
console.log("Total results:", data.results);
console.log("Total pages:", Math.ceil(data.results / 10));
```

---

## 11. Price Calculation

### Automatic Calculation for Hotels

#### Formula

```
salesPrice = basePrice - (basePrice × discountedRate ÷ 100)
```

#### Examples

```javascript
// Example 1: 10% discount on ₦100,000
basePrice: 100000;
discountedRate: 10;
salesPrice: 90000; // 100000 - (100000 × 10 ÷ 100)

// Example 2: No discount
basePrice: 50000;
discountedRate: 0;
salesPrice: 50000; // 50000 - (50000 × 0 ÷ 100)

// Example 3: 25% discount on ₦200,000
basePrice: 200000;
discountedRate: 25;
salesPrice: 150000; // 200000 - (200000 × 25 ÷ 100)
```

### Frontend Price Display Logic

```javascript
function formatPrice(price) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}

function getDisplayPrice(listing) {
  if (listing.category === "hotel") {
    // For hotels, use calculated salesPrice
    return formatPrice(listing.details.roomTypes[0].salesPrice);
  } else {
    // For other categories, use their respective price fields
    switch (listing.category) {
      case "restaurant":
        return `${formatPrice(listing.details.priceRangePerMeal.priceFrom)} - ${formatPrice(listing.details.priceRangePerMeal.priceTo)}`;
      case "shortlet":
        return formatPrice(listing.details.pricePerNight);
      case "services":
        return `${formatPrice(listing.details.pricingRange.priceFrom)} - ${formatPrice(listing.details.pricingRange.priceTo)}`;
      case "event":
        return `${formatPrice(listing.details.priceRange.priceFrom)} - ${formatPrice(listing.details.priceRange.priceTo)}`;
      default:
        return "Price not available";
    }
  }
}
```

### Price Comparison Logic

```javascript
function getPriceComparison(listing) {
  if (listing.category === "hotel") {
    const roomType = listing.details.roomTypes[0];
    const discountAmount = roomType.basePrice - roomType.salesPrice;

    return {
      basePrice: formatPrice(roomType.basePrice),
      salesPrice: formatPrice(roomType.salesPrice),
      discountAmount: formatPrice(discountAmount),
      discountPercentage: roomType.discountedRate,
      savings: `Save ${formatPrice(discountAmount)} (${roomType.discountedRate}%)`,
    };
  }

  return null;
}
```

---

## 12. Frontend Integration Guide

### 1. API Service Setup

Create `src/services/listingService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1/listings";

// Helper to build query parameters
const buildQuery = params => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

// Get listings with filters
export const getListings = async (filters = {}) => {
  const queryString = buildQuery(filters);
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }

  return response.json();
};

// Get single listing
export const getListingById = async id => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch listing");
  }

  return response.json();
};

// Create listing
export const createListing = async (listingData, token) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create listing");
  }

  return response.json();
};

// Update listing
export const updateListing = async (id, listingData, token) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update listing");
  }

  return response.json();
};

// Delete listing
export const deleteListing = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete listing");
  }

  return response.json();
};

// Get vendor listings
export const getVendorListings = async (vendorId, token) => {
  const response = await fetch(`${API_BASE_URL}/vendor/${vendorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vendor listings");
  }

  return response.json();
};
```

### 2. Custom Hooks

Create `src/hooks/useListings.js`:

```javascript
import { useState, useEffect } from "react";
import { getListings } from "../services/listingService";

export const useListings = (filters = {}, dependencies = []) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getListings(filters);
        setListings(data.data.listings);
        setTotalResults(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, dependencies); // Re-fetch when dependencies change

  return { listings, loading, error, totalResults };
};

export const useListing = id => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getListingById(id);
        setListing(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, loading, error };
};
```

### 3. Hotel Listing Form Component

Create `src/components/HotelListingForm.js`:

```javascript
import React, { useState } from "react";
import { createListing } from "../services/listingService";

const HotelListingForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "hotel",
    about: "",
    whatWeDo: "",
    location: {
      address: "",
      area: "",
      geolocation: { lat: null, lng: null },
    },
    contactInformation: {
      phone: "",
      whatsapp: "",
      email: "",
    },
    images: [],
    details: {
      roomTypes: [
        {
          name: "",
          bedType: "",
          roomType: "",
          view: "",
          pricePerNight: "",
          discountedRate: 0,
          basePrice: "",
          breakfastIncluded: false,
          breakfastCost: 0,
          amenities: [],
          maxOccupancy: 1,
          roomImages: [],
          status: "available",
        },
      ],
    },
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoomTypeChange = (index, field, value) => {
    const updatedRoomTypes = [...formData.details.roomTypes];
    updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [field]: value,
    };

    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        roomTypes: updatedRoomTypes,
      },
    }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        roomTypes: [
          ...prev.details.roomTypes,
          {
            name: "",
            bedType: "",
            roomType: "",
            view: "",
            pricePerNight: "",
            discountedRate: 0,
            basePrice: "",
            breakfastIncluded: false,
            breakfastCost: 0,
            amenities: [],
            maxOccupancy: 1,
            roomImages: [],
            status: "available",
          },
        ],
      },
    }));
  };

  const removeRoomType = index => {
    const updatedRoomTypes = formData.details.roomTypes.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        roomTypes: updatedRoomTypes,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Hotel name is required";
    if (!formData.about) newErrors.about = "About section is required";
    if (!formData.whatWeDo) newErrors.whatWeDo = "What we do section is required";
    if (!formData.location.address) newErrors.address = "Address is required";
    if (!formData.location.area) newErrors.area = "Area is required";
    if (!formData.contactInformation.phone) newErrors.phone = "Phone number is required";

    // Validate room types
    formData.details.roomTypes.forEach((room, index) => {
      if (!room.name) newErrors[`room_${index}_name`] = "Room name is required";
      if (!room.bedType) newErrors[`room_${index}_bedType`] = "Bed type is required";
      if (!room.roomType) newErrors[`room_${index}_roomType`] = "Room type is required";
      if (!room.pricePerNight)
        newErrors[`room_${index}_pricePerNight`] = "Price per night is required";
      if (!room.basePrice) newErrors[`room_${index}_basePrice`] = "Base price is required";
      if (room.discountedRate < 0 || room.discountedRate > 100)
        newErrors[`room_${index}_discountedRate`] = "Discount rate must be between 0 and 100";
      if (!room.maxOccupancy || room.maxOccupancy < 1)
        newErrors[`room_${index}_maxOccupancy`] = "Max occupancy must be at least 1";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert string numbers to actual numbers
      const processedData = {
        ...formData,
        details: {
          ...formData.details,
          roomTypes: formData.details.roomTypes.map(room => ({
            ...room,
            pricePerNight: Number(room.pricePerNight),
            basePrice: Number(room.basePrice),
            discountedRate: Number(room.discountedRate),
            breakfastCost: Number(room.breakfastCost),
            maxOccupancy: Number(room.maxOccupancy),
          })),
        },
      };

      const token = localStorage.getItem("token"); // Get from your auth state
      const result = await createListing(processedData, token);

      onSuccess(result.data);
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Hotel Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => handleInputChange("name", e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label>About</label>
        <textarea
          value={formData.about}
          onChange={e => handleInputChange("about", e.target.value)}
        />
        {errors.about && <span className="error">{errors.about}</span>}
      </div>

      <div>
        <label>What We Do</label>
        <textarea
          value={formData.whatWeDo}
          onChange={e => handleInputChange("whatWeDo", e.target.value)}
        />
        {errors.whatWeDo && <span className="error">{errors.whatWeDo}</span>}
      </div>

      <div>
        <label>Address</label>
        <input
          type="text"
          value={formData.location.address}
          onChange={e =>
            handleInputChange("location", { ...formData.location, address: e.target.value })
          }
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <div>
        <label>Area</label>
        <input
          type="text"
          value={formData.location.area}
          onChange={e =>
            handleInputChange("location", { ...formData.location, area: e.target.value })
          }
        />
        {errors.area && <span className="error">{errors.area}</span>}
      </div>

      <div>
        <label>Phone</label>
        <input
          type="tel"
          value={formData.contactInformation.phone}
          onChange={e =>
            handleInputChange("contactInformation", {
              ...formData.contactInformation,
              phone: e.target.value,
            })
          }
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      {/* Room Types */}
      {formData.details.roomTypes.map((room, index) => (
        <div key={index} className="room-type-section">
          <h3>Room Type {index + 1}</h3>

          <div>
            <label>Room Name</label>
            <input
              type="text"
              value={room.name}
              onChange={e => handleRoomTypeChange(index, "name", e.target.value)}
            />
            {errors[`room_${index}_name`] && (
              <span className="error">{errors[`room_${index}_name`]}</span>
            )}
          </div>

          <div>
            <label>Bed Type</label>
            <input
              type="text"
              value={room.bedType}
              onChange={e => handleRoomTypeChange(index, "bedType", e.target.value)}
            />
            {errors[`room_${index}_bedType`] && (
              <span className="error">{errors[`room_${index}_bedType`]}</span>
            )}
          </div>

          <div>
            <label>Room Type</label>
            <input
              type="text"
              value={room.roomType}
              onChange={e => handleRoomTypeChange(index, "roomType", e.target.value)}
            />
            {errors[`room_${index}_roomType`] && (
              <span className="error">{errors[`room_${index}_roomType`]}</span>
            )}
          </div>

          <div>
            <label>Price Per Night</label>
            <input
              type="number"
              value={room.pricePerNight}
              onChange={e => handleRoomTypeChange(index, "pricePerNight", e.target.value)}
            />
            {errors[`room_${index}_pricePerNight`] && (
              <span className="error">{errors[`room_${index}_pricePerNight`]}</span>
            )}
          </div>

          <div>
            <label>Base Price</label>
            <input
              type="number"
              value={room.basePrice}
              onChange={e => handleRoomTypeChange(index, "basePrice", e.target.value)}
            />
            {errors[`room_${index}_basePrice`] && (
              <span className="error">{errors[`room_${index}_basePrice`]}</span>
            )}
            <p className="note">
              salesPrice will be automatically calculated based on base price and discount rate
            </p>
          </div>

          <div>
            <label>Discount Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={room.discountedRate}
              onChange={e => handleRoomTypeChange(index, "discountedRate", e.target.value)}
            />
            {errors[`room_${index}_discountedRate`] && (
              <span className="error">{errors[`room_${index}_discountedRate`]}</span>
            )}
          </div>

          <div>
            <label>Max Occupancy</label>
            <input
              type="number"
              min="1"
              value={room.maxOccupancy}
              onChange={e => handleRoomTypeChange(index, "maxOccupancy", e.target.value)}
            />
            {errors[`room_${index}_maxOccupancy`] && (
              <span className="error">{errors[`room_${index}_maxOccupancy`]}</span>
            )}
          </div>

          <button type="button" onClick={() => removeRoomType(index)}>
            Remove Room Type
          </button>
        </div>
      ))}

      <button type="button" onClick={addRoomType}>
        Add Another Room Type
      </button>

      <button type="submit">Create Listing</button>
    </form>
  );
};

export default HotelListingForm;
```

### 4. Listing Display Component

Create `src/components/ListingCard.js`:

```javascript
import React from "react";

const ListingCard = ({ listing }) => {
  const formatPrice = price => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDisplayPrice = () => {
    if (listing.category === "hotel") {
      const roomType = listing.details.roomTypes[0];
      return formatPrice(roomType.salesPrice);
    } else if (listing.category === "restaurant") {
      return `${formatPrice(listing.details.priceRangePerMeal.priceFrom)} - ${formatPrice(listing.details.priceRangePerMeal.priceTo)}`;
    } else if (listing.category === "shortlet") {
      return formatPrice(listing.details.pricePerNight);
    } else if (listing.category === "services") {
      return `${formatPrice(listing.details.pricingRange.priceFrom)} - ${formatPrice(listing.details.pricingRange.priceTo)}`;
    } else if (listing.category === "event") {
      return `${formatPrice(listing.details.priceRange.priceFrom)} - ${formatPrice(listing.details.priceRange.priceTo)}`;
    }
    return "Price not available";
  };

  const getPriceDetails = () => {
    if (listing.category === "hotel") {
      const roomType = listing.details.roomTypes[0];
      const discountAmount = roomType.basePrice - roomType.salesPrice;

      return (
        <div className="price-details">
          <div className="original-price">Original: {formatPrice(roomType.basePrice)}</div>
          <div className="discounted-price">Now: {formatPrice(roomType.salesPrice)}</div>
          <div className="savings">
            Save {formatPrice(discountAmount)} ({roomType.discountedRate}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="listing-card">
      {listing.images && listing.images[0] && (
        <img src={listing.images[0].url} alt={listing.name} className="listing-image" />
      )}

      <div className="listing-content">
        <h3 className="listing-title">{listing.name}</h3>
        <p className="listing-category">{listing.category}</p>
        <p className="listing-location">{listing.location?.area}</p>

        <div className="price-section">
          <div className="current-price">{getDisplayPrice()}</div>
          {getPriceDetails()}
        </div>

        <p className="listing-description">
          {listing.about?.substring(0, 100)}
          {listing.about?.length > 100 && "..."}
        </p>

        {listing.category === "hotel" && (
          <div className="room-features">
            {listing.details.roomTypes.map((room, index) => (
              <div key={index} className="room-feature">
                <span className="room-name">{room.name}</span>
                <span className="room-type">{room.roomType}</span>
                <span className="bed-type">{room.bedType}</span>
                <span className="max-occupancy">Max: {room.maxOccupancy} guests</span>
                {room.breakfastIncluded && <span className="breakfast">Breakfast included</span>}
              </div>
            ))}
          </div>
        )}

        <div className="listing-actions">
          <button className="view-details-btn">View Details</button>
          <button className="contact-btn">Contact</button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
```

### 5. Main Listings Page

Create `src/pages/ListingsPage.js`:

```javascript
import React, { useState } from "react";
import { useListings } from "../hooks/useListings";
import ListingCard from "../components/ListingCard";

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    status: "approved",
    minPrice: "",
    maxPrice: "",
    area: "",
    sort: "-createdAt",
    page: 1,
    limit: 12,
  });

  const { listings, loading, error, totalResults } = useListings(filters, [
    JSON.stringify(filters),
  ]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
  };

  const handleSortChange = sortValue => {
    setFilters(prev => ({ ...prev, sort: sortValue }));
  };

  const handlePageChange = newPage => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(totalResults / filters.limit);

  if (loading) {
    return <div className="loading">Loading listings...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="listings-page">
      <div className="listings-header">
        <h1>Explore Listings</h1>
        <p className="results-count">Found {totalResults} listings</p>
      </div>

      <div className="listings-controls">
        <div className="filters">
          <select
            value={filters.category}
            onChange={e => handleFilterChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="hotel">Hotels</option>
            <option value="restaurant">Restaurants</option>
            <option value="shortlet">Shortlets</option>
            <option value="services">Services</option>
            <option value="event">Events</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={e => handleFilterChange("minPrice", e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={e => handleFilterChange("maxPrice", e.target.value)}
          />

          <input
            type="text"
            placeholder="Area"
            value={filters.area}
            onChange={e => handleFilterChange("area", e.target.value)}
          />

          <select value={filters.sort} onChange={e => handleSortChange(e.target.value)}>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Title: A-Z</option>
          </select>
        </div>
      </div>

      <div className="listings-grid">
        {listings.map(listing => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="no-results">
          <p>No listings found matching your criteria.</p>
          <button
            onClick={() =>
              setFilters({
                category: "",
                status: "approved",
                minPrice: "",
                maxPrice: "",
                area: "",
                sort: "-createdAt",
                page: 1,
                limit: 12,
              })
            }
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(filters.page - 1)}
          disabled={filters.page === 1}
          className="pagination-btn"
        >
          Previous
        </button>

        <span className="page-info">
          Page {filters.page} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(filters.page + 1)}
          disabled={filters.page >= totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingsPage;
```

---

## 13. Error Handling

### Common Error Responses

#### Validation Errors

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Listing name is required"
    },
    {
      "field": "details.roomTypes.0.basePrice",
      "message": "Base price is required for hotel listings"
    }
  ]
}
```

#### Authentication Errors

```json
{
  "status": "error",
  "message": "Authentication required"
}
```

#### Authorization Errors

```json
{
  "status": "error",
  "message": "You are not authorized to perform this action"
}
```

#### Not Found Errors

```json
{
  "status": "error",
  "message": "Listing not found"
}
```

### Frontend Error Handling

```javascript
// Generic error handler
const handleApiError = error => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = "/login";
    return;
  }

  if (error.status === 403) {
    alert("You are not authorized to perform this action");
    return;
  }

  if (error.status === 404) {
    alert("Listing not found");
    return;
  }

  if (error.status === 400) {
    // Validation errors
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`${err.field}: ${err.message}`);
      });
    } else {
      alert(error.message);
    }
    return;
  }

  alert("An unexpected error occurred. Please try again.");
};

// Usage in components
try {
  const result = await createListing(listingData, token);
  // Success handling
} catch (error) {
  handleApiError(error);
}
```

---

## Quick Reference

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Required Fields by Category

| Category   | Required Fields                                                                                                                                                                                                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hotel      | `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.roomTypes[].name`, `details.roomTypes[].bedType`, `details.roomTypes[].roomType`, `details.roomTypes[].pricePerNight`, `details.roomTypes[].basePrice`, `details.roomTypes[].maxOccupancy`                                                     |
| Restaurant | `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.yearsOfOperation`, `details.cuisineType`, `details.seatingCapacity`, `details.operatingDays`, `details.openingTime`, `details.closingTime`, `details.peakHours`, `details.menuCategories`, `details.priceRangePerMeal`, `details.specialMeals` |
| Shortlet   | `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.description`, `details.numberOfRooms`, `details.roomTypes`, `details.bedType`, `details.pricePerNight`                                                                                                                                         |
| Services   | `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.serviceCategory`, `details.businessDescription`, `details.listOfServices`, `details.pricingRange`                                                                                                                                              |
| Event      | `name`, `about`, `whatWeDo`, `location`, `contactInformation`, `images`, `details.hallDescription`, `details.numberOfHalls`, `details.hallType`, `details.minGuestCapacity`, `details.maxGuestCapacity`, `details.supportedEventTypes`, `details.priceRange`                                                                     |

### Price Calculation Summary

For **Hotel** listings only:

- **Input Fields:** `basePrice` and `discountedRate`
- **Output Field:** `salesPrice` (automatically calculated)
- **Formula:** `salesPrice = basePrice - (basePrice × discountedRate ÷ 100)`
- **Rounding:** Results are rounded to nearest whole number

**Example:**

```javascript
// Input
{
  "basePrice": 150000,
  "discountedRate": 10
}

// Output (automatically calculated)
{
  "salesPrice": 135000  // 150000 - (150000 × 10 ÷ 100)
}
```

---

## Support

For issues or questions:

1. Check the error messages in the API responses
2. Verify authentication tokens are valid
3. Ensure all required fields are provided
4. For hotel listings, remember that `salesPrice` is calculated automatically
5. Contact the development team for technical issues

**API Base URL:** `http://localhost:3000/api/v1/listings`  
**Documentation Last Updated:** January 2026
