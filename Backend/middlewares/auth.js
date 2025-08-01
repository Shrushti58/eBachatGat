const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
    console.log("🔑 Checking authentication...");
    const token = req.cookies.token;

    if (!token) {
        console.log("❌ No token found.");
        return res.status(401).json({ message: "Unauthorized! Please log in first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.memberId = decoded.id;
        req.userRole = decoded.role;

        console.log("✅ User authenticated:", decoded);
        next();
    } catch (error) {
        console.log("❗ Invalid token:", error.message);
        return res.status(401).json({ message: "Invalid session, please log in again." });
    }
};

const ensureRole = (role) => {
    return (req, res, next) => {
        console.log(`🔍 Checking role for ${req.memberId}: Expected ${role}, Found ${req.userRole}`);

        if (!req.userRole) {
            return res.status(401).json({ message: "Unauthorized! Please log in first." });
        }

        if (req.userRole.toLowerCase() !== role.toLowerCase()) { // Case-insensitive check
            console.log(`🚫 Access Denied! Required role: ${role}`);
            return res.status(403).json({ message: `Access Denied! You must be a ${role}.` });
        }

        next();
    };
};

const ensureMember = (req, res, next) => {
    ensureAuthenticated(req, res, () => {
        if (["treasurer", "president", "secretary"].includes(req.userRole.toLowerCase())) {
            console.log("🚫 Access Denied! You must be a regular member.");
            return res.status(403).json({ message: "Access Denied! You must be a regular member." });
        }
        next();
    });
};

const ensureTreasurer = [ensureAuthenticated, ensureRole("treasurer")];
const ensurePresident = [ensureAuthenticated, ensureRole("president")];
const ensureSecretary = [ensureAuthenticated, ensureRole("secretary")];

module.exports = {
    ensureAuthenticated,
    ensureTreasurer,
    ensurePresident,
    ensureSecretary,
    ensureMember,
};
