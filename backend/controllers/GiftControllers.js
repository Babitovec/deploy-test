import UserModel from "../models/user.js";

export const updateGiftsCount = async (req, res) => {
    try {
        const { action } = req.body;
        const id = req.userId;
        let user = await UserModel.findOne({ id });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let flamesToAdd = 0; // Переменная для хранения добавленных flames

        // В зависимости от действия увеличиваем или уменьшаем количество подарков
        if (action === 'decrease' && user.gifts_count > 0) {
            user.gifts_count -= 1;

            const randomChance = Math.random();

            if (randomChance < 0.5) {
                flamesToAdd = 1000; // минимум 1000
            } else if (randomChance < 0.75) {
                flamesToAdd = Math.floor(Math.random() * (2000 - 1500) + 1500); // от 1500 до 2000
            } else if (randomChance < 0.9) {
                flamesToAdd = Math.floor(Math.random() * (4000 - 3000) + 3000); // от 3000 до 4000
            } else if (randomChance < 0.96) {
                flamesToAdd = Math.floor(Math.random() * (8000 - 6000) + 6000); // от 6000 до 8000
            } else if (randomChance < 0.99) {
                flamesToAdd = Math.floor(Math.random() * (15000 - 12000) + 12000); // от 12000 до 15000
            } else if (randomChance < 0.999) {
                flamesToAdd = Math.floor(Math.random() * (30000 - 25000) + 25000); // от 25000 до 30000
            } else {
                flamesToAdd = Math.floor(Math.random() * (100000 - 80000) + 80000); // от 80000 до 100000
            }

            user.flames_count += flamesToAdd;
            user.opened_gifts_count += 1; // Увеличиваем счетчик открытых подарков

        } else if (action === 'increase') {
            user.gifts_count += 1;
        } else {
            return res.status(400).json({
                message: "err",
            });
        }

        // Сохраняем обновления
        await user.save();

        // Возвращаем обновленные данные пользователя, включая flamesToAdd
        res.json({ giftsCount: user.gifts_count, flamesToAdd });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to update the number of gifts",
        });
    }
};
