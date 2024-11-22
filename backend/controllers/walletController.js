import UserModel from "../models/user.js";

export const walletHandler = async (req, res) => {
    try {
        const id = req.userId;
        const { walletAddress } = req.body; // Деструктуризация для извлечения walletAddress
        let user = await UserModel.findOne({ id });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.wallet_address = walletAddress; // Сохранение только адрес

        await user.save();

        res.status(200).json({ message: 'The address has been saved' });
    } catch (error) {
        res.status(500).json({ error: 'Error when saving an address' });
    }
};
