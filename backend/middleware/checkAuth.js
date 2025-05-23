import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

export const checkAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Authentication required" 
            });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
            next();
        } catch (error) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid or expired token" 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};
