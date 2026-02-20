import express from "express";
const router = express.Router();
import { generateSitemap } from "../controllers/sitemap.controller.js";

router.get("/sitemap.xml", generateSitemap);
router.get("/sitemapnew.xml", generateSitemap);

export default router;
