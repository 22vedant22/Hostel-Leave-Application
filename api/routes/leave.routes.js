import express from "express";
import { applyLeave, getAdminAnalytics, getAdminSummary, getAllLeaves, getLeaveById, getMyLeaves, updateLeaveStatus } from "../controllers/leave.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/apply", authenticate, applyLeave); // optional: protect if leave needs login
router.get("/my-leaves", authenticate, getMyLeaves);
router.get("/admin-summary", authenticate, getAdminSummary);
router.get("/admin-analytics", authenticate, getAdminAnalytics);
router.get("/:id", authenticate, getLeaveById) // protect route
router.put("/:leaveId/status", authenticate, updateLeaveStatus);


export default router;
