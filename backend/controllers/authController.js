import User from '../modals/userModal.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message    
        });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const logoutUser = async (req, res) => {
    try {           
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0
        });
                
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const checkAuth = async (req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            success: false, message: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({
            success: true, message: "Authenticated", user: decoded
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: "Internal server error", error: error.message
        });
    }
}