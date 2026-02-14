# Ajani Booking System Implementation

This document provides a comprehensive overview of the booking system implementation with user authentication and email notifications.

## 🎯 Features Implemented

### ✅ User Authentication & Booking

- **User Login Required**: All booking operations require authenticated users
- **JWT Token Authentication**: Secure authentication using JWT tokens
- **User-Specific Bookings**: Users can only view and manage their own bookings
- **Vendor Access**: Vendors can view bookings for their listings

### ✅ Email Notifications System

- **User Confirmation**: Automatic email sent to users when booking is created
- **Vendor Notifications**: Vendors receive notifications for new bookings
- **Status Updates**: Email notifications when booking status changes (approved/rejected/cancelled)
- **Admin Notifications**: Admins receive activity reports for all bookings
- **Professional Templates**: Beautiful, responsive email templates for all notification types

### ✅ Polymorphic Booking Support

- **Shortlet Bookings**: Vacation rental bookings with check-in/check-out dates
- **Hotel Bookings**: Hotel room reservations with room types
- **Restaurant Bookings**: Restaurant reservations with party size and time
- **Service Bookings**: Professional service bookings with scheduling
- **Event Bookings**: Event space bookings with date ranges and equipment needs

## 📁 File Structure

```
├── controllers/
│   └── booking.controller.js          # Enhanced with email notifications
├── utils/
│   ├── bookingEmailTemplates.js       # Professional email templates
│   ├── resend.js                      # Email sending utility
│   └── emailTemplates.js              # Existing email templates
├── models/
│   └── booking.model.js               # Polymorphic booking models
├── routes/
│   └── booking.routes.js              # Protected booking routes
└── BOOKING_SYSTEM_README.md           # This documentation
```

## 🔧 Technical Implementation

### Authentication Integration

The booking system integrates seamlessly with the existing authentication system:

```javascript
// All booking routes are protected
app.post("/api/bookings", protect, createBooking);
app.get("/api/bookings/user", protect, getUserBookings);
app.get("/api/bookings/vendor/:vendorId", protect, getVendorBookings);
app.put("/api/bookings/:id/status", protect, updateBookingStatus);
```

### Email Notification System

The system uses Resend for email delivery with comprehensive templates:

```javascript
// Email templates for different stakeholders
- userBookingConfirmationTemplate: User confirmation emails
- vendorBookingNotificationTemplate: Vendor notification emails
- adminBookingNotificationTemplate: Admin activity reports
```

### Polymorphic Booking Models

The system supports 5 different booking types with shared base functionality:

```javascript
// Booking types supported
- ShortletBooking: Vacation rentals
- HotelBooking: Hotel reservations
- RestaurantBooking: Restaurant bookings
- ServicesBooking: Professional services
- EventBooking: Event space bookings
```

## 🚀 API Endpoints

### Authentication (Required for all booking operations)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Booking Operations

#### Create Booking

```http
POST /api/bookings
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "details": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+2348012345678",
    "shortletId": "listing_id_here",
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-20",
    "numberOfGuests": 2
  },
  "message": "Looking forward to staying at your beautiful shortlet!"
}
```

#### Get User Bookings

```http
GET /api/bookings/user
Authorization: Bearer your_jwt_token
```

#### Get Vendor Bookings

```http
GET /api/bookings/vendor/:vendorId
Authorization: Bearer your_jwt_token
```

#### Update Booking Status

```http
PUT /api/bookings/:id/status
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "status": "approved"  // pending, approved, rejected, cancelled
}
```

## 📧 Email Notification Examples

### User Booking Confirmation

When a user creates a booking, they receive a confirmation email with:

- Booking details and status
- Listing information
- Next steps based on booking status
- Professional styling with Ajani branding

### Vendor Notification

Vendors receive notifications for new bookings with:

- Customer contact information
- Booking details
- Action required prompt
- Link to vendor dashboard

### Status Update Notifications

When booking status changes, both users and vendors receive:

- Updated status information
- Next steps or instructions
- Contact information for questions

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
EMAIL_USER=your_email@domain.com
FRONTEND_URL=https://your-frontend-domain.com

# Optional Admin Notifications
ADMIN_EMAILS=admin1@domain.com,admin2@domain.com

# Database
MONGODB_URI=mongodb://localhost:27017/ajani
```

### Email Service Setup

The system uses Resend for email delivery. To configure:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Configure your sending domain
4. Set the RESEND_API_KEY environment variable

## 🧪 Testing

### Test Server

A test server is available to demonstrate the booking flow:

```bash
node test-booking-flow.js
```

Visit: `http://localhost:5000/api/test/booking-flow`

### Test Data Examples

The test server provides examples for all booking types:

- Shortlet booking with check-in/check-out dates
- Hotel booking with room type preferences
- Restaurant reservation with party size
- Service booking with scheduling
- Event booking with equipment needs

## 🔄 Booking Flow

### 1. User Authentication

1. User logs in with email and password
2. JWT token is returned
3. Token is used for all subsequent booking operations

### 2. Booking Creation

1. User submits booking request with required details
2. System validates booking data
3. Booking is created in the database
4. Email notifications are sent to user and vendor
5. Admin notification is sent (if configured)

### 3. Booking Management

1. Users can view their bookings
2. Vendors can view bookings for their listings
3. Vendors can update booking status
4. Status changes trigger email notifications

### 4. Email Notifications

1. **On Creation**: User confirmation + Vendor notification
2. **On Status Change**: User + Vendor notifications
3. **Admin Reports**: All booking activities (optional)

## 🛡️ Security Features

- **Authentication Required**: All booking operations require valid JWT tokens
- **Authorization**: Users can only access their own bookings
- **Input Validation**: Comprehensive validation for all booking data
- **Email Security**: Professional email templates prevent phishing
- **Error Handling**: Graceful error handling without exposing sensitive data

## 📱 Frontend Integration

### React Example

```javascript
// Login and get token
const login = async (email, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
};

// Create booking
const createBooking = async bookingData => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  return await response.json();
};

// Get user bookings
const getUserBookings = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/bookings/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
```

## 🎨 Email Templates

The system includes three professional email templates:

1. **User Booking Confirmation**: Clean, informative template for users
2. **Vendor Notification**: Action-oriented template for vendors
3. **Admin Report**: Summary template for administrators

All templates are:

- Mobile-responsive
- Branded with Ajani colors
- Include appropriate calls-to-action
- Handle different booking statuses appropriately

## 🔧 Maintenance

### Monitoring Email Delivery

- Check Resend dashboard for delivery statistics
- Monitor email bounce rates
- Review spam complaint rates

### Database Maintenance

- Regular backup of booking data
- Monitor booking volume and performance
- Clean up old cancelled bookings as needed

### Security Updates

- Keep JWT secret secure and rotate periodically
- Monitor for authentication issues
- Review access logs for suspicious activity

## 🚀 Future Enhancements

Potential future improvements:

- Booking reminders (24 hours before)
- Calendar integration for users
- Payment integration for bookings
- Review and rating system
- Booking analytics dashboard
- Mobile app notifications

## 📞 Support

For questions or issues with the booking system:

1. Check the API documentation
2. Review the test examples
3. Verify environment configuration
4. Check email delivery logs
5. Contact the development team

---

**Note**: This booking system is fully integrated with the existing Ajani authentication and email infrastructure, providing a seamless experience for users, vendors, and administrators.
