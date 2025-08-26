// models/Leave.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    // reference to the authenticated user (if available)
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // human-readable student identifier from form (e.g. "2023CS101")
    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    // student's full name (from the form)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    roomNumber: {
      type: String,
      trim: true,
    },

    leaveType: {
      type: String,
      enum: ["Sick Leave", "Casual Leave", "Emergency Leave", "Other"],
      required: true,
    },

    destination: {
      type: String,
      trim: true,
      default: "",
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // optional admin comment (for approvals/rejections)
    adminComment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model("Leave",leaveSchema)
export default Leave

