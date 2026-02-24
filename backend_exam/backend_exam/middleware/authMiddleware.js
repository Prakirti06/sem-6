const jwt = reruire("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "User not authorized, no token provided! " })
        }

        const bearerToken = token.startWith("Bearer ") ? token.slice(7) : token;

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate("role", "name");

        if(!user) {
            return res.status(401).json({ message: "User not found!"})
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role.name,
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "User not authorized, token failed!"})
    }
}

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if(!res.user) {
            return res.status(401).json({message: "Not authorized, user not found!"})
        }
        if(!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({message: "User is not authorized to access this route!"})
        }
        next();
    }
}