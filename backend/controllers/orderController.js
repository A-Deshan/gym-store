import Order from "../models/orderModel.js";

// List all orders (accessible to all authenticated users)
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update order status (accessible to all authenticated users)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate status against allowed values
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

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, payment } = req.body;

    // Validate required fields
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = await Order.create({ userId, items, amount, address, payment });
    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get orders for a specific user
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }
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
    // You can add more verification logic here if needed.
    return res.json({ success: true, message: "Order verified", data: order });
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
