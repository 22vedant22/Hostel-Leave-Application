
import Leave from "../models/user.leave.js";
import { z } from "zod";

// Zod schema for backend validation
const leaveSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  roomNumber: z.string().optional(),
  leaveType: z.string().min(1, "Please select a leave type"),
  destination: z.string().optional(),
  contactNumber: z.string().min(10, "Contact number is required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  reason: z.string().min(1, "Please provide a reason"),
}).refine(data => data.startDate && data.endDate && data.startDate <= data.endDate, {
  message: "End date must be same or after start date",
  path: ["endDate"],
});


// POST /api/leaves/apply
export const applyLeave = async (req, res) => {
  try {
    // Validate request body
    const parseResult = leaveSchema.safeParse(req.body);

    if (!parseResult.success) {
      // Convert Zod errors to a field-based object
      const fieldErrors = {};
      parseResult.error.errors.forEach(err => {
        const field = err.path[0];
        if (field) fieldErrors[field] = err.message;
      });
      return res.status(400).json({ message: "Validation failed", errors: fieldErrors });
    }

    const {
      studentId,
      name,
      roomNumber,
      leaveType,
      destination,
      contactNumber,
      startDate,
      endDate,
      reason,
    } = parseResult.data;

    // Convert date strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date." });
    }

    // Create the leave document (student optional)
    const newLeave = new Leave({
      student: req.user?._id,
      studentId,
      name,
      roomNumber: roomNumber || "",
      leaveType,
      destination: destination || "",
      contactNumber,
      startDate: start,
      endDate: end,
      reason,
    });

    await newLeave.save();

    return res.status(201).json({
      message: "Leave applied successfully",
      leave: newLeave,
    });
  } catch (error) {
    console.error("applyLeave error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/leaves/my-leaves
 * Returns leaves for the logged-in user (req.user.id).
 */
export const getMyLeaves = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const leaves = await Leave.find({ student: req.user._id }).sort({ createdAt: -1 });
    return res.json({ leaves });
  } catch (error) {
    console.error("getMyLeaves error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/leaves/admin-summary
 * Returns stats and recent activity for all students (admin only).
 */
export const getAdminSummary = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const leaves = await Leave.find().sort({ createdAt: -1 });

    const total = leaves.length;
    const approved = leaves.filter(l => l.status === "Approved").length;
    const pending = leaves.filter(l => l.status === "Pending").length;
    const rejected = leaves.filter(l => l.status === "Rejected").length;

    // Return all leaves instead of only 5
    const recent = leaves.map(l => ({
      _id: l._id,
      studentId: l.studentId,
      studentName: l.name,
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status,
      createdAt: l.createdAt,
    }));

    return res.json({
      stats: { total, approved, pending, rejected },
      recent,
    });
  } catch (error) {
    console.error("getAdminSummary error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json({ success: true, leave });
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("studentId", "name email rollNo") // if you have relation
      .lean();

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Get all leaves (Admins only)
export const getAllLeaves = async (req, res) => {
  try {
    // 🔐 Ensure only admins can access
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    // 📝 Optional filter by status
    const { status } = req.query;
    const filter = status ? { status } : {};

    // 🔎 Fetch all leaves from DB
    const leaves = await Leave.find(filter)
      .populate("studentId", "name email roomNumber") // 👈 populate student info if needed
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Return response
    return res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("❌ getAllLeaves error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching leaves",
      error: error.message,
    });
  }
};