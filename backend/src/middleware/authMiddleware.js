import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    if (!req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }

    next();
};

export const requireAdmin = async (req, res, next) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
        if (!isAdmin) {
            res.status(403).json({ message: "Unauthorized - you must be admin", success: false});
        }
        next();
    } catch (error) {
        next(error);
    }

}