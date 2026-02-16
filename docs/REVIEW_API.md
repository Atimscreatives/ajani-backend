# Review API Documentation

## Overview

The Review API allows customers to create reviews for listings they have booked. All reviews go through an admin approval workflow before being publicly visible.

## Base URL

```
/api/v1/reviews
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Get All Reviews

**Access:** Admin, SuperAdmin only

```http
GET /api/v1/reviews
```

**Query Parameters:**

- `status` - Filter by status: `pending`, `approved`, `rejected`
- `sort` - Sort by field (e.g., `-createdAt` for newest first)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "results": 10,
  "totalCount": 50,
  "data": {
    "reviews": [
      {
        "_id": "review_id",
        "listing": {
          "_id": "listing_id",
          "name": "Hotel Name",
          "category": "hotel"
        },
        "user": {
          "_id": "user_id",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "profilePicture": "url"
        },
        "rating": 4,
        "title": "Great stay!",
        "comment": "The hotel was amazing...",
        "status": "approved",
        "moderatedBy": {
          "firstName": "Admin",
          "lastName": "User"
        },
        "moderatedAt": "2024-01-15T10:30:00Z",
        "isDeleted": false,
        "helpfulCount": 5,
        "createdAt": "2024-01-10T08:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 2. Get Review by ID

**Access:** All authenticated users

```http
GET /api/v1/reviews/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "review_id",
      "listing": {
        "_id": "listing_id",
        "name": "Hotel Name",
        "category": "hotel",
        "images": [...],
        "location": {...}
      },
      "user": {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "profilePicture": "url"
      },
      "rating": 4,
      "title": "Great stay!",
      "comment": "The hotel was amazing...",
      "status": "approved",
      "response": {
        "text": "Thank you for your feedback!",
        "respondedBy": {
          "firstName": "Hotel",
          "lastName": "Manager",
          "businessName": "Hotel Name"
        },
        "respondedAt": "2024-01-12T14:00:00Z"
      },
      "helpfulCount": 5,
      "createdAt": "2024-01-10T08:00:00Z"
    }
  }
}
```

---

### 3. Get Reviews by User

**Access:** User (own reviews), Admin, SuperAdmin

```http
GET /api/v1/reviews/user/:userId
```

**Query Parameters:**

- `status` - Filter by status
- `sort` - Sort by field
- `page` - Page number
- `limit` - Items per page

**Response:**

```json
{
  "status": "success",
  "results": 5,
  "totalCount": 5,
  "data": {
    "reviews": [...]
  }
}
```

---

### 4. Get Reviews by Listing (Public)

**Access:** Public (only approved, non-deleted reviews). Admin/SuperAdmin can see all.

```http
GET /api/v1/reviews/listing/:listingId
```

**Query Parameters:**

- `sort` - Sort by field (e.g., `-createdAt`, `-helpfulCount`)
- `page` - Page number
- `limit` - Items per page
- `rating` - Filter by rating (1-5)

**Response:**

```json
{
  "status": "success",
  "results": 10,
  "totalCount": 25,
  "ratingStats": {
    "averageRating": 4.2,
    "numReviews": 25
  },
  "data": {
    "reviews": [
      {
        "_id": "review_id",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "profilePicture": "url"
        },
        "rating": 5,
        "title": "Excellent!",
        "comment": "Amazing experience...",
        "helpfulCount": 10,
        "response": {...},
        "createdAt": "2024-01-10T08:00:00Z"
      }
    ]
  }
}
```

---

### 5. Create Review

**Access:** Customer (user role) only

```http
POST /api/v1/reviews
```

**Request Body:**

```json
{
  "listing": "listing_id",
  "booking": "booking_id", // Optional
  "rating": 4,
  "title": "Great stay!", // Optional
  "comment": "The hotel was amazing. Clean rooms, friendly staff, and great location. Highly recommend!"
}
```

**Validation Rules:**

- `rating`: Required, must be between 1-5
- `comment`: Required, minimum 10 characters, maximum 1000 characters
- `title`: Optional, maximum 100 characters
- User can only review each listing once
- User must have "user" role (not vendor, admin, or superadmin)

**Response:**

```json
{
  "status": "success",
  "message": "Review submitted successfully. It will be visible after admin approval.",
  "data": {
    "review": {
      "_id": "review_id",
      "listing": {...},
      "user": {...},
      "rating": 4,
      "title": "Great stay!",
      "comment": "The hotel was amazing...",
      "status": "pending",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

---

### 6. Update Review

**Access:** Customer (own review), Admin, SuperAdmin

```http
PATCH /api/v1/reviews/:id
```

**Request Body:**

```json
{
  "rating": 5,
  "title": "Updated title",
  "comment": "Updated comment with more details..."
}
```

**Notes:**

- Regular users can only update their own reviews
- Regular users cannot update approved reviews (contact support required)
- When a regular user updates a review, it resets to "pending" status for re-approval
- Admin/SuperAdmin can update any review without changing status

**Response:**

```json
{
  "status": "success",
  "message": "Review updated successfully. It will be visible after admin approval.",
  "data": {
    "review": {...}
  }
}
```

---

### 7. Soft Delete Review

**Access:** Admin, SuperAdmin only

```http
DELETE /api/v1/reviews/:id
```

**Response:**

```json
{
  "status": "success",
  "message": "Review deleted successfully",
  "data": null
}
```

---

### 8. Moderate Review (Approve/Reject)

**Access:** Admin, SuperAdmin only

```http
PATCH /api/v1/reviews/:id/moderate
```

**Request Body:**

```json
{
  "status": "approved",
  "reason": "Review meets our guidelines" // Optional, useful for rejections
}
```

**Status Options:**

- `approved` - Review will be publicly visible
- `rejected` - Review will not be visible

**Response:**

```json
{
  "status": "success",
  "message": "Review approved successfully",
  "data": {
    "review": {
      "_id": "review_id",
      "status": "approved",
      "moderatedBy": {...},
      "moderatedAt": "2024-01-20T12:00:00Z",
      "moderationReason": "Review meets our guidelines"
    }
  }
}
```

---

### 9. Get Pending Reviews

**Access:** Admin, SuperAdmin only

```http
GET /api/v1/reviews/pending/all
```

**Query Parameters:**

- `sort` - Sort by field
- `page` - Page number
- `limit` - Items per page

**Response:**

```json
{
  "status": "success",
  "results": 15,
  "totalCount": 50,
  "data": {
    "reviews": [
      {
        "_id": "review_id",
        "listing": {
          "name": "Hotel Name",
          "category": "hotel",
          "vendorId": "vendor_id"
        },
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "rating": 4,
        "title": "Great stay!",
        "comment": "The hotel was amazing...",
        "status": "pending",
        "booking": {
          "checkIn": "2024-01-01",
          "checkOut": "2024-01-05"
        },
        "createdAt": "2024-01-10T08:00:00Z"
      }
    ]
  }
}
```

---

### 10. Add Response to Review

**Access:** Vendor (own listing), Admin, SuperAdmin

```http
POST /api/v1/reviews/:id/response
```

**Request Body:**

```json
{
  "text": "Thank you for your wonderful feedback! We look forward to hosting you again."
}
```

**Validation:**

- `text`: Required, maximum 500 characters

**Response:**

```json
{
  "status": "success",
  "message": "Response added successfully",
  "data": {
    "review": {
      "_id": "review_id",
      "response": {
        "text": "Thank you for your wonderful feedback!",
        "respondedBy": {
          "firstName": "Hotel",
          "lastName": "Manager",
          "businessName": "Hotel Name"
        },
        "respondedAt": "2024-01-20T14:00:00Z"
      }
    }
  }
}
```

---

### 11. Mark Review as Helpful

**Access:** Public (no authentication required)

```http
POST /api/v1/reviews/:id/helpful
```

**Response:**

```json
{
  "status": "success",
  "message": "Review marked as helpful",
  "data": {
    "helpfulCount": 6
  }
}
```

---

## Review Status Workflow

```
┌─────────┐     ┌──────────┐     ┌─────────┐
│  PENDING │ --> │ APPROVED │ --> │ VISIBLE │
│  (New)   │     │ (Admin)  │     │ (Public)│
└─────────┘     └──────────┘     └─────────┘
     │
     v
┌─────────┐
│ REJECTED│
│ (Admin) │
└─────────┘
```

1. **Pending**: All new reviews start here
2. **Approved**: Admin/SuperAdmin approves - review becomes publicly visible
3. **Rejected**: Admin/SuperAdmin rejects - review not visible
4. When a user updates their review, it returns to "pending" for re-approval

---

## Error Responses

### 400 Bad Request

```json
{
  "status": "fail",
  "message": "You have already reviewed this listing"
}
```

### 403 Forbidden

```json
{
  "status": "fail",
  "message": "Only customers can create reviews"
}
```

### 404 Not Found

```json
{
  "status": "fail",
  "message": "Review not found"
}
```

---

## Access Control Summary

| Endpoint                        | Access                            |
| ------------------------------- | --------------------------------- |
| GET /reviews                    | Admin, SuperAdmin                 |
| GET /reviews/:id                | All authenticated                 |
| GET /reviews/user/:userId       | User (own), Admin, SuperAdmin     |
| GET /reviews/listing/:listingId | Public (approved only)            |
| POST /reviews                   | Customer (user role)              |
| PATCH /reviews/:id              | Customer (own), Admin, SuperAdmin |
| DELETE /reviews/:id             | Admin, SuperAdmin                 |
| PATCH /reviews/:id/moderate     | Admin, SuperAdmin                 |
| GET /reviews/pending/all        | Admin, SuperAdmin                 |
| POST /reviews/:id/response      | Vendor (own), Admin, SuperAdmin   |
| POST /reviews/:id/helpful       | Public                            |

---

## Notes

1. **Soft Delete**: Reviews are soft-deleted (marked as deleted but kept in database)
2. **Duplicate Prevention**: Users can only review each listing once
3. **Approval Required**: All reviews must be approved before being publicly visible
4. **Rating Calculation**: Average rating is calculated only from approved, non-deleted reviews
5. **Vendor Response**: Vendors can respond to reviews on their own listings
