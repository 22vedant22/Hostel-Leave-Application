
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

// /**
//  * Optional: GET /api/leaves/:id
//  * (useful for detail view)
//  */
// export const getLeaveById = async (req, res) => {
//   try {
//     const leave = await Leave.findById(req.params.id);
//     if (!leave) return res.status(404).json({ message: "Leave not found" });
//     return res.json({ leave });
//   } catch (error) {
//     console.error("getLeaveById error:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// /**
//  * Optional admin action: PATCH /api/leaves/:id/status
//  * Body: { status: "Approved"|"Rejected", adminComment?: string }
//  */
// export const updateLeaveStatus = async (req, res) => {
//   try {
//     const { status, adminComment } = req.body;
//     if (!["Approved", "Rejected", "Pending"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const leave = await Leave.findById(req.params.id);
//     if (!leave) return res.status(404).json({ message: "Leave not found" });

//     leave.status = status;
//     if (typeof adminComment !== "undefined") leave.adminComment = adminComment;

//     await leave.save();
//     return res.json({ message: "Status updated", leave });
//   } catch (error) {
//     console.error("updateLeaveStatus error:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
