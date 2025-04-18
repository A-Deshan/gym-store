import express from "express";
import { auth } from "../middleware/auth.js";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

// Place a new order
router.post("/place", auth, orderController.placeOrder);

// List all orders
router.get("/list", auth, orderController.listOrders);

// Update order status
router.post("/status", auth, orderController.updateStatus);

// Get orders for a specific user
router.post("/userorders", auth, orderController.userOrders);

// Verify an order
router.post("/verify", auth, orderController.verifyOrder);

export default router;
