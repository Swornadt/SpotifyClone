import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/authMiddleware.js";
import { getStats } from "../controllers/statsController.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getStats);

export default router;