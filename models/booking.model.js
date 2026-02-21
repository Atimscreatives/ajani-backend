import mongoose from "mongoose";

const CommonBookingFields = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    specialRequest: {
      type: String,
      trim: true,
      maxlength: [500, "Special request must be less than 500 characters"],
    },
  },
  { _id: false }
);

const ShortletBookingDetails = new mongoose.Schema(
  {
    shortletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    ...CommonBookingFields.obj,
  },
  { _id: false }
);

const HotelBookingDetails = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    ...CommonBookingFields.obj,
  },
  { _id: false }
);

const RestaurantBookingDetails = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    ...CommonBookingFields.obj,
  },
  { _id: false }
);

const ServicesBookingDetails = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    serviceSchedule: {
      type: Date,
      required: true,
    },
    serviceLocationType: {
      type: String,
      enum: ["residential", "commercial", "industrial"],
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    serviceDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Service description must be less than 1000 characters"],
    },
    serviceRequirement: {
      type: String,
      trim: true,
      maxlength: [500, "Service requirement must be less than 500 characters"],
    },
    ...CommonBookingFields.obj,
  },
  { _id: false }
);

const EventBookingDetails = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    ...CommonBookingFields.obj,
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message must be less than 500 characters"],
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

const ShortletBooking = Booking.discriminator("ShortletBooking", ShortletBookingDetails);
const HotelBooking = Booking.discriminator("HotelBooking", HotelBookingDetails);
const RestaurantBooking = Booking.discriminator("RestaurantBooking", RestaurantBookingDetails);
const ServicesBooking = Booking.discriminator("ServicesBooking", ServicesBookingDetails);
const EventBooking = Booking.discriminator("EventBooking", EventBookingDetails);

export default Booking;
export { ShortletBooking, HotelBooking, RestaurantBooking, ServicesBooking, EventBooking };
