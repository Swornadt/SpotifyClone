import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controllers/adminController.js";
import { protectRoute, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();
console.log("Admin email from ENV adminroute:", process.env.ADMIN_EMAIL);
router.use(protectRoute); //applies these middlewares to all routes below

router.get("/check", checkAdmin);

router.use( requireAdmin); // as checkAdmin does NOT require being an admin!
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;