import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";

// Utility to extract user ID from token
const extractUserIdFromToken = (req) => {
  const token = req.headers.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
};

// List all orders (admin or for future filtering)
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Handle COD order
export const placeCodOrder = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      payment: "COD",
      status: "Processing"
    });

    return res.status(201).json({ success: true, message: "Order placed successfully", data: newOrder });
  } catch (error) {
    console.error("Error placing COD order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Handle Stripe order (simulate for now)
export const placeStripeOrder = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Simulate Stripe session creation
    const session_url = "https://checkout.stripe.fake-session-url";

    // Optional: Save order with status "Pending Payment"
    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      payment: "Stripe",
      status: "Pending"
    });

    return res.status(200).json({
      success: true,
      message: "Stripe session created",
      session_url,
      data: newOrder
    });
  } catch (error) {
    console.error("Error placing Stripe order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = ["Processing", "Shipped", "Delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Valid options: Processing, Shipped, Delivered"
      });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.update({ status });
    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get orders for a specific user
export const userOrders = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await Order.findAll({ where: { userId } });
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Verify an order by orderId
export const verifyOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, message: "Order verified", data: order });
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
