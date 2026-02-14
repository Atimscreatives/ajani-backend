# Complete Ajani Booking System API Documentation

## Overview

The Ajani Booking System is a polymorphic booking platform that handles various types of bookings (Shortlet, Hotel, Restaurant, Services, Event) under a unified API structure. It includes role-based access control, email notifications, and status management.

**Base URL**: `/api/v1/bookings`

---

## 1. Authentication & Authorization

All booking endpoints require a valid JWT token.
**Headers**: `Authorization: Bearer <token>`

| Role       | Permissions                                                     |
| ---------- | --------------------------------------------------------------- |
| **User**   | Create bookings, View own bookings, Cancel own pending bookings |
| **Vendor** | View bookings for their listings, Update booking status         |
| **Admin**  | View all bookings, Update any status, Delete any booking        |

---

## 2. Booking Data Models

All bookings share common fields but differ in their `details` object based on the `category`.

### Common Fields

| Field      | Type   | Required | Description                                                  |
| ---------- | ------ | -------- | ------------------------------------------------------------ |
| `category` | String | Yes      | Enum: `shortlet`, `hotel`, `restaurant`, `services`, `event` |
| `message`  | String | No       | Message to the vendor                                        |
| `details`  | Object | Yes      | Specific booking details (see below)                         |

### Common Details Fields (Inside `details` object)

| Field            | Type   | Required | Description              |
| ---------------- | ------ | -------- | ------------------------ |
| `firstName`      | String | Yes      | Guest first name         |
| `lastName`       | String | Yes      | Guest last name          |
| `email`          | String | Yes      | Guest email              |
| `phoneNumber`    | String | Yes      | Guest phone              |
| `specialRequest` | String | No       | Any special requirements |

### Category-Specific Detail Fields

#### 1. Shortlet (`category: "shortlet"`)

| Field        | Type     | Required | Description                |
| ------------ | -------- | -------- | -------------------------- |
| `shortletId` | ObjectId | Yes      | ID of the Shortlet Listing |

#### 2. Hotel (`category: "hotel"`)

| Field     | Type     | Required | Description             |
| --------- | -------- | -------- | ----------------------- |
| `hotelId` | ObjectId | Yes      | ID of the Hotel Listing |

#### 3. Restaurant (`category: "restaurant"`)

| Field           | Type     | Required | Description                  |
| --------------- | -------- | -------- | ---------------------------- |
| `restaurantId`  | ObjectId | Yes      | ID of the Restaurant Listing |
| `date`          | Date     | Yes      | Reservation date & time      |
| `numberOfGuest` | Number   | Yes      | Party size (min 1)           |

#### 4. Services (`category: "services"`)

| Field                 | Type     | Required | Description                                     |
| --------------------- | -------- | -------- | ----------------------------------------------- |
| `serviceId`           | ObjectId | Yes      | ID of the Service Listing                       |
| `serviceSchedule`     | Date     | Yes      | Requested schedule date/time                    |
| `serviceLocationType` | String   | Yes      | Enum: `residential`, `commercial`, `industrial` |
| `streetAddress`       | String   | Yes      | Service address                                 |
| `city`                | String   | Yes      | City                                            |
| `state`               | String   | Yes      | State                                           |
| `serviceDescription`  | String   | Yes      | Description of work needed                      |
| `postalCode`          | String   | No       | Postal Code                                     |
| `serviceRequirement`  | String   | No       | Specific requirements                           |

#### 5. Event (`category: "event"`)

| Field       | Type     | Required | Description                |
| ----------- | -------- | -------- | -------------------------- |
| `eventId`   | ObjectId | Yes      | ID of the Event Listing    |
| `eventName` | String   | Yes      | Name of the event          |
| `eventDate` | Date     | Yes      | Date of the event          |
| `startTime` | String   | Yes      | Start time (e.g., "14:00") |
| `endTime`   | String   | Yes      | End time (e.g., "18:00")   |
| `country`   | String   | Yes      | Country location           |
| `city`      | String   | Yes      | City location              |
| `state`     | String   | Yes      | State location             |

---

## 3. Endpoints

### Create Booking

**POST** `/`
Creates a new booking. The `details` object must match the `category` schema.

**Payload Example (Event):**

```json
{
  "category": "event",
  "details": {
    "eventId": "65c4...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@email.com",
    "phoneNumber": "08012345678",
    "eventName": "Birthday Bash",
    "eventDate": "2024-12-25",
    "startTime": "18:00",
    "endTime": "22:00",
    "country": "Nigeria",
    "state": "Lagos",
    "city": "Ikeja"
  },
  "message": "Please ensure the sound system is ready."
}
```

**Payload Example (Restaurant):**

```json
{
  "category": "restaurant",
  "details": {
    "restaurantId": "65c4...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@email.com",
    "phoneNumber": "08012345678",
    "date": "2024-03-15T19:00:00Z",
    "numberOfGuest": 4
  }
}
```

### Get My Bookings (User)

**GET** `/user`
Returns all bookings associated with the authenticated user's email.
_Note: The system currently links bookings via the email provided in `details.email`, so ensure the user's booking email matches their account email._

### Get Vendor Bookings

**GET** `/vendor/:vendorId`
Returns all bookings where the listing belongs to the specified vendor.

### Get All Bookings (Admin)

**GET** `/`
Returns every booking in the database.

### Get Booking by ID

**GET** `/:id`
Returns full details of a specific booking.

### Update Booking Status

**PATCH** `/:id`
Updates the status of a booking.
**Body:** `{ "status": "pending" | "approved" | "rejected" | "cancelled" }`
_Triggers email notifications to User and Vendor._

### Delete Booking

**DELETE** `/:id`
Permanently removes a booking.

---

## 4. End-to-End Booking Flow

### Step 1: User Selection

The user browses listings. Upon clicking "Book Now", the frontend identifies the `category` of the listing (e.g., "hotel").

### Step 2: Form submission

The frontend presents a form tailored to that category.

- **Restaurant**: Asks for Date, Time, Guests.
- **Event**: Asks for Event Name, Date, Start/End Times, Location.
- **Service**: Asks for Address, Location Type, Description.
- **Shortlet/Hotel**: Asks for Contact Info (Date logic might be handled via availability checks before this step, but basic contact info is collected here).

### Step 3: API Request

Frontend sends `POST /api/v1/bookings` with the `category` and `details`.

### Step 4: Server Processing

1.  **Validation**: Server validates presence of required fields for that specific category.
2.  **Creation**: Database document is created.
3.  **Notification**:
    - **User** receives a "Booking Received" email.
    - **Vendor** receives a "New Booking Request" email.

### Step 5: Vendor Action

1.  Vendor logs in and views their dashboard (`GET /vendor/:vendorId`).
2.  Vendor sees the new "pending" booking.
3.  Vendor approves or rejects the booking (`PATCH /:id` with status `approved` or `rejected`).

### Step 6: Confirmation

1.  Server updates status.
2.  **User** receives an email: "Your booking at [Listing Name] is CONFIRMED" (or Rejected).
3.  **Vendor** receives a confirmation copy.

---

## 5. Integration Notes for Frontend Developers

- **Dates**: Send dates in ISO format (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ`) or standard date strings that Javascript `Date` can parse.
- **Event Fields**: Note that `startTime` and `endTime` are **Strings** (e.g., "14:00"), not Date objects, while `eventDate` is a **Date** object.
- **Services**: `serviceLocationType` must be one of strictly: `residential`, `commercial`, `industrial`.
- **Error Handling**: Wrap requests in `try/catch`. 400 errors usually mean validation failed (check the `message` field in response).
