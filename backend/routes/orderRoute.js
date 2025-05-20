import express from "express";
import {
  listOrders,
  updateStatus,
  placeCodOrder,
  placeStripeOrder,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/placecod", placeCodOrder);
router.post("/place", placeStripeOrder); // Stripe route
router.get("/list", listOrders);
router.post("/update", updateStatus);
router.post("/userorders", userOrders);
router.post("/verify", verifyOrder);

export default router;
