import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import Booking from "../models/booking.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/errorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
const canModifyReview = (review, user) => {
  if (user.role === "admin" || user.role === "superadmin") {
    return true;
  }
  return review.user.toString() === user._id.toString();
};
const hasCompletedBooking = async (userId, listingId) => {
  const booking = await Booking.findOne({
    user: userId,
    listing: listingId,
    status: "completed",
  });
  return !!booking;
};
export const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Review.find()
      .populate("user", "firstName lastName email profilePicture")
      .populate("listing", "name category")
      .populate("moderatedBy", "firstName lastName"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;
  const totalCount = await Review.countDocuments(features.filterObj);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    totalCount,
    data: { reviews },
  });
});
export const getReviewById = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate("user", "firstName lastName email profilePicture")
    .populate("listing", "name category images location")
    .populate("moderatedBy", "firstName lastName")
    .populate("response.respondedBy", "firstName lastName businessName");

  if (!review) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.isDeleted && req.user.role !== "admin" && req.user.role !== "superadmin") {
    return next(new AppError(404, "Review not found"));
  }

  if (
    review.status !== "approved" &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin" &&
    review.user._id.toString() !== req.user._id.toString()
  ) {
    return next(new AppError(403, "You do not have permission to view this review"));
  }

  res.status(200).json({
    status: "success",
    data: { review },
  });
});
export const getReviewsByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (
    req.user.role !== "admin" &&
    req.user.role !== "superadmin" &&
    req.user._id.toString() !== userId
  ) {
    return next(new AppError(403, "You can only view your own reviews"));
  }

  let query = { user: userId };

  if (req.user.role === "user") {
    query.isDeleted = false;
  }

  const features = new APIFeatures(
    Review.find(query)
      .populate("listing", "name category images location")
      .populate("moderatedBy", "firstName lastName"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;
  const totalCount = await Review.countDocuments(query);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    totalCount,
    data: { reviews },
  });
});
export const getReviewsByListing = catchAsync(async (req, res, next) => {
  const { listingId } = req.params;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(new AppError(404, "Listing not found"));
  }

  let query = {
    listing: listingId,
    status: "approved",
    isDeleted: false,
  };

  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    query = { listing: listingId };
  }

  const features = new APIFeatures(
    Review.find(query)
      .populate("user", "firstName lastName profilePicture")
      .populate("moderatedBy", "firstName lastName")
      .populate("response.respondedBy", "firstName lastName businessName"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;
  const totalCount = await Review.countDocuments(query);

  const ratingStats = await Review.calculateAverageRating(listingId);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    totalCount,
    ratingStats,
    data: { reviews },
  });
});
export const createReview = catchAsync(async (req, res, next) => {
  const { listing, rating, title, comment, booking } = req.body;

  if (req.user.role !== "user") {
    return next(new AppError(403, "Only customers can create reviews"));
  }

  const listingDoc = await Listing.findById(listing);
  if (!listingDoc) {
    return next(new AppError(404, "Listing not found"));
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    listing,
    isDeleted: false,
  });

  if (existingReview) {
    return next(new AppError(400, "You have already reviewed this listing"));
  }

  const review = await Review.create({
    listing,
    user: req.user._id,
    booking: booking || null,
    rating,
    title,
    comment,
    status: "pending",
  });

  const populatedReview = await Review.findById(review._id)
    .populate("user", "firstName lastName email profilePicture")
    .populate("listing", "name category");

  res.status(201).json({
    status: "success",
    message: "Review submitted successfully. It will be visible after admin approval.",
    data: { review: populatedReview },
  });
});
export const updateReview = catchAsync(async (req, res, next) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.isDeleted) {
    return next(new AppError(404, "Review not found"));
  }

  if (!canModifyReview(review, req.user)) {
    return next(new AppError(403, "You can only update your own reviews"));
  }

  if (req.user.role === "user" && review.status === "approved") {
    return next(new AppError(403, "Approved reviews cannot be edited. Please contact support."));
  }

  if (rating) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment) review.comment = comment;

  if (req.user.role === "user") {
    review.status = "pending";
    review.moderatedBy = null;
    review.moderatedAt = null;
    review.moderationReason = null;
  }

  await review.save();

  const updatedReview = await Review.findById(review._id)
    .populate("user", "firstName lastName email profilePicture")
    .populate("listing", "name category")
    .populate("moderatedBy", "firstName lastName");

  res.status(200).json({
    status: "success",
    message:
      req.user.role === "user"
        ? "Review updated successfully. It will be visible after admin approval."
        : "Review updated successfully.",
    data: { review: updatedReview },
  });
});
export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.isDeleted) {
    return next(new AppError(400, "Review is already deleted"));
  }

  review.isDeleted = true;
  review.deletedAt = new Date();
  review.deletedBy = req.user._id;
  await review.save();

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
    data: null,
  });
});
export const moderateReview = catchAsync(async (req, res, next) => {
  const { status, reason } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return next(new AppError(400, "Status must be either 'approved' or 'rejected'"));
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.isDeleted) {
    return next(new AppError(400, "Cannot moderate a deleted review"));
  }

  review.status = status;
  review.moderatedBy = req.user._id;
  review.moderatedAt = new Date();
  review.moderationReason = reason || null;

  await review.save();

  const moderatedReview = await Review.findById(review._id)
    .populate("user", "firstName lastName email profilePicture")
    .populate("listing", "name category")
    .populate("moderatedBy", "firstName lastName");

  res.status(200).json({
    status: "success",
    message: `Review ${status} successfully`,
    data: { review: moderatedReview },
  });
});
export const getPendingReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Review.find({ status: "pending", isDeleted: false })
      .populate("user", "firstName lastName email profilePicture")
      .populate("listing", "name category vendorId")
      .populate("booking", "checkIn checkOut"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;
  const totalCount = await Review.countDocuments({ status: "pending", isDeleted: false });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    totalCount,
    data: { reviews },
  });
});
export const addReviewResponse = catchAsync(async (req, res, next) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return next(new AppError(400, "Response text is required"));
  }

  const review = await Review.findById(req.params.id).populate("listing", "vendorId");

  if (!review) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.isDeleted) {
    return next(new AppError(404, "Review not found"));
  }

  const isVendor =
    req.user.role === "vendor" && review.listing.vendorId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

  if (!isVendor && !isAdmin) {
    return next(new AppError(403, "You can only respond to reviews on your listings"));
  }

  review.response = {
    text,
    respondedBy: req.user._id,
    respondedAt: new Date(),
  };

  await review.save();

  const updatedReview = await Review.findById(review._id)
    .populate("user", "firstName lastName email profilePicture")
    .populate("listing", "name category")
    .populate("response.respondedBy", "firstName lastName businessName");

  res.status(200).json({
    status: "success",
    message: "Response added successfully",
    data: { review: updatedReview },
  });
});
export const markReviewHelpful = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.isDeleted) {
    return next(new AppError(404, "Review not found"));
  }

  if (review.status !== "approved") {
    return next(new AppError(400, "Can only mark approved reviews as helpful"));
  }

  review.helpfulCount += 1;
  await review.save();

  res.status(200).json({
    status: "success",
    message: "Review marked as helpful",
    data: { helpfulCount: review.helpfulCount },
  });
});
