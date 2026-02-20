import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  getListingBySlug,
  getListingsByVendorId,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getFeaturedHotels,
  getFeaturedShortlets,
  getFeaturedRestaurants,
  getFeaturedServices,
  getFeaturedEvents,
} from "../controllers/featuredListing.controller.js";

const router = express.Router();

router.get("/", getListings);
router.post("/", protect, createListing);

// FEATURED LISTINGS
router.get("/featured-hotels", getFeaturedHotels);
router.get("/featured-shortlets", getFeaturedShortlets);
router.get("/featured-restaurants", getFeaturedRestaurants);
router.get("/featured-services", getFeaturedServices);
router.get("/featured-events", getFeaturedEvents);

router.get("/vendor/:vendorId", getListingsByVendorId);

// Get listing by slug
router.get("/slug/:slug", getListingBySlug);

router.get("/:id", getListingById);
router.patch("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

export default router;
