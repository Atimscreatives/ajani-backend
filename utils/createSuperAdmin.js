import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });

    if (existingSuperAdmin) {
      console.log("Superadmin already exists");
      return;
    }

    await User.create({
      firstName: "Ajani",
      lastName: "SuperAdmin",
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superadmin",
      phone: "08000000000",
    });

    console.log("Superadmin created successfully");
  } catch (err) {
    console.error("Error seeding superadmin:", err.message, "");
  }
};

export default createSuperAdmin;
