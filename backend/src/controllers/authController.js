import { User } from "../models/userModel.js";

export const authCallback = async (req, res) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;

        //checking pre-existing user
        let user = await User.findOne({clerkId: id});
        if (!user) {
            //signup:
            user = await User.create({
                clerkId: id,
                fullName: `${firstName || ""} ${lastName || ""}`,
                imageUrl
            });
        }
        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("Error in auth callback",error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};