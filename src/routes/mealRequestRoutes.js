import { Router } from "express";
import mealRequestController from "../controllers/mealRequestController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../services/cloudinaryConfig.js";

const router = Router();

// Student routes (static paths before /:id)
router.get("/my-requests", authMiddleware, mealRequestController.getMyRequests);
router.post("/", authMiddleware, upload.single('prescriptionImage'), mealRequestController.createRequest);
router.put("/:id", authMiddleware, upload.single('prescriptionImage'), mealRequestController.updateRequest);
router.delete("/:id", authMiddleware, mealRequestController.deleteRequest);

// Seller routes
router.get("/available", authMiddleware, mealRequestController.getAvailableRequests);
router.put("/accept/:id", authMiddleware, mealRequestController.acceptRequest);
router.put("/fulfill/:id", authMiddleware, mealRequestController.fulfillRequest);

export default router;
