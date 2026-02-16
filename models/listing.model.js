import mongoose from "mongoose";
import validator from "validator";
import { normalizeImages } from "../utils/imageHelpers.js";

// Hotel Details Schema
const HotelDetailsSchema = new mongoose.Schema(
  {
    roomTypes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        bedType: {
          type: String,
          required: true,
          trim: true,
        },
        roomType: {
          type: String,
          required: true,
          trim: true,
        },
        view: {
          type: String,
          trim: true,
        },
        pricePerNight: {
          type: Number,
          required: true,
        },
        discountedRate: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        basePrice: {
          type: Number,
          required: true,
        },
        salesPrice: {
          type: Number,
        },
        breakfastIncluded: {
          type: Boolean,
          default: false,
        },
        breakfastCost: {
          type: Number,
          required: true,
        },
        amenities: {
          type: [String],
          minlength: [2, "Amenities array must have at least 2 amenities"],
          maxlength: [10, "Amenities array can have a maximum of 10 amenities"],
          default: [],
        },
        maxOccupancy: {
          type: Number,
          required: true,
          min: 1,
        },
        roomImages: {
          type: [String],
          default: [],
          maxlength: [10, "Room images array can have a maximum of 10 images"],
          validate: {
            validator: function (v) {
              return v.every(img => validator.isURL(img));
            },
            message: "All room images must be valid URLs",
          },
        },
        status: {
          type: String,
          enum: ["available", "unavailable"],
          default: "available",
        },
      },
    ],
  },
  { _id: false }
);

// Shortlet Details Schema
const ShortletDetailsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    roomTypes: {
      type: [String],
      required: true,
    },
    bedType: {
      type: String,
      required: true,
    },
    bathroomsAvailable: {
      type: Boolean,
      default: false,
    },
    kitchenAvailable: {
      type: Boolean,
      default: false,
    },
    livingRoomAvailable: {
      type: Boolean,
      default: false,
    },
    balconyAvailable: {
      type: Boolean,
      default: false,
    },
    airConditioning: {
      type: Boolean,
      default: false,
    },
    wifiAvailable: {
      type: Boolean,
      default: false,
    },
    smartTV: {
      type: Boolean,
      default: false,
    },
    powerSupplyType: {
      type: String,
      required: true,
    },
    securityAvailable: {
      type: Boolean,
      default: false,
    },
    parkingAvailable: {
      type: Boolean,
      default: false,
    },
    cleaningService: {
      type: Boolean,
      default: false,
    },
    laundryService: {
      type: Boolean,
      default: false,
    },
    swimmingPool: {
      type: Boolean,
      default: false,
    },
    gym: {
      type: Boolean,
      default: false,
    },
    otherAmenities: {
      type: [String],
      default: [],
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    pricePerWeek: {
      type: Number,
    },
    minimumStayDuration: {
      type: String,
    },
    refundPolicy: {
      type: String,
    },
    houseRules: {
      type: String,
    },
    maximumGuestCapacity: {
      type: Number,
    },
    propertyPhotos: {
      type: [String],
      default: [],
      maxlength: [10, "Property photos array can have a maximum of 10 images"],
      validate: {
        validator: function (v) {
          return v.every(img => validator.isURL(img));
        },
        message: "All property photos must be valid URLs",
      },
    },
    roomPhotos: {
      type: [String],
      default: [],
      maxlength: [10, "Room photos array can have a maximum of 10 images"],
      validate: {
        validator: function (v) {
          return v.every(img => validator.isURL(img));
        },
        message: "All room photos must be valid URLs",
      },
    },
    googleMapsLink: {
      type: String,
      validate: [validator.isURL, "Please provide a valid Google Maps link"],
    },
  },
  { _id: false }
);

// Restaurant Details Schema
const RestaurantDetailsSchema = new mongoose.Schema(
  {
    yearsOfOperation: {
      type: Number,
      required: true,
    },
    cuisineType: {
      type: [String],
      required: true,
    },
    dineInService: {
      type: Boolean,
      default: false,
    },
    takeawayService: {
      type: Boolean,
      default: false,
    },
    deliveryService: {
      type: Boolean,
      default: false,
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    operatingDays: {
      type: [String],
      required: true,
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    peakHours: {
      type: String,
      required: true,
    },
    menuCategories: {
      type: [String],
      required: true,
    },
    priceRangePerMeal: {
      priceFrom: {
        type: Number,
        required: true,
      },
      priceTo: {
        type: Number,
        required: true,
      },
    },
    specialMeals: {
      type: [String],
      required: true,
    },
    cateringService: {
      type: Boolean,
      default: false,
    },
    airConditioning: {
      type: Boolean,
      default: false,
    },
    parkingSpace: {
      type: Boolean,
      default: false,
    },
    cleanRestrooms: {
      type: Boolean,
      default: false,
    },
    powerSupplyType: {
      type: String,
      required: true,
    },
    posCardPaymentAvailable: {
      type: Boolean,
      default: false,
    },
    wifiAvailable: {
      type: Boolean,
      default: false,
    },
    outdoorSeating: {
      type: Boolean,
      default: false,
    },
    deliveryCoverageArea: {
      type: String,
      required: true,
    },
    averagePreparationTime: {
      type: Number,
      required: true,
    },
    deliveryTimeEstimate: {
      type: Number,
      required: true,
    },
    packagingQualityStandard: {
      type: String,
      required: true,
    },
    deliveryFeePolicy: {
      type: String,
      required: true,
    },
    restaurantLogo: {
      type: String,
      validate: [validator.isURL, "Please provide a valid logo URL"],
    },
    foodPhotos: {
      type: [String],
      default: [],
      maxlength: [10, "Restaurant photos array can have a maximum of 10 images"],
      validate: {
        validator: function (v) {
          return v.every(img => validator.isURL(img));
        },
        message: "All restaurant photos must be valid URLs",
      },
    },
    restaurantInteriorPhotos: {
      type: [String],
      default: [],
      maxlength: [10, "Menu photos array can have a maximum of 10 images"],
      validate: {
        validator: function (v) {
          return v.every(img => validator.isURL(img));
        },
        message: "All menu photos must be valid URLs",
      },
    },
  },
  { _id: false }
);

// Service Details Schema
const ServiceDetailsSchema = new mongoose.Schema(
  {
    serviceCategory: {
      type: String,
      required: true,
    },
    businessDescription: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
    },
    cacRegistered: {
      type: Boolean,
      default: false,
    },
    cacNumber: {
      type: String,
    },
    listOfServices: {
      type: [String],
      required: true,
    },
    pricingRange: {
      priceFrom: {
        type: Number,
        required: true,
      },
      priceTo: {
        type: Number,
        required: true,
      },
    },
    operatingHours: {
      type: String,
    },
    businessPhotos: {
      type: [String],
      default: [],
      maxlength: [10, "Business photos array can have a maximum of 10 images"],
      validate: {
        validator: function (v) {
          return v.every(img => validator.isURL(img));
        },
        message: "All business photos must be valid URLs",
      },
    },
    businessLogo: {
      type: String,
      validate: [validator.isURL, "Please provide a valid logo URL"],
    },
  },
  { _id: false }
);

// Event Details Schema
const EventDetailsSchema = new mongoose.Schema(
  {
    eventType: [
      {
        hallType: {
          type: String,
          enum: ["indoor", "outdoor", "both"],
          required: true,
        },
        minGuestCapacity: {
          type: Number,
          required: true,
        },
        maxGuestCapacity: {
          type: Number,
          required: true,
        },
        hallDescription: {
          type: String,
          required: true,
          trim: true,
        },
        priceRange: {
          priceFrom: {
            type: Number,
            required: true,
          },
          priceTo: {
            type: Number,
            required: true,
          },
        },
        minimumBookingDuration: {
          type: String,
        },
        requiredDeposit: {
          type: Number,
          min: 0,
          max: 100,
        },
        refundPolicy: {
          type: String,
        },
        hallPhotos: {
          type: [String],
          default: [],
          maxlength: [10, "Hall photos array can have a maximum of 10 images"],
          validate: {
            validator: function (v) {
              return v.every(img => validator.isURL(img));
            },
            message: "All hall photos must be valid URLs",
          },
        },
        eventSetupPhotos: {
          type: [String],
          default: [],
          maxlength: [10, "Event setup photos array can have a maximum of 10 images"],
          validate: {
            validator: function (v) {
              return v.every(img => validator.isURL(img));
            },
            message: "All event setup photos must be valid URLs",
          },
        },
      },
    ],
    numberOfHalls: {
      type: Number,
      required: true,
    },
    parkingCapacity: {
      type: Number,
    },
    airConditioning: {
      type: Boolean,
      default: false,
    },
    powerSupplyType: {
      type: String,
    },
    stageAvailable: {
      type: Boolean,
      default: false,
    },
    lightingAvailable: {
      type: Boolean,
      default: false,
    },
    soundSystem: {
      type: Boolean,
      default: false,
    },
    changingRoom: {
      type: Boolean,
      default: false,
    },
    toiletsAvailable: {
      type: Boolean,
      default: false,
    },
    securityAvailable: {
      type: Boolean,
      default: false,
    },
    decorationsAllowed: {
      type: Boolean,
      default: false,
    },
    cateringOption: {
      type: String,
      enum: ["in-house", "external", "both"],
    },
    supportedEventTypes: {
      type: [String],
      required: true,
    },
    googleMapsLink: {
      type: String,
      validate: [validator.isURL, "Please provide a valid Google Maps link"],
    },
  },
  { _id: false }
);

// Main Listing Schema
const listingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor is required"],
    },

    category: {
      type: String,
      enum: ["hotel", "restaurant", "shortlet", "services", "event"],
      required: [true, "Category is required"],
      lowercase: true,
    },

    name: {
      type: String,
      required: [true, "Listing name is required"],
      trim: true,
    },

    about: {
      type: String,
      trim: true,
      required: [true, "About section is required"],
      maxlength: [500, "About section must be less than 500 characters"],
      minlength: [10, "About section must be at least 10 characters"],
    },

    whatWeDo: {
      type: String,
      trim: true,
      required: [true, "What we do section is required"],
      maxlength: [1000, "What we do section must be less than 1000 characters"],
      minlength: [20, "What we do section must be at least 20 characters"],
    },

    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      area: {
        type: String,
        required: [true, "Area is required"],
        trim: true,
      },
      geolocation: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },

    contactInformation: {
      phone: {
        type: String,
        validate: [validator.isMobilePhone, "Please provide a valid phone number"],
        trim: true,
      },
      whatsapp: {
        type: String,
        validate: [validator.isMobilePhone, "Please provide a valid WhatsApp number"],
        trim: true,
      },
      email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid email"],
        trim: true,
      },
    },

    images: {
      type: mongoose.Schema.Types.Mixed,
      validate: [
        {
          validator: function (val) {
            if (!Array.isArray(val)) {
              return false;
            }
            // Accept both formats: URL strings or objects with url/public_id
            return val.every(
              img =>
                typeof img === "string" ||
                (typeof img === "object" && img !== null && (img.url || img.public_id))
            );
          },
          message: "Images must be an array of URL strings or objects with url/public_id",
        },
        {
          validator: function (val) {
            return Array.isArray(val) && val.length >= 1;
          },
          message: "At least one image is required",
        },
        {
          validator: function (val) {
            return Array.isArray(val) && val.length <= 10;
          },
          message: "Maximum 10 images are allowed",
        },
      ],
    },

    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// Normalize images to new format (objects with url and public_id) before saving
listingSchema.pre("save", function () {
  if (this.images && Array.isArray(this.images)) {
    const normalized = normalizeImages(this.images);
    if (normalized.length > 0) {
      this.images = normalized;
    }
  }
});

// Automatically calculate salesPrice for hotel listings based on basePrice and discountedRate
listingSchema.pre("save", function (next) {
  // Only process if this is a hotel listing and has details
  if (this.category === "hotel" && this.details && this.details.roomTypes) {
    // Process each room type in the hotel
    this.details.roomTypes = this.details.roomTypes.map(roomType => {
      // Only calculate salesPrice if basePrice is provided
      if (roomType.basePrice !== undefined) {
        const basePrice = roomType.basePrice;
        const discountedRate = roomType.discountedRate || 0;

        // Calculate salesPrice: basePrice - (basePrice * discountedRate / 100)
        const salesPrice = basePrice - (basePrice * discountedRate) / 100;

        // Round to nearest whole number to avoid floating point issues
        roomType.salesPrice = Math.round(salesPrice);
      }

      return roomType;
    });
  }

  next();
});

// Validate details based on category before saving
listingSchema.pre("validate", function () {
  const categorySchemas = {
    hotel: HotelDetailsSchema,
    shortlet: ShortletDetailsSchema,
    restaurant: RestaurantDetailsSchema,
    services: ServiceDetailsSchema,
    event: EventDetailsSchema,
  };

  const schema = categorySchemas[this.category];

  if (!schema) {
    this.invalidate("category", "Invalid listing category");
    return;
  }

  if (!this.details) {
    this.invalidate("details", "Details are required for this category");
    return;
  }

  // Create a temporary document WITHOUT registering a model
  const tempDoc = new mongoose.Document(this.details, schema);
  const validationError = tempDoc.validateSync();

  if (validationError) {
    Object.values(validationError.errors).forEach(err => {
      this.invalidate(`details.${err.path}`, err.message);
    });
  }
});

// Ensure unique name and vendorId combination
listingSchema.index({ name: 1, vendorId: 1 }, { unique: true });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
