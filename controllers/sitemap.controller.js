import Listing from "../models/listing.model.js";
import { SitemapStream, streamToPromise } from "sitemap";

let cachedSitemap = null;
let lastGenerated = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const generateSitemap = async (req, res) => {
  try {
    const now = Date.now();

    // Serve cached version
    if (cachedSitemap && lastGenerated && now - lastGenerated < CACHE_DURATION) {
      res.header("Content-Type", "application/xml");
      return res.send(cachedSitemap);
    }

    // Detect host dynamically
    const protocol = req.protocol;
    const host = req.get("host");
    // const hostname = `${protocol}://${host}`;

    const sitemap = new SitemapStream({ hostname: "https://ajaniv3-nine.vercel.app" });

    // Core pages
    sitemap.write({ url: "/", changefreq: "daily", priority: 1.0 });
    sitemap.write({ url: "/hotels", changefreq: "daily", priority: 0.9 });
    sitemap.write({ url: "/shortlets", changefreq: "daily", priority: 0.9 });
    sitemap.write({ url: "/restaurants", changefreq: "daily", priority: 0.9 });
    sitemap.write({ url: "/services", changefreq: "daily", priority: 0.9 });
    sitemap.write({ url: "/about-us", changefreq: "yearly", priority: 0.4 });
    sitemap.write({ url: "/privacy-policy", changefreq: "yearly", priority: 0.3 });
    sitemap.write({ url: "/terms-of-service", changefreq: "yearly", priority: 0.3 });
    sitemap.write({ url: "/corporate-booking", changefreq: "monthly", priority: 0.3 });

    // Fetch published listings grouped by category
    const listings = await Listing.find({ status: "approved" })
      .select("slug category updatedAt")
      .lean();

    listings.forEach(listing => {
      sitemap.write({
        url: `/${listing.category}/${listing.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: listing.updatedAt,
      });
    });

    sitemap.end();

    const xml = await streamToPromise(sitemap);
    const xmlString = xml.toString();

    // Cache result
    cachedSitemap = xmlString;
    lastGenerated = now;

    res.header("Content-Type", "application/xml");
    res.send(xmlString);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.status(500).end();
  }
};
