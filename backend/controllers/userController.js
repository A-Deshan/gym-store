import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/userModel.js";

// Create JWT Token
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        res.json({ success: true, token: createToken(user.id) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.json({ success: true, token: createToken(newUser.id) });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };
