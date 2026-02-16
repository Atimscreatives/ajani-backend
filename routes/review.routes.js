import express from "express";
import {
  getAllReviews,
  getReviewById,
  getReviewsByUser,
  getReviewsByListing,
  createReview,
  updateReview,
  deleteReview,
  moderateReview,
  getPendingReviews,
  addReviewResponse,
  markReviewHelpful,
} from "../controllers/review.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/listing/:listingId", getReviewsByListing);
router.post("/:id/helpful", markReviewHelpful);
router.use(protect);
router.get("/", authorize("admin", "superadmin"), getAllReviews);
router.get("/pending/all", authorize("admin", "superadmin"), getPendingReviews);
router.get("/:id", getReviewById);
router.get("/user/:userId", getReviewsByUser);
router.post("/", authorize("user"), createReview);
router.patch("/:id", updateReview);
router.patch("/:id/moderate", authorize("admin", "superadmin"), moderateReview);
router.post("/:id/response", addReviewResponse);
router.delete("/:id", authorize("admin", "superadmin"), deleteReview);

export default router;
