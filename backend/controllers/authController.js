import bcrypt from "bcryptjs";

import UserModel from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      branch,
      cgpa,
      role,
    } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      branch,
      cgpa,
      role: "student",
    });

    res.status(201).json({
      message: "Registration Successful",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let resumeUrl = req.file.path;
    if (!resumeUrl.startsWith("http") && !resumeUrl.startsWith("https")) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      resumeUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }
    user.resume = resumeUrl;

    await user.save();

    res.status(200).json({
      message: "Resume Uploaded Successfully",
      resume: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, rollNumber, branch, cgpa } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (rollNumber !== undefined) user.rollNumber = rollNumber;
    if (branch !== undefined) user.branch = branch;
    if (cgpa !== undefined) user.cgpa = cgpa;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};