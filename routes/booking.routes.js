import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getUserBookings,
  getVendorBookings,
} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/", createBooking);

// Admin routes - can access all bookings
router.get("/", protect, getAllBookings);

// User routes - can access their own bookings
router.get("/user", protect, getUserBookings);

// Vendor routes - can access bookings for their listings
router.get("/vendor/:vendorId", protect, getVendorBookings);

// Protected routes for specific booking operations
router
  .route("/:id")
  .get(protect, getBookingById)
  .patch(protect, updateBookingStatus)
  .delete(protect, deleteBooking);

export default router;
