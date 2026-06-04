import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected Successfully");

    // Seed predefined admin account if it doesn't exist
    const adminEmail = "admin@placementtracker.com";
    const adminExists = await UserModel.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await UserModel.create({
        name: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Predefined Admin Account seeded successfully!");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;