import UserModel from '../models/user.js';

export const updateLoginAndCheckStatus = async (req, res) => {
    try {
        const id = req.userId;

        // Попробуем найти пользователя по id
        let user = await UserModel.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const lastTimeLogin = user.last_time_login;

        // Обновляем время последнего входа на текущее
        user.last_time_login = now;
        await user.save();

        // Проверяем, заходил ли пользователь сегодня
        const bonusReceivedToday = lastTimeLogin && now.getUTCDate() === lastTimeLogin.getUTCDate();

        res.json({
            message: "Last login time updated!",
            last_time_login: user.last_time_login,
            bonusReceivedToday
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update last login time and check bonus status" });
    }
};

export const giveDailyBonus = async (req, res) => {
    try {
        const id = req.userId;
        let user = await UserModel.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const lastRewardDate = user.last_time_got_daily_reward;

        // Проверяем, если у пользователя уже есть запись о последнем бонусе
        if (lastRewardDate) {
            // Приводим даты к UTC для корректного сравнения
            const lastRewardDateUTC = new Date(Date.UTC(lastRewardDate.getUTCFullYear(), lastRewardDate.getUTCMonth(), lastRewardDate.getUTCDate()));
            const nowDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

            const daysDifference = Math.floor((nowDateUTC - lastRewardDateUTC) / (1000 * 60 * 60 * 24));

            if (daysDifference === 0) {
                return res.status(400).json({ message: "Bonus already given today" });
            }

            if (daysDifference > 1) {
                user.streak_day = 1;
            } else {
                user.streak_day = user.streak_day >= 10 ? 1 : user.streak_day + 1;
            }

        } else {
            // Если бонус ни разу не был получен, начинаем серию со второго дня
            user.streak_day = 2;
        }

        // Определяем награды по текущему дню серии
        let flamesToAdd = 0;
        let giftsToAdd = 0;

        switch (user.streak_day) {
            case 1:
                flamesToAdd = 100;
                giftsToAdd = 0;
                break;
            case 2:
                flamesToAdd = 200;
                giftsToAdd = 1;
                break;
            case 3:
                flamesToAdd = 300;
                giftsToAdd = 1;
                break;
            case 4:
                flamesToAdd = 400;
                giftsToAdd = 1;
                break;
            case 5:
                flamesToAdd = 100;
                giftsToAdd = 2;
                break;
            case 6:
                flamesToAdd = 200;
                giftsToAdd = 2;
                break;
            case 7:
                flamesToAdd = 300;
                giftsToAdd = 2;
                break;
            case 8:
                flamesToAdd = 100;
                giftsToAdd = 3;
                break;
            case 9:
                flamesToAdd = 200;
                giftsToAdd = 3;
                break;
            case 10:
                flamesToAdd = 300;
                giftsToAdd = 5;
                break;
        }

        // Обновляем количество flames и подарков
        user.flames_count += flamesToAdd;
        user.gifts_count += giftsToAdd;

        // Обновляем время последнего получения бонуса
        user.last_time_got_daily_reward = now;

        // Сохраняем изменения
        await user.save();

        res.json({
            message: "Bonus granted!",
            flames_count: flamesToAdd,
            gifts_count: giftsToAdd,
            today_streak_day: user.streak_day
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to grant bonus" });
    }
};
