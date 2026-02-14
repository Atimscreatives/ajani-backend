import Listing from "../models/listing.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/errorHandler.js";

export const aichatController = catchAsync(async (req, res, next) => {
  const { category, amount, location } = req.body;

  if (!category || !amount || !location) {
    return next(new AppError(400, "Please provide all fields: category, amount, and location"));
  }

  const maxAmount = Number(amount);
  if (isNaN(maxAmount)) {
    return next(new AppError(400, "Amount must be a valid number"));
  }

  // Build the query
  const query = {
    category: category.toLowerCase(),
    status: "approved",
    $and: [
      {
        $or: [
          { "location.address": { $regex: location, $options: "i" } },
          { "location.area": { $regex: location, $options: "i" } },
        ],
      },
    ],
  };

  // Map category to its specific price field for budget filtering
  const amountQuery = {};
  switch (category.toLowerCase()) {
    case "hotel":
      amountQuery.$or = [
        { "details.roomTypes.salesPrice": { $lte: maxAmount } },
        { "details.roomTypes.pricePerNight": { $lte: maxAmount } },
      ];
      break;
    case "shortlet":
      amountQuery["details.pricePerNight"] = { $lte: maxAmount };
      break;
    case "restaurant":
      amountQuery["details.priceRangePerMeal.priceFrom"] = { $lte: maxAmount };
      break;
    case "services":
      amountQuery["details.pricingRange.priceFrom"] = { $lte: maxAmount };
      break;
    case "event":
      amountQuery["details.priceRange.priceFrom"] = { $lte: maxAmount };
      break;
  }

  if (Object.keys(amountQuery).length > 0) {
    query.$and.push(amountQuery);
  }

  const listingResult = await Listing.find(query);

  if (!listingResult || listingResult.length === 0) {
    return next(new AppError(404, "No listings found matching your criteria"));
  }

  res.status(200).json({
    status: "success",
    results: listingResult.length,
    data: listingResult,
  });
});
