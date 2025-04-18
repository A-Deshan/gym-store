import Product from "../models/productModel.js";
import fs from 'fs';
import path from 'path';

// List all products
export const listProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : '';

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, description, price, category) are required"
      });
    }

    await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
    });

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete product
export const removeProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete associated image file
    if (product.image) {
      const imagePath = path.join(process.cwd(), 'uploads', product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    await Product.destroy({ where: { id: productId } });
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};