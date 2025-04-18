import User from "../models/userModel.js";
import Cart from "../models/cartModel.js"; 

// Add to user cart
const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        let cartItem = await Cart.findOne({ where: { userId, productId } });

        if (!cartItem) {
            // If item is not in the cart, add it
            cartItem = await Cart.create({ userId, productId, quantity: 1 });
        } else {
            // If item is already in the cart, increase the quantity
            await cartItem.increment("quantity");
        }

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove from user cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        let cartItem = await Cart.findOne({ where: { userId, productId } });

        if (cartItem) {
            if (cartItem.quantity > 1) {
                await cartItem.decrement("quantity"); // Reduce quantity by 1
            } else {
                await cartItem.destroy(); // Remove item from cart if quantity reaches 0
            }
        }

        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Get user cart
const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartData = await Cart.findAll({ where: { userId } });
        const cartObject = cartData.reduce((acc, item) => {
            acc[item.productId] = item.quantity;
            return acc;
        }, {});
        res.json({ success: true, cartData: cartObject });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addToCart, removeFromCart, getCart };