import UserModel from "../models/user.js";

export const getReferrals = async (req, res) => {
    try {
        const id = req.userId;
        const user = await UserModel.findOne({ id });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.json(user.referrals);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to retrieve referral data",
        });
    }
};