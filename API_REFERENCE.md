# API Reference

Complete API documentation for the Ajani Platform.

## Base URL

```
/api/v1
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints Overview

### Authentication

| Endpoint                | Method | Description            | Access |
| ----------------------- | ------ | ---------------------- | ------ |
| `/auth/register`        | POST   | Register new user      | Public |
| `/auth/login`           | POST   | Login user             | Public |
| `/auth/verify-email`    | POST   | Verify email           | Public |
| `/auth/forgot-password` | POST   | Request password reset | Public |
| `/auth/reset-password`  | PATCH  | Reset password         | Public |

### Users

| Endpoint    | Method | Description         | Access        |
| ----------- | ------ | ------------------- | ------------- |
| `/users/me` | GET    | Get current user    | Authenticated |
| `/users/me` | PATCH  | Update current user | Authenticated |
| `/users/me` | DELETE | Delete current user | Authenticated |

### Listings

| Endpoint        | Method | Description       | Access              |
| --------------- | ------ | ----------------- | ------------------- |
| `/listings`     | GET    | Get all listings  | Public              |
| `/listings/:id` | GET    | Get listing by ID | Public              |
| `/listings`     | POST   | Create listing    | Vendor              |
| `/listings/:id` | PATCH  | Update listing    | Vendor (own)        |
| `/listings/:id` | DELETE | Delete listing    | Vendor (own), Admin |

### Bookings

| Endpoint               | Method | Description           | Access         |
| ---------------------- | ------ | --------------------- | -------------- |
| `/bookings`            | GET    | Get all bookings      | Authenticated  |
| `/bookings/:id`        | GET    | Get booking by ID     | Authenticated  |
| `/bookings`            | POST   | Create booking        | Customer       |
| `/bookings/:id/cancel` | PATCH  | Cancel booking        | Customer (own) |
| `/bookings/:id/status` | PATCH  | Update booking status | Vendor, Admin  |

### Reviews

| Endpoint                      | Method | Description           | Access                |
| ----------------------------- | ------ | --------------------- | --------------------- |
| `/reviews`                    | GET    | Get all reviews       | Admin, SuperAdmin     |
| `/reviews/:id`                | GET    | Get review by ID      | Authenticated         |
| `/reviews/user/:userId`       | GET    | Get user's reviews    | User (own), Admin     |
| `/reviews/listing/:listingId` | GET    | Get listing reviews   | Public                |
| `/reviews`                    | POST   | Create review         | Customer              |
| `/reviews/:id`                | PATCH  | Update review         | Customer (own), Admin |
| `/reviews/:id`                | DELETE | Soft delete review    | Admin, SuperAdmin     |
| `/reviews/:id/moderate`       | PATCH  | Approve/reject review | Admin, SuperAdmin     |
| `/reviews/pending/all`        | GET    | Get pending reviews   | Admin, SuperAdmin     |
| `/reviews/:id/response`       | POST   | Add vendor response   | Vendor (own), Admin   |
| `/reviews/:id/helpful`        | POST   | Mark as helpful       | Public                |

### Admin

| Endpoint                      | Method | Description          | Access            |
| ----------------------------- | ------ | -------------------- | ----------------- |
| `/admin/dashboard`            | GET    | Admin dashboard      | Admin, SuperAdmin |
| `/admin/users`                | GET    | Get all users        | Admin, SuperAdmin |
| `/admin/listings/pending`     | GET    | Get pending listings | Admin, SuperAdmin |
| `/admin/listings/:id/approve` | PATCH  | Approve listing      | Admin, SuperAdmin |

### Uploads

| Endpoint         | Method | Description   | Access        |
| ---------------- | ------ | ------------- | ------------- |
| `/images/upload` | POST   | Upload images | Authenticated |
| `/images/delete` | DELETE | Delete images | Authenticated |

## Detailed Documentation

For detailed documentation on specific APIs, see:

- [Authentication API](./docs/auth-api.md)
- [Booking API](./docs/BOOKING_API_COMPLETE.md)
- [Review API](./docs/REVIEW_API.md)
- [Listing API](./docs/listing-api.md)

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "fail",
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "status": "success",
  "results": 10,
  "totalCount": 50,
  "data": { ... }
}
```

## User Roles

| Role         | Description                              |
| ------------ | ---------------------------------------- |
| `user`       | Regular customer who can book and review |
| `vendor`     | Business owner who can create listings   |
| `admin`      | Platform administrator                   |
| `superadmin` | Super administrator with full access     |

## HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request succeeded                  |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 500  | Internal Server Error                   |
