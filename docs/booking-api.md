# Booking API Documentation

## Overview

The Booking API provides a comprehensive polymorphic system for managing bookings across different categories: shortlet, hotel, restaurant, services, and event. This API supports creation, retrieval, updating, and management of bookings with robust validation and role-based access control.

**Base URL:** `http://localhost:<PORT>/api/v1/bookings`  
**Content-Type:** `application/json`  
**Authentication:** Required for all operations

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Booking Categories](#2-booking-categories)
3. [Create Booking](#3-create-booking)
4. [Get All Bookings](#4-get-all-bookings)
5. [Get Single Booking](#5-get-single-booking)
6. [Get User Bookings](#6-get-user-bookings)
7. [Get Vendor Bookings](#7-get-vendor-bookings)
8. [Update Booking Status](#8-update-booking-status)
9. [Delete Booking](#9-delete-booking)
10. [Validation Rules](#10-validation-rules)
11. [Error Handling](#11-error-handling)
12. [Frontend Integration Guide](#12-frontend-integration-guide)
13. [Quick Reference](#13-quick-reference)

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

- Creating bookings
- Getting user-specific bookings
- Getting vendor-specific bookings
- Updating booking status
- Deleting bookings

### Role-Based Access:

- **Admin**: Can access all bookings and update any booking status
- **Vendor**: Can access bookings for their listings and update status
- **User**: Can access their own bookings only

### Public Endpoints:

- None - all booking operations require authentication

---

## 2. Booking Categories

The API supports 5 booking categories, each with specific required fields and validation:

### Shortlet Booking

- **Required Fields:** `category`, `details.shortletId`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`
- **Optional Fields:** `details.specialRequest`, `message`
- **Reference:** Links to shortlet listing

### Hotel Booking

- **Required Fields:** `category`, `details.hotelId`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`
- **Optional Fields:** `details.specialRequest`, `message`
- **Reference:** Links to hotel listing

### Restaurant Booking

- **Required Fields:** `category`, `details.restaurantId`, `details.date`, `details.numberOfGuest`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`
- **Optional Fields:** `details.specialRequest`, `message`
- **Reference:** Links to restaurant listing
- **Special:** Date and guest count validation

### Services Booking

- **Required Fields:** `category`, `details.serviceId`, `details.serviceSchedule`, `details.serviceLocationType`, `details.streetAddress`, `details.city`, `details.state`, `details.serviceDescription`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`
- **Optional Fields:** `details.postalCode`, `details.serviceRequirement`, `details.specialRequest`, `message`
- **Reference:** Links to services listing
- **Special:** Service location and scheduling validation

### Event Booking

- **Required Fields:** `category`, `details.eventId`, `details.eventName`, `details.eventDate`, `details.startTime`, `details.endTime`, `details.country`, `details.city`, `details.state`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`
- **Optional Fields:** `details.specialRequest`, `message`
- **Reference:** Links to event listing
- **Special:** Date and time validation

---

## 3. Create Booking

### Endpoint

```bash
POST /api/v1/bookings
```

### Authentication Required: Yes

### Request Body Structure

#### Shortlet Booking Example

```json
{
  "category": "shortlet",
  "details": {
    "shortletId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+2348012345678",
    "specialRequest": "Early check-in if possible"
  },
  "message": "Looking forward to staying at your property!"
}
```

#### Hotel Booking Example

```json
{
  "category": "hotel",
  "details": {
    "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "+2348098765432",
    "specialRequest": "Quiet room for business trip"
  },
  "message": "Need a quiet room for business trip"
}
```

#### Restaurant Booking Example

```json
{
  "category": "restaurant",
  "details": {
    "restaurantId": "60f7b3b3b3b3b3b3b3b3b3b5",
    "date": "2024-03-15T18:00:00.000Z",
    "numberOfGuest": 6,
    "firstName": "Michael",
    "lastName": "Johnson",
    "email": "michael.j@example.com",
    "phoneNumber": "+2348011223344",
    "specialRequest": "High chair for child"
  },
  "message": "Celebrating birthday dinner"
}
```

#### Services Booking Example

```json
{
  "category": "services",
  "details": {
    "serviceId": "60f7b3b3b3b3b3b3b3b3b3b6",
    "serviceSchedule": "2024-03-20T10:00:00.000Z",
    "serviceLocationType": "commercial",
    "streetAddress": "123 Business Avenue",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001",
    "serviceDescription": "Office cleaning and sanitization",
    "serviceRequirement": "Must use eco-friendly cleaning products",
    "firstName": "Sarah",
    "lastName": "Williams",
    "email": "sarah.w@example.com",
    "phoneNumber": "+2348055667788",
    "specialRequest": "Access to building after hours"
  },
  "message": "Need cleaning service for office"
}
```

#### Event Booking Example

```json
{
  "category": "event",
  "details": {
    "eventId": "60f7b3b3b3b3b3b3b3b3b3b7",
    "eventName": "Corporate Gala",
    "eventDate": "2024-04-15",
    "startTime": "18:00",
    "endTime": "23:00",
    "country": "Nigeria",
    "city": "Lagos",
    "state": "Lagos",
    "firstName": "David",
    "lastName": "Brown",
    "email": "david.b@example.com",
    "phoneNumber": "+2348099887766",
    "specialRequest": "Stage setup and sound system"
  },
  "message": "Wedding reception booking"
}
```

### Common Fields

- **category**: String (required) - One of: "shortlet", "hotel", "restaurant", "services", "event"
- **details**: Object (required) - Category-specific booking details
- **message**: String (optional) - Additional message to vendor (max 500 characters)

### Common Validation Rules

- **firstName**: Required, trimmed string
- **lastName**: Required, trimmed string
- **email**: Required, valid email format
- **phoneNumber**: Required, trimmed string
- **specialRequest**: Optional, max 500 characters

### Success Response

```json
{
  "message": "Booking created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3c1",
    "userId": "60f7b3b3b3b3b3b3b3b3b3d1",
    "vendorId": "60f7b3b3b3b3b3b3b3b3b3d2",
    "category": "hotel",
    "status": "pending",
    "message": "Need a quiet room for business trip",
    "details": {
      "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "+2348098765432",
      "specialRequest": "Quiet room for business trip"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 4. Get All Bookings

### Endpoint

```bash
GET /api/v1/bookings
```

### Authentication Required: Yes

### Access Control

- **Admin Only**: Can access all bookings in the system
- **Other Roles**: Will receive 403 Forbidden error

### Query Parameters

#### Filtering

```bash
# Filter by booking status
GET /api/v1/bookings?status=pending

# Filter by category
GET /api/v1/bookings?category=hotel

# Filter by date range
GET /api/v1/bookings?startDate=2024-01-01&endDate=2024-12-31

# Combine filters
GET /api/v1/bookings?status=approved&category=restaurant
```

#### Sorting

```bash
# Sort by creation date (newest first - default)
GET /api/v1/bookings?sort=-createdAt

# Sort by creation date (oldest first)
GET /api/v1/bookings?sort=createdAt

# Sort by status
GET /api/v1/bookings?sort=status

# Sort by category
GET /api/v1/bookings?sort=category
```

#### Pagination

```bash
# Get first page with 10 results
GET /api/v1/bookings?page=1&limit=10

# Get second page
GET /api/v1/bookings?page=2&limit=10
```

#### Field Selection

```bash
# Get only specific fields
GET /api/v1/bookings?fields=category,status,createdAt,details.firstName,details.lastName

# Exclude fields (not needed, __v is excluded by default)
```

### Success Response

```json
{
  "status": "success",
  "results": 15,
  "data": {
    "bookings": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3c1",
        "userId": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3d1",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane.smith@example.com"
        },
        "vendorId": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3d2",
          "firstName": "Hotel",
          "lastName": "Manager",
          "email": "manager@hotel.com"
        },
        "category": "hotel",
        "status": "pending",
        "message": "Need a quiet room for business trip",
        "details": {
          "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane.smith@example.com",
          "phoneNumber": "+2348098765432",
          "specialRequest": "Quiet room for business trip"
        },
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. Get Single Booking

### Endpoint

```bash
GET /api/v1/bookings/:id
```

### Authentication Required: Yes

### Access Control

- **Admin**: Can access any booking
- **Vendor**: Can access bookings for their listings
- **User**: Can access their own bookings only

### Success Response

```json
{
  "status": "success",
  "message": "Booking retrieved successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3c1",
    "userId": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3d1",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    },
    "vendorId": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3d2",
      "firstName": "Hotel",
      "lastName": "Manager",
      "email": "manager@hotel.com"
    },
    "category": "hotel",
    "status": "pending",
    "message": "Need a quiet room for business trip",
    "details": {
      "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "+2348098765432",
      "specialRequest": "Quiet room for business trip"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 6. Get User Bookings

### Endpoint

```bash
GET /api/v1/bookings/user
```

### Authentication Required: Yes

### Access Control

- **User**: Can access their own bookings only
- **Admin/Vendor**: Can access their own bookings (not others')

### Query Parameters

```bash
# Filter by status
GET /api/v1/bookings/user?status=pending

# Filter by category
GET /api/v1/bookings/user?category=restaurant

# Sort by date
GET /api/v1/bookings/user?sort=-createdAt

# Pagination
GET /api/v1/bookings/user?page=1&limit=10
```

### Success Response

```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3c1",
      "vendorId": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3d2",
        "firstName": "Hotel",
        "lastName": "Manager",
        "email": "manager@hotel.com"
      },
      "category": "hotel",
      "status": "pending",
      "message": "Need a quiet room for business trip",
      "details": {
        "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+2348098765432",
        "specialRequest": "Quiet room for business trip"
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## 7. Get Vendor Bookings

### Endpoint

```bash
GET /api/v1/bookings/vendor/:vendorId
```

### Authentication Required: Yes

### Access Control

- **Admin**: Can access any vendor's bookings
- **Vendor**: Can access their own bookings only
- **User**: Cannot access vendor bookings

### Query Parameters

```bash
# Filter by status
GET /api/v1/bookings/vendor/60f7b3b3b3b3b3b3b3b3b3d2?status=pending

# Filter by category
GET /api/v1/bookings/vendor/60f7b3b3b3b3b3b3b3b3b3d2?category=hotel

# Sort by date
GET /api/v1/bookings/vendor/60f7b3b3b3b3b3b3b3b3b3d2?sort=-createdAt

# Pagination
GET /api/v1/bookings/vendor/60f7b3b3b3b3b3b3b3b3b3d2?page=1&limit=10
```

### Success Response

```json
{
  "status": "success",
  "results": 5,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3c1",
      "userId": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3d1",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com"
      },
      "category": "hotel",
      "status": "pending",
      "message": "Need a quiet room for business trip",
      "details": {
        "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+2348098765432",
        "specialRequest": "Quiet room for business trip"
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## 8. Update Booking Status

### Endpoint

```bash
PATCH /api/v1/bookings/:id
```

### Authentication Required: Yes

### Access Control

- **Admin**: Can update any booking status
- **Vendor**: Can update status for bookings on their listings only
- **User**: Cannot update booking status

### Request Body

```json
{
  "status": "approved"
}
```

### Valid Status Values

- `"pending"` - Booking awaiting approval
- `"approved"` - Booking confirmed
- `"rejected"` - Booking declined
- `"cancelled"` - Booking cancelled

### Success Response

```json
{
  "status": "success",
  "message": "Booking status updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3c1",
    "userId": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3d1",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    },
    "vendorId": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3d2",
      "firstName": "Hotel",
      "lastName": "Manager",
      "email": "manager@hotel.com"
    },
    "category": "hotel",
    "status": "approved",
    "message": "Need a quiet room for business trip",
    "details": {
      "hotelId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "+2348098765432",
      "specialRequest": "Quiet room for business trip"
    },
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  }
}
```

---

## 9. Delete Booking

### Endpoint

```bash
DELETE /api/v1/bookings/:id
```

### Authentication Required: Yes

### Access Control

- **Admin**: Can delete any booking
- **User**: Can delete their own pending bookings only
- **Vendor**: Cannot delete bookings

### Notes

- Only pending bookings can be deleted by users
- Admins can delete bookings in any status
- Deleted bookings are permanently removed from the system

### Success Response

```json
{
  "status": "success",
  "message": "Booking deleted successfully"
}
```

---

## 10. Validation Rules

### Common Validation (All Booking Types)

```javascript
// firstName
{
  required: true,
  trim: true,
  minlength: [2, "First name must be at least 2 characters"],
  maxlength: [50, "First name cannot exceed 50 characters"]
}

// lastName
{
  required: true,
  trim: true,
  minlength: [2, "Last name must be at least 2 characters"],
  maxlength: [50, "Last name cannot exceed 50 characters"]
}

// email
{
  required: true,
  trim: true,
  lowercase: true,
  validate: {
    validator: function(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    message: "Please provide a valid email address"
  }
}

// phoneNumber
{
  required: true,
  trim: true,
  validate: {
    validator: function(v) {
      return /^\+?[0-9\s\-\(\)]{10,}$/.test(v);
    },
    message: "Please provide a valid phone number"
  }
}

// specialRequest
{
  trim: true,
  maxlength: [500, "Special request cannot exceed 500 characters"]
}
```

### Category-Specific Validation

#### Restaurant Booking

```javascript
// date
{
  required: true,
  validate: {
    validator: function(v) {
      return v >= new Date();
    },
    message: "Booking date must be in the future"
  }
}

// numberOfGuest
{
  required: true,
  min: [1, "Number of guests must be at least 1"],
  max: [50, "Number of guests cannot exceed 50"]
}
```

#### Services Booking

```javascript
// serviceSchedule
{
  required: true,
  validate: {
    validator: function(v) {
      return v >= new Date();
    },
    message: "Service schedule must be in the future"
  }
}

// serviceLocationType
{
  required: true,
  enum: {
    values: ["residential", "commercial", "industrial"],
    message: "Service location type must be residential, commercial, or industrial"
  }
}

// streetAddress
{
  required: true,
  trim: true,
  minlength: [5, "Street address must be at least 5 characters"]
}

// city
{
  required: true,
  trim: true,
  minlength: [2, "City name must be at least 2 characters"]
}

// state
{
  required: true,
  trim: true,
  minlength: [2, "State name must be at least 2 characters"]
}

// serviceDescription
{
  required: true,
  trim: true,
  minlength: [10, "Service description must be at least 10 characters"],
  maxlength: [1000, "Service description cannot exceed 1000 characters"]
}
```

#### Event Booking

```javascript
// eventName
{
  required: true,
  trim: true
}

// eventDate
{
  required: true,
  validate: {
    validator: function(v) {
      return v >= new Date();
    },
    message: "Event date must be in the future"
  }
}

// startTime
{
  required: true,
  type: String
}

// endTime
{
  required: true,
  type: String
}

// country
{
  required: true,
  type: String
}

// city
{
  required: true,
  type: String
}

// state
{
  required: true,
  type: String
}
```

---

## 11. Error Handling

### Common Error Responses

#### Validation Errors

```json
{
  "status": "fail",
  "message": "Validation failed: First name is required, Valid email is required",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "isOperational": true,
    "message": "Validation failed: First name is required, Valid email is required"
  }
}
```

#### Authentication Errors

```json
{
  "status": "error",
  "message": "Authentication required",
  "error": {
    "statusCode": 401,
    "status": "error",
    "isOperational": true,
    "message": "Authentication required"
  }
}
```

#### Authorization Errors

```json
{
  "status": "error",
  "message": "You are not authorized to perform this action",
  "error": {
    "statusCode": 403,
    "status": "error",
    "isOperational": true,
    "message": "You are not authorized to perform this action"
  }
}
```

#### Not Found Errors

```json
{
  "status": "error",
  "message": "Booking not found",
  "error": {
    "statusCode": 404,
    "status": "error",
    "isOperational": true,
    "message": "Booking not found"
  }
}
```

#### Conflict Errors

```json
{
  "status": "error",
  "message": "Cannot delete approved booking",
  "error": {
    "statusCode": 409,
    "status": "error",
    "isOperational": true,
    "message": "Cannot delete approved booking"
  }
}
```

### Frontend Error Handling

```javascript
// Generic error handler
const handleBookingError = error => {
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
    alert("Booking not found");
    return;
  }

  if (error.status === 400) {
    // Validation errors
    alert(error.message);
    return;
  }

  if (error.status === 409) {
    alert(error.message);
    return;
  }

  alert("An unexpected error occurred. Please try again.");
};

// Usage in components
try {
  const result = await createBooking(bookingData, token);
  // Success handling
} catch (error) {
  handleBookingError(error);
}
```

---

## 12. Frontend Integration Guide

### 1. API Service Setup

Create `src/services/bookingService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1/bookings";

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

// Create booking
export const createBooking = async (bookingData, token) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create booking");
  }

  return response.json();
};

// Get all bookings (admin only)
export const getAllBookings = async (filters = {}, token) => {
  const queryString = buildQuery(filters);
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch bookings");
  }

  return response.json();
};

// Get single booking
export const getBookingById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch booking");
  }

  return response.json();
};

// Get user bookings
export const getUserBookings = async (filters = {}, token) => {
  const queryString = buildQuery(filters);
  const url = `${API_BASE_URL}/user${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user bookings");
  }

  return response.json();
};

// Get vendor bookings
export const getVendorBookings = async (vendorId, filters = {}, token) => {
  const queryString = buildQuery(filters);
  const url = `${API_BASE_URL}/vendor/${vendorId}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch vendor bookings");
  }

  return response.json();
};

// Update booking status
export const updateBookingStatus = async (id, status, token) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update booking status");
  }

  return response.json();
};

// Delete booking
export const deleteBooking = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete booking");
  }

  return response.json();
};
```

### 2. Custom Hooks

Create `src/hooks/useBookings.js`:

```javascript
import { useState, useEffect } from "react";
import {
  getUserBookings,
  getVendorBookings,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "../services/bookingService";

export const useUserBookings = (filters = {}, dependencies = []) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserBookings(filters);
        setBookings(data.data);
        setTotalResults(data.results || data.data.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, dependencies);

  return { bookings, loading, error, totalResults };
};

export const useVendorBookings = (vendorId, filters = {}, dependencies = []) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!vendorId) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVendorBookings(vendorId, filters);
        setBookings(data.data);
        setTotalResults(data.results || data.data.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [vendorId, ...dependencies]);

  return { bookings, loading, error, totalResults };
};

export const useBookingManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateBooking = async (bookingData, token) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createBooking(bookingData, token);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, token) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateBookingStatus(id, status, token);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id, token) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteBooking(id, token);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleCreateBooking,
    handleUpdateStatus,
    handleDeleteBooking,
  };
};
```

### 3. Booking Form Component

Create `src/components/BookingForm.js`:

```javascript
import React, { useState } from "react";
import { useBookingManagement } from "../hooks/useBookings";

const BookingForm = ({ listing, onSuccess, onError }) => {
  const { handleCreateBooking, loading, error } = useBookingManagement();
  const [formData, setFormData] = useState({
    category: listing.category,
    details: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      specialRequest: "",
    },
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Category-specific fields
  React.useEffect(() => {
    const categoryFields = {};

    switch (listing.category) {
      case "restaurant":
        categoryFields.date = "";
        categoryFields.numberOfGuest = 1;
        break;
      case "services":
        categoryFields.serviceSchedule = "";
        categoryFields.serviceLocationType = "residential";
        categoryFields.streetAddress = "";
        categoryFields.city = "";
        categoryFields.state = "";
        categoryFields.serviceDescription = "";
        break;
      case "event":
        categoryFields.eventName = "";
        categoryFields.eventDate = "";
        categoryFields.startTime = "";
        categoryFields.endTime = "";
        categoryFields.country = "";
        categoryFields.city = "";
        categoryFields.state = "";
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        ...categoryFields,
        [`${listing.category}Id`]: listing._id,
      },
    }));
  }, [listing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));
  };

  const handleCommonInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validation
    if (!formData.details.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.details.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (
      !formData.details.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.details.email)
    ) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.details.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    // Category-specific validation
    switch (listing.category) {
      case "restaurant":
        if (!formData.details.date) {
          newErrors.date = "Booking date is required";
        } else if (new Date(formData.details.date) < new Date()) {
          newErrors.date = "Booking date must be in the future";
        }
        if (!formData.details.numberOfGuest || formData.details.numberOfGuest < 1) {
          newErrors.numberOfGuest = "Number of guests must be at least 1";
        }
        break;

      case "services":
        if (!formData.details.serviceSchedule) {
          newErrors.serviceSchedule = "Service schedule is required";
        } else if (new Date(formData.details.serviceSchedule) < new Date()) {
          newErrors.serviceSchedule = "Service schedule must be in the future";
        }
        if (!formData.details.serviceLocationType) {
          newErrors.serviceLocationType = "Service location type is required";
        }
        if (!formData.details.streetAddress?.trim()) {
          newErrors.streetAddress = "Street address is required";
        }
        if (!formData.details.city?.trim()) {
          newErrors.city = "City is required";
        }
        if (!formData.details.state?.trim()) {
          newErrors.state = "State is required";
        }
        if (!formData.details.serviceDescription?.trim()) {
          newErrors.serviceDescription = "Service description is required";
        }
        break;

      case "event":
        if (!formData.details.eventName?.trim()) {
          newErrors.eventName = "Event name is required";
        }
        if (!formData.details.eventDate) {
          newErrors.eventDate = "Event date is required";
        } else if (new Date(formData.details.eventDate) < new Date()) {
          newErrors.eventDate = "Event date must be in the future";
        }
        if (!formData.details.startTime) {
          newErrors.startTime = "Start time is required";
        }
        if (!formData.details.endTime) {
          newErrors.endTime = "End time is required";
        }
        if (!formData.details.country?.trim()) {
          newErrors.country = "Country is required";
        }
        if (!formData.details.city?.trim()) {
          newErrors.city = "City is required";
        }
        if (!formData.details.state?.trim()) {
          newErrors.state = "State is required";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const result = await handleCreateBooking(formData, token);
      onSuccess(result.data);
    } catch (error) {
      onError(error.message);
    }
  };

  const renderCategoryFields = () => {
    switch (listing.category) {
      case "restaurant":
        return (
          <>
            <div className="form-group">
              <label>Booking Date</label>
              <input
                type="datetime-local"
                value={formData.details.date || ""}
                onChange={e => handleInputChange("date", e.target.value)}
              />
              {errors.date && <span className="error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label>Number of Guests</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.details.numberOfGuest || 1}
                onChange={e => handleInputChange("numberOfGuest", parseInt(e.target.value))}
              />
              {errors.numberOfGuest && <span className="error">{errors.numberOfGuest}</span>}
            </div>
          </>
        );

      case "services":
        return (
          <>
            <div className="form-group">
              <label>Service Schedule</label>
              <input
                type="datetime-local"
                value={formData.details.serviceSchedule || ""}
                onChange={e => handleInputChange("serviceSchedule", e.target.value)}
              />
              {errors.serviceSchedule && <span className="error">{errors.serviceSchedule}</span>}
            </div>

            <div className="form-group">
              <label>Service Location Type</label>
              <select
                value={formData.details.serviceLocationType || "residential"}
                onChange={e => handleInputChange("serviceLocationType", e.target.value)}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
              {errors.serviceLocationType && (
                <span className="error">{errors.serviceLocationType}</span>
              )}
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={formData.details.streetAddress || ""}
                onChange={e => handleInputChange("streetAddress", e.target.value)}
                placeholder="123 Business Avenue"
              />
              {errors.streetAddress && <span className="error">{errors.streetAddress}</span>}
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.details.city || ""}
                onChange={e => handleInputChange("city", e.target.value)}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={formData.details.state || ""}
                onChange={e => handleInputChange("state", e.target.value)}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label>Service Description</label>
              <textarea
                value={formData.details.serviceDescription || ""}
                onChange={e => handleInputChange("serviceDescription", e.target.value)}
                placeholder="Describe the service you need..."
                rows="3"
              />
              {errors.serviceDescription && (
                <span className="error">{errors.serviceDescription}</span>
              )}
            </div>

            <div className="form-group">
              <label>Service Requirements (Optional)</label>
              <textarea
                value={formData.details.serviceRequirement || ""}
                onChange={e => handleInputChange("serviceRequirement", e.target.value)}
                placeholder="Any specific requirements..."
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Postal Code (Optional)</label>
              <input
                type="text"
                value={formData.details.postalCode || ""}
                onChange={e => handleInputChange("postalCode", e.target.value)}
                placeholder="100001"
              />
            </div>
          </>
        );

      case "event":
        return (
          <>
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                value={formData.details.eventName || ""}
                onChange={e => handleInputChange("eventName", e.target.value)}
              />
              {errors.eventName && <span className="error">{errors.eventName}</span>}
            </div>

            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                value={formData.details.eventDate || ""}
                onChange={e => handleInputChange("eventDate", e.target.value)}
              />
              {errors.eventDate && <span className="error">{errors.eventDate}</span>}
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.details.startTime || ""}
                onChange={e => handleInputChange("startTime", e.target.value)}
              />
              {errors.startTime && <span className="error">{errors.startTime}</span>}
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formData.details.endTime || ""}
                onChange={e => handleInputChange("endTime", e.target.value)}
              />
              {errors.endTime && <span className="error">{errors.endTime}</span>}
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={formData.details.country || ""}
                onChange={e => handleInputChange("country", e.target.value)}
              />
              {errors.country && <span className="error">{errors.country}</span>}
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.details.city || ""}
                onChange={e => handleInputChange("city", e.target.value)}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={formData.details.state || ""}
                onChange={e => handleInputChange("state", e.target.value)}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h3>Book {listing.name}</h3>

      {/* Common Fields */}
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          value={formData.details.firstName || ""}
          onChange={e => handleInputChange("firstName", e.target.value)}
        />
        {errors.firstName && <span className="error">{errors.firstName}</span>}
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          value={formData.details.lastName || ""}
          onChange={e => handleInputChange("lastName", e.target.value)}
        />
        {errors.lastName && <span className="error">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.details.email || ""}
          onChange={e => handleInputChange("email", e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={formData.details.phoneNumber || ""}
          onChange={e => handleInputChange("phoneNumber", e.target.value)}
          placeholder="+2348012345678"
        />
        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label>Special Requests (Optional)</label>
        <textarea
          value={formData.details.specialRequest || ""}
          onChange={e => handleInputChange("specialRequest", e.target.value)}
          placeholder="Any special requests or requirements..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Message to Vendor (Optional)</label>
        <textarea
          value={formData.message || ""}
          onChange={e => handleCommonInputChange("message", e.target.value)}
          placeholder="Any additional message for the vendor..."
          rows="2"
        />
      </div>

      {/* Category-specific fields */}
      {renderCategoryFields()}

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating Booking..." : "Book Now"}
      </button>
    </form>
  );
};

export default BookingForm;
```

### 4. Booking Management Component

Create `src/components/BookingManagement.js`:

```javascript
import React, { useState } from "react";
import { useVendorBookings, useBookingManagement } from "../hooks/useBookings";

const BookingManagement = ({ vendorId }) => {
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    sort: "-createdAt",
  });

  const { bookings, loading, error, totalResults } = useVendorBookings(vendorId, filters, [
    JSON.stringify(filters),
  ]);

  const { handleUpdateStatus, handleDeleteBooking } = useBookingManagement();

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await handleUpdateStatus(bookingId, newStatus, localStorage.getItem("token"));
      // Refresh bookings or update state
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async bookingId => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await handleDeleteBooking(bookingId, localStorage.getItem("token"));
        // Refresh bookings or update state
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "cancelled":
        return "orange";
      default:
        return "blue";
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="booking-management">
      <div className="management-header">
        <h2>Booking Management</h2>
        <p>Total Bookings: {totalResults}</p>
      </div>

      <div className="filters">
        <select
          value={filters.status}
          onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="shortlet">Shortlet</option>
          <option value="hotel">Hotel</option>
          <option value="restaurant">Restaurant</option>
          <option value="services">Services</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking._id} className="booking-card">
            <div className="booking-header">
              <h3>{booking.category.toUpperCase()} Booking</h3>
              <span className={`status-badge ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <div className="booking-details">
              <p>
                <strong>Customer:</strong> {booking.details.firstName} {booking.details.lastName}
              </p>
              <p>
                <strong>Email:</strong> {booking.details.email}
              </p>
              <p>
                <strong>Phone:</strong> {booking.details.phoneNumber}
              </p>

              {booking.category === "restaurant" && (
                <p>
                  <strong>Date:</strong> {new Date(booking.details.date).toLocaleString()}
                </p>
              )}

              {booking.category === "services" && (
                <>
                  <p>
                    <strong>Service:</strong> {booking.details.serviceDescription}
                  </p>
                  <p>
                    <strong>Schedule:</strong>{" "}
                    {new Date(booking.details.serviceSchedule).toLocaleString()}
                  </p>
                </>
              )}

              {booking.category === "event" && (
                <>
                  <p>
                    <strong>Start:</strong> {new Date(booking.details.startDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong> {new Date(booking.details.endDate).toLocaleString()}
                  </p>
                </>
              )}

              {booking.message && (
                <p>
                  <strong>Message:</strong> {booking.message}
                </p>
              )}

              {booking.details.specialRequest && (
                <p>
                  <strong>Special Request:</strong> {booking.details.specialRequest}
                </p>
              )}
            </div>

            <div className="booking-actions">
              {booking.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(booking._id, "approved")}
                    className="btn-approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking._id, "rejected")}
                    className="btn-reject"
                  >
                    Reject
                  </button>
                </>
              )}

              <button
                onClick={() => handleDelete(booking._id)}
                className="btn-delete"
                disabled={booking.status === "approved"}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="no-bookings">
          <p>No bookings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
```

---

## 13. Quick Reference

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (cannot delete approved booking)
- `500` - Internal Server Error

### Required Fields by Category

| Category   | Required Fields                                                                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shortlet   | `category`, `details.shortletId`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`                                                                                                                                                  |
| Hotel      | `category`, `details.hotelId`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`                                                                                                                                                     |
| Restaurant | `category`, `details.restaurantId`, `details.date`, `details.numberOfGuest`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`                                                                                                       |
| Services   | `category`, `details.serviceId`, `details.serviceSchedule`, `details.serviceLocationType`, `details.streetAddress`, `details.city`, `details.state`, `details.serviceDescription`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber` |
| Event      | `category`, `details.eventId`, `details.startDate`, `details.endDate`, `details.firstName`, `details.lastName`, `details.email`, `details.phoneNumber`                                                                                                             |

### Booking Status Values

- `"pending"` - Booking awaiting approval (default)
- `"approved"` - Booking confirmed by vendor
- `"rejected"` - Booking declined by vendor
- `"cancelled"` - Booking cancelled by user

### Access Control Summary

| Operation           | Admin | Vendor | User   |
| ------------------- | ----- | ------ | ------ |
| Create Booking      | ✅    | ✅     | ✅     |
| Get All Bookings    | ✅    | ❌     | ❌     |
| Get Single Booking  | ✅    | ✅\*   | ✅\*   |
| Get User Bookings   | ✅    | ❌     | ✅     |
| Get Vendor Bookings | ✅    | ✅\*   | ❌     |
| Update Status       | ✅    | ✅\*   | ❌     |
| Delete Booking      | ✅    | ❌     | ✅\*\* |

- Can only access their own listings/bookings  
  \*\* Only pending bookings

### Common Error Messages

- `"Booking category is required"` - Missing category field
- `"Booking details are required"` - Missing details object
- `"First name is required"` - Missing firstName in details
- `"Valid email is required"` - Invalid email format
- `"Booking not found"` - Booking ID doesn't exist
- `"You are not authorized to perform this action"` - Insufficient permissions
- `"Cannot delete approved booking"` - User trying to delete non-pending booking

---

## Support

For issues or questions:

1. Check the error messages in the API responses
2. Verify authentication tokens are valid
3. Ensure all required fields are provided for the booking category
4. Check role-based access permissions
5. For date-related bookings, ensure dates are in the future
6. Contact the development team for technical issues

**API Base URL:** `http://localhost:3000/api/v1/bookings`  
**Documentation Last Updated:** February 2026
