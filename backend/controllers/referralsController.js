import UserModel from "../models/user.js";

export const getReferrals = async (req, res) => {
    try {
        const id = req.userId;
        const user = await UserModel.findOne({ id });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        res.json(user.referrals);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить данные о рефералах",
        });
    }
};