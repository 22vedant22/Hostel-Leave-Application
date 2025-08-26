import express from "express";
import { applyLeave, getMyLeaves } from "../controllers/leave.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/apply", authenticate, applyLeave); // optional: protect if leave needs login
router.get("/my-leaves", authenticate, getMyLeaves); // protect route

export default router;
