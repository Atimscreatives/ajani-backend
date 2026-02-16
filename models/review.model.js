import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title must be less than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment must be less than 1000 characters"],
    },
    // Approval workflow fields
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    moderatedAt: {
      type: Date,
      default: null,
    },
    moderationReason: {
      type: String,
      trim: true,
      default: null,
    },
    // Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Helpful count
    helpfulCount: {
      type: Number,
      default: 0,
    },
    // Response from vendor/admin
    response: {
      text: {
        type: String,
        trim: true,
        maxlength: [500, "Response must be less than 500 characters"],
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      respondedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient queries
reviewSchema.index({ listing: 1, status: 1, isDeleted: 1 });
reviewSchema.index({ user: 1, status: 1, isDeleted: 1 });
reviewSchema.index({ status: 1, isDeleted: 1, createdAt: -1 });

// Prevent duplicate reviews from same user on same listing
reviewSchema.index(
  { listing: 1, user: 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Static method to calculate average rating for a listing
reviewSchema.statics.calculateAverageRating = async function (listingId) {
  const stats = await this.aggregate([
    {
      $match: {
        listing: new mongoose.Types.ObjectId(listingId),
        status: "approved",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$listing",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  return stats.length > 0
    ? { averageRating: Math.round(stats[0].avgRating * 10) / 10, numReviews: stats[0].numReviews }
    : { averageRating: 0, numReviews: 0 };
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
