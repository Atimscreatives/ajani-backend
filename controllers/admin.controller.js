import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/errorHandler.js";
import { generateToken } from "../utils/generateToken.js";
import sendEmailResend from "../utils/resend.js";

// ADMIN AUTHENTICATION

// ADMIN: LOGIN
export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return next(new AppError(404, "Admin not found"));
  }

  const isPasswordValid = await user.correctPassword(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(401, "Invalid password"));
  }

  const token = generateToken(user);

  res.status(200).json({
    message: "Admin logged in successfully",
    data: user,
    token,
  });
});

// ADMIN: Create Admin Invite
export const createAdminInvite = catchAsync(async (req, res, next) => {
  const { email, firstName, lastName } = req.body;

  // Check if all fields are provided
  if (!email || !firstName || !lastName) return next(new AppError(400, "All fields are required"));

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError(400, "User with this email already exists"));

  // CREATE 6 DIGIT OTP FOR USER OR VENDOR
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiryMinutes = 10;
  const invitationCode = otp;
  const invitationCodeExpires = Date.now() + expiryMinutes * 60 * 1000;
  const inviteLink = `${process.env.FRONTEND_URL}/admincpanel/register?email=${email}&token=${invitationCode}`;

  // Create user with role 'admin' and pending verification
  const user = await User.create({
    email,
    firstName,
    lastName,
    role: "admin",
    password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
    phone: "+2348056789012",
    admin: {
      invitationCode,
      invitationCodeExpires,
      invitationStatus: "pending",
    },
  });

  // Send email with OTP
  await sendEmailResend({
    to: email,
    subject: "Ajani AI Admin Invitation",
    html: `
      <p>Hello,</p>
      <p>You have been invited to join Ajani AI as an admin.</p>
      <p>Please use the link below to verify your email and complete registration:</p>
      <h3>${inviteLink}</h3>
      <p>This link will expire in ${expiryMinutes} minutes.</p>
      <p>If you did not request this invitation, please ignore this email.</p>
    `,
  });

  res.status(201).json({
    message: "Admin invitation sent successfully",
    data: user,
  });
});

// ADMIN: Verify Invite
export const verifyAdminInvite = catchAsync(async (req, res, next) => {
  const { invitationCode, email } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new AppError(400, "Password is required"));
  }

  const user = await User.findOne({ "admin.invitationCode": invitationCode, email });
  if (!user) return next(new AppError(404, "Invalid invitation code"));

  if (user.admin.invitationStatus !== "pending") {
    return next(new AppError(400, "Invitation code is not valid"));
  }

  if (user.admin.invitationCodeExpires < Date.now()) {
    return next(new AppError(400, "Invitation code has expired"));
  }

  user.password = password;
  user.admin.invitationStatus = "approved";
  user.admin.invitationCodeExpires = null;
  user.isVerified = true;
  user.isActive = true;

  await user.save();

  const token = generateToken(user);

  res.status(200).json({
    message: "Admin invitation verified successfully",
    data: user,
    token,
  });
});

export const getAllAdmins = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "admin" });
  res.status(200).json({
    message: "All admins fetched successfully",
    data: users,
  });
});

export const revokeAdminInvite = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;

  const user = await User.findById(adminId);
  if (!user || user.role !== "admin") {
    return next(new AppError(404, "Admin not found"));
  }

  user.admin.invitationStatus = "revoked";
  user.admin.invitationCodeExpires = null;
  user.isVerified = false;
  user.isActive = false;

  await user.save();

  res.status(200).json({
    message: "Admin invitation revoked successfully",
  });
});

// ADMIN VENDOR MANAGEMENT

export const approveVendor = catchAsync(async (req, res, next) => {
  const { vendorId } = req.params;

  const user = await User.findById(vendorId);
  if (!user || user.role !== "vendor") {
    return next(new AppError(404, "Vendor not found"));
  }

  if (!user.vendor) {
    return next(new AppError(400, "Vendor profile data missing"));
  }

  user.vendor.approvalStatus = "approved";
  user.vendor.approvedAt = Date.now();
  user.isVerified = true;
  user.isActive = true;

  await user.save();

  // Notify vendor (best-effort)
  sendEmail({
    to: user.email,
    subject: "Your vendor account has been approved",
    html: `<p>Hi ${user.firstName},</p><p>Your vendor account has been approved by our team. You can now access vendor features on the platform.</p>`,
  }).catch(err => console.error("Email send failed:", err));

  res.status(200).json({ message: "Vendor approved successfully", data: user });
});

export const rejectVendor = catchAsync(async (req, res, next) => {
  const { vendorId } = req.params;
  const { reason } = req.body;

  const user = await User.findById(vendorId);
  if (!user || user.role !== "vendor") {
    return next(new AppError(404, "Vendor not found"));
  }

  if (!user.vendor) {
    return next(new AppError(400, "Vendor profile data missing"));
  }

  user.vendor.approvalStatus = "rejected";
  user.vendor.approvedAt = null;
  user.isVerified = false;
  user.isActive = false;

  await user.save();

  // Notify vendor with optional reason (best-effort)
  sendEmail({
    to: user.email,
    subject: "Your vendor account application was not approved",
    html: `<p>Hi ${user.firstName},</p><p>We reviewed your vendor application and decided not to approve it at this time.</p>
           ${reason ? `<p>Reason provided: ${reason}</p>` : ""}
           <p>If you believe this is a mistake, please contact support.</p>`,
  }).catch(err => console.error("Email send failed:", err));

  res.status(200).json({ message: "Vendor rejected", data: user });
});

export default { approveVendor, rejectVendor };
