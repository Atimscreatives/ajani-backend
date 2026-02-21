import Booking, {
  ShortletBooking,
  HotelBooking,
  RestaurantBooking,
  ServicesBooking,
  EventBooking,
} from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/errorHandler.js";
import sendEmailResend from "../utils/resend.js";
import {
  userBookingConfirmationTemplate,
  vendorBookingNotificationTemplate,
  adminBookingNotificationTemplate,
} from "../utils/bookingEmailTemplates.js";

const validateBookingData = (category, details) => {
  const errors = [];

  if (!details.firstName || details.firstName.trim().length === 0) {
    errors.push("First name is required");
  }
  if (!details.lastName || details.lastName.trim().length === 0) {
    errors.push("Last name is required");
  }
  if (!details.email || !details.email.includes("@")) {
    errors.push("Valid email is required");
  }
  if (!details.phoneNumber || details.phoneNumber.trim().length === 0) {
    errors.push("Phone number is required");
  }

  switch (category) {
    case "shortlet":
      if (!details.shortletId) {
        errors.push("Shortlet ID is required");
      }
      break;
    case "hotel":
      if (!details.hotelId) {
        errors.push("Hotel ID is required");
      }
      break;
    case "restaurant":
      if (!details.restaurantId) {
        errors.push("Restaurant ID is required");
      }
      if (!details.date) {
        errors.push("Booking date is required");
      }
      if (!details.numberOfGuests || details.numberOfGuests < 1) {
        errors.push("Number of guests must be at least 1");
      }
      break;
    case "services":
      if (!details.serviceId) {
        errors.push("Service ID is required");
      }
      if (!details.serviceSchedule) {
        errors.push("Service schedule is required");
      }
      if (!details.serviceLocationType) {
        errors.push("Service location type is required");
      }
      if (!details.streetAddress) {
        errors.push("Street address is required");
      }
      if (!details.city) {
        errors.push("City is required");
      }
      if (!details.state) {
        errors.push("State is required");
      }
      if (!details.serviceDescription) {
        errors.push("Service description is required");
      }
      break;
    case "event":
      if (!details.eventId) {
        errors.push("Event ID is required");
      }
      if (!details.eventDate) {
        errors.push("Event date is required");
      }
      if (!details.startTime) {
        errors.push("Start time is required");
      }
      if (!details.endTime) {
        errors.push("End time is required");
      }
      break;
    default:
      errors.push("Invalid booking category");
  }

  return errors;
};

// Send email notifications for booking events
const sendBookingNotifications = async (booking, listing, status) => {
  try {
    // Get vendor details
    const vendor = await User.findById(listing.vendorId);

    // Send email to user

    await sendEmailResend({
      to: booking.email,
      subject: `Booking ${status === "pending" ? "Received" : status} - ${listing.name}`,
      html: userBookingConfirmationTemplate(booking.firstName, booking, listing, status),
    });

    // Send email to vendor
    if (vendor && vendor.email) {
      await sendEmailResend({
        to: vendor.email,
        subject: `New Booking Request - ${listing.name}`,
        html: vendorBookingNotificationTemplate(vendor.firstName, booking, listing, status),
      });
    }

    // Send email to admin (optional - you can configure admin emails)
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    for (const adminEmail of adminEmails) {
      if (adminEmail.trim()) {
        await sendEmailResend({
          to: adminEmail.trim(),
          subject: `Booking Activity - ${listing.name}`,
          html: adminBookingNotificationTemplate(booking, listing, status),
        });
      }
    }
  } catch (error) {
    console.error("Error sending booking notifications:", error);
    // Don't throw error - email failures shouldn't break the booking process
  }
};

const createBooking = catchAsync(async (req, res) => {
  const { details, message } = req.body;

  if (!details) {
    throw new AppError(400, "Booking details are required");
  }

  const listing = await Listing.findById(
    details.shortletId ||
      details.hotelId ||
      details.restaurantId ||
      details.serviceId ||
      details.eventId
  );

  if (!listing) {
    throw new AppError(400, "Listing not found");
  }

  const category = listing.category;

  if (!category) {
    throw new AppError(400, "Booking category is required");
  }

  const validationErrors = validateBookingData(category, details);
  if (validationErrors.length > 0) {
    throw new AppError(400, `Validation failed: ${validationErrors.join(", ")}`);
  }

  let BookingModel;
  switch (category) {
    case "shortlet":
      BookingModel = ShortletBooking;
      break;
    case "hotel":
      BookingModel = HotelBooking;
      break;
    case "restaurant":
      BookingModel = RestaurantBooking;
      break;
    case "services":
      BookingModel = ServicesBooking;
      break;
    case "event":
      BookingModel = EventBooking;
      break;
    default:
      throw new AppError(400, "Invalid booking category");
  }

  const bookingData = {
    category,
    message,
    ...details,
  };

  const booking = await BookingModel.create(bookingData);
  // Send email notifications
  await sendBookingNotifications(booking, listing, "pending");

  res.status(201).json({
    message: "Booking created successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  if (req.user.role !== "vendor" && req.user.role !== "admin" && req.user.role !== "superadmin") {
    return next(new AppError(403, "You are not authorized to view all bookings"));
  }

  const bookings = await Booking.find().populate(
    "shortletId hotelId restaurantId serviceId eventId",
    "name category"
  );

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).populate(
    "shortletId hotelId restaurantId serviceId eventId",
    "name category"
  );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: booking,
  });
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== "vendor" && req.user.role !== "admin" && req.user.role !== "superadmin") {
    return next(new AppError(403, "You are not authorized to update booking status"));
  }

  const validStatuses = ["pending", "approved", "rejected", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Send email notifications for status updates
  const listing = await Listing.findById(
    booking.shortletId ||
      booking.hotelId ||
      booking.restaurantId ||
      booking.serviceId ||
      booking.eventId
  );

  if (listing) {
    await sendBookingNotifications(booking, listing, status);
  }

  res.status(200).json({
    status: "success",
    message: "Booking status updated successfully",
    data: booking,
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findByIdAndDelete(id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Booking deleted successfully",
  });
});

const getUserBookings = catchAsync(async (req, res) => {
  const { email } = req.body;

  const bookings = await Booking.find({ email: email })
    .populate("vendorId", "firstName lastName email")
    .populate(
      "details.shortletId details.hotelId details.restaurantId details.serviceId details.eventId",
      "name category"
    );

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

const getVendorBookings = catchAsync(async (req, res) => {
  const vendorId = req.params.vendorId;

  const vendorListings = await Listing.find({
    vendorId,
  }).select("_id");

  const listingIds = vendorListings.map(l => l._id);

  const bookings = await Booking.find({
    $or: [
      { hotelId: { $in: listingIds } },
      { restaurantId: { $in: listingIds } },
      { shortletId: { $in: listingIds } },
      { serviceId: { $in: listingIds } },
      { eventId: { $in: listingIds } },
    ],
  });

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

export {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getUserBookings,
  getVendorBookings,
};
