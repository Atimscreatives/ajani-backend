import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinary.js";
import { deleteImageFromCloudinary, normalizeImages } from "../utils/imageHelpers.js";
import APIFeatures from "../utils/apiFeatures.js";

// CREATE LISTING
const createListing = catchAsync(async (req, res, next) => {
  const {
    name,
    category,
    about,
    whatWeDo,
    images,
    location,
    contactInformation,
    details,
    vendorId,
  } = req.body;

  // CHECK IF USER IS A VENDOR OR ADMIN
  if (req.user.role !== "vendor" && req.user.role !== "admin") {
    return next(new AppError(403, "You are not registered to create listings"));
  }

  // Determine which vendor ID to use for the listing
  let targetVendorId = req.user.id;

  // If admin is creating listing for another vendor
  if (req.user.role === "admin") {
    const targetVendor = await User.findById(vendorId);
    if (!vendorId) {
      return next(new AppError(400, "Vendor ID must be specified by admin"));
    }

    if (!targetVendor) {
      return next(new AppError(404, "Specified vendor not found"));
    }

    if (targetVendor.role !== "vendor") {
      return next(new AppError(400, "Specified user is not a vendor"));
    }

    if (!targetVendor.vendor || targetVendor.vendor.approvalStatus !== "approved") {
      return next(new AppError(400, "Specified vendor account is not approved"));
    }

    targetVendorId = vendorId;
  } else if (req.user.role === "vendor") {
    if (req.user.vendor && req.user.vendor.approvalStatus !== "approved") {
      return next(new AppError(403, "Your vendor account is not approved"));
    }
  }

  // CHECK IF USER CATEGORY IS NOT HOTEL (for non-admins)
  if (category === "hotel" && req.user.role !== "admin") {
    return next(
      new AppError(
        403,
        `You cannot create listing for ${category?.toUpperCase()} for now, reach out to admin`
      )
    );
  }

  // Validate required fields
  if (!name || !about || !whatWeDo || !location || !contactInformation || !details) {
    return next(new AppError(400, "Missing required fields for listing creation"));
  }

  const listing = await Listing.create({
    vendorId: targetVendorId,
    name,
    category,
    about,
    whatWeDo,
    images,
    location,
    contactInformation,
    details, // category-specific data
  });

  res.status(201).json({
    status: "success",
    message: "Listing created successfully",
    data: listing,
  });
});

// GET ALL LISTINGS
const getListings = catchAsync(async (req, res) => {
  const queryObj = req.query;
  const queryString = JSON.stringify(queryObj);
  const query = JSON.parse(queryString);

  const features = new APIFeatures(Listing.find(query), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const listings = await features.query.populate("vendorId");

  res.status(200).json({
    status: "success",
    message: "Listings retrieved successfully",
    results: listings.length,
    data: {
      listings,
    },
  });
});

// GET LISTING BY ID
const getListingById = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate("vendorId");

  if (!listing) {
    return next(new AppError(404, "Listing not found"));
  }

  res.status(200).json({
    message: "Listing retrieved successfully",
    data: listing,
  });
});

// GET LISTINGS BY VENDOR ID
const getListingsByVendorId = catchAsync(async (req, res) => {
  const listings = await Listing.find({ vendorId: req.params.vendorId });
  // .populate("vendorId");
  const totalListings = await Listing.countDocuments({ vendorId: req.params.vendorId });

  res.status(200).json({
    message: "Listings retrieved successfully",
    results: totalListings,
    data: listings,
  });
});

// UPDATE LISTING
const updateListing = catchAsync(async (req, res, next) => {
  // Find the listing first
  const listing = await Listing.findById(req.params.id);

  // CHECK IF LISTING EXISTS
  if (!listing) {
    return next(new AppError(404, "Listing not found"));
  }

  // Prepare update data
  const updateData = { ...req.body };

  // Handle category updates (No one can change category)
  if (updateData.category && updateData.category !== listing.category) {
    return next(new AppError(400, "category change is not allowed"));
  }

  // Handle vendorId updates (only admins can change vendor)
  if (updateData.vendorId && updateData.vendorId !== listing.vendorId.toString()) {
    if (req.user.role !== "admin") {
      return next(new AppError(403, "Only admins can change listing vendor"));
    }

    // Validate new vendor exists and is approved
    const newVendor = await User.findById(updateData.vendorId);
    if (!newVendor) {
      return next(new AppError(404, "New vendor not found"));
    }

    if (newVendor.role !== "vendor") {
      return next(new AppError(400, "Specified user is not a vendor"));
    }

    if (!newVendor.vendor || newVendor.vendor.approvalStatus !== "approved") {
      return next(new AppError(400, "New vendor account is not approved"));
    }
  }

  // Handle status updates (only admins can change status)
  if (updateData.status && updateData.status !== listing.status) {
    if (req.user.role !== "admin") {
      return next(new AppError(403, "Only admins can change listing status"));
    }

    const validStatuses = ["pending", "rejected", "approved"];
    if (!validStatuses.includes(updateData.status)) {
      return next(new AppError(400, "Invalid status"));
    }

    // Auto-set approvedAt if status is being set to approved
    if (updateData.status === "approved") {
      updateData.approvedAt = new Date();
    } else if (updateData.status === "pending" || updateData.status === "rejected") {
      updateData.approvedAt = null;
    }
  }

  // Handle approvedAt updates (only allowed when status is being set to approved)
  if (updateData.approvedAt && updateData.status !== "approved") {
    return next(new AppError(400, "approvedAt can only be updated when status is set to approved"));
  }

  // Handle images updates
  // if (updateData.images && Array.isArray(updateData.images)) {
  //   const oldImages = listing.images || [];
  //   const newImages = normalizeImages(updateData.images);

  //   // CHECK IF IMAGES WERE REMOVED
  //   // const oldImageIds = new Set(
  //   //   oldImages.map(img => {
  //   //     if (typeof img === "string") {
  //   //       return img;
  //   //     }
  //   //     return img.url || img.public_id;
  //   //   })
  //   // );

  //   const newImageIds = new Set(newImages.map(img => img.url || img.public_id));

  //   // CHECK IF IMAGES WERE REMOVED
  //   for (const oldImage of oldImages) {
  //     const oldId = typeof oldImage === "string" ? oldImage : oldImage.url || oldImage.public_id;
  //     if (!newImageIds.has(oldId)) {
  //       try {
  //         await deleteImageFromCloudinary(oldImage, cloudinary);
  //       } catch (error) {
  //         // CHECK IF IMAGE DELETION FAILED
  //         console.error("Failed to delete removed image from Cloudinary:", error);
  //       }
  //     }
  //   }

  //   // NORMALIZE NEW IMAGES TO ENSURE CONSISTENT FORMAT
  //   updateData.images = newImages;
  // }

  // UPDATE THE LISTING
  const updatedListing = await Listing.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Listing updated successfully",
    data: updatedListing,
  });
});

// DELETE LISTING
const deleteListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) {
    return next(new AppError(404, "Listing not found"));
  }

  // Delete all images from Cloudinary (handles both old and new formats)
  if (listing.images && Array.isArray(listing.images)) {
    for (const image of listing.images) {
      try {
        await deleteImageFromCloudinary(image, cloudinary);
      } catch (error) {
        // CHECK IF IMAGE DELETION FAILED
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }
  }

  res.status(200).json({ status: "success", message: "Listing deleted successfully" });
});

export {
  createListing,
  getListings,
  getListingById,
  getListingsByVendorId,
  updateListing,
  deleteListing,
};
