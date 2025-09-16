import bcryptjs from "bcryptjs";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


export const getUser = async (req, res, next) => {
    try {
        const { userid } = req.params;


        // Optionally enforce that users can only fetch themselves
        if (req.user?._id !== userid && req.user?.role !== "admin") {
            return next(handleError(403, "Forbidden"));
        }


        const user = await User.findById(userid)
            .select("name email avatar roomNumber phone") // keep it minimal for prefill
            .lean()
            .exec();


        if (!user) return next(handleError(404, "User not found."));


        res.status(200).json({ success: true, message: "User data found", user });
    } catch (error) {
        next(handleError(500, error.message));
    }
};


export const updateUser = async (req, res, next) => {
  try {
    const { userid } = req.params;

    if (req.user?._id !== userid && req.user?.role !== "admin") {
      return next(handleError(403, "Forbidden"));
    }

    const user = await User.findById(userid);
    if (!user) return next(handleError(404, "User not found."));

    // ✅ handle both JSON and FormData
    let data = {};
    if (req.body?.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch {
        data = {};
      }
    } else {
      data = req.body;
    }

    // Update fields
    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.phone = data.phone ?? user.phone;
    user.altPhone = data.altPhone ?? user.altPhone;
    user.dob = data.dob ?? user.dob;
    user.state = data.state ?? user.state;
    user.city = data.city ?? user.city;
    user.emergencyContactName = data.emergencyContactName ?? user.emergencyContactName;
    user.emergencyContactNumber = data.emergencyContactNumber ?? user.emergencyContactNumber;
    user.bio = data.bio ?? user.bio;

    // Optional password change
    if (data.password && data.password.length >= 8) {
      user.password = await bcryptjs.hash(data.password, 10);
    }

    // Optional avatar upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.avatar = result.secure_url;
      try {
        await fs.promises.unlink(req.file.path);
      } catch {}
    }

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    next(handleError(500, error.message));
  }
};


export const getMe = async (req, res, next) => {
    try {
        // `req.user` is set by authenticate middleware (decoded JWT)
        const userId = req.user?._id;

        if (!userId) {
            return next(handleError(401, "Unauthorized"));
        }

        const user = await User.findById(userId)
            .select("name email avatar phone altPhone dob state city emergencyContactName emergencyContactNumber bio")
            .lean()
            .exec();

        if (!user) return next(handleError(404, "User not found."));

        res.status(200).json({ success: true, message: "Current user data", user });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

// userController.js

export const completeProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id; // set by auth middleware
    if (!userId) return next(handleError(401, "Unauthorized"));

    const { roomNumber, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(handleError(404, "User not found"));

    // Update fields
    user.roomNumber = roomNumber ?? user.roomNumber;
    user.phone = phoneNumber ?? user.phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};
