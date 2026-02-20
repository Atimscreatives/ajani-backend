import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Listing from "../models/listing.model.js";

dotenv.config({ path: ".env.local" });

const generateSlug = name => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

async function addSlugs() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Find listings without a slug or with an empty slug
    const listings = await Listing.find({
      $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
    });

    console.log(`Found ${listings.length} listings without a slug in database.`);

    let dbUpdatedCount = 0;

    for (const listing of listings) {
      const baseSlug = generateSlug(listing.name);
      let slug = baseSlug;
      let counter = 1;

      // Check for uniqueness
      while (await Listing.exists({ slug, _id: { $ne: listing._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      try {
        // Use updateOne to bypass validation errors and hook issues
        await Listing.updateOne({ _id: listing._id }, { $set: { slug: slug } });
        console.log(`✓ Updated slug for "${listing.name}": ${slug}`);
        dbUpdatedCount++;
      } catch (err) {
        console.error(`✗ Failed to update slug for "${listing.name}":`, err.message);
      }
    }

    console.log(`\nFinished updating database. Total updated: ${dbUpdatedCount}`);

    // Update listings.json file if it exists
    try {
      console.log("\nChecking listings.json file...");
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const jsonPath = path.join(__dirname, "..", "listings.json");

      const jsonContent = await fs.readFile(jsonPath, "utf-8");
      let jsonListings = JSON.parse(jsonContent);

      let jsonUpdatedCount = 0;

      jsonListings = jsonListings.map(listing => {
        if (!listing.slug) {
          const nameToUse = listing.name || listing.title;
          if (nameToUse) {
            listing.slug = generateSlug(nameToUse);
            jsonUpdatedCount++;
          }
        }
        return listing;
      });

      if (jsonUpdatedCount > 0) {
        await fs.writeFile(jsonPath, JSON.stringify(jsonListings, null, 2), "utf-8");
        console.log(`✓ Updated ${jsonUpdatedCount} listings in listings.json`);
      } else {
        console.log("No listings without slugs found in listings.json");
      }
    } catch (error) {
      console.warn("Could not update listings.json or file not found:", error.message);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding slugs:", error);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // ignore
    }
    process.exit(1);
  }
}

addSlugs();
