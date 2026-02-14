import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  adminLogin,
  createAdminInvite,
  verifyAdminInvite,
  getAllAdmins,
  revokeAdminInvite,
  approveVendor,
  rejectVendor,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.post("/login", adminLogin);

router.use(protect);
router.use(authorize("admin", "superadmin"));

// Admin routes
router.get("/", getAllAdmins);
router.post("/invite", authorize("superadmin"), createAdminInvite);
router.post("/verify/:invitationCode/:email", verifyAdminInvite);
router.delete("/:adminId", authorize("superadmin"), revokeAdminInvite);

// Approve a vendor account
router.patch("/vendors/:vendorId/approve", approveVendor);

// Reject a vendor account (optional `reason` in body)
router.patch("/vendors/:vendorId/reject", rejectVendor);

export default router;
