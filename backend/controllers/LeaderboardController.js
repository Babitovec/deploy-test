import User from "../models/user.js";

export const getLeaderboard = async (req, res) => {
    try {
        // Находим пользователя
        const id = req.userId;
        const user = await User.findOne({ id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Находим позицию пользователя в рейтинге
        const userRank = await User.countDocuments({ flames_count: { $gt: user.flames_count } }) + 1;

        // Получаем всех пользователей и сортируем по flames_count по убыванию
        const topUsers = await User.find()
            .sort({ flames_count: -1 }) // Сортировка по flames_count (по убыванию)
            .limit(100); // Ограничиваем до 100 пользователей

        // Получаем общее количество пользователей
        const totalUsersCount = await User.countDocuments();

        res.status(200).json({
            totalUsers: totalUsersCount,
            userRank, // Позиция текущего пользователя в рейтинге
            userUsername: user.username ? user.username : user.first_name,
            userFlamesCount: user.flames_count, // Количество очков пользователя
            leaderboard: topUsers.map(user => ({
                username: user.username ? user.username : user.first_name,
                flamesCount: user.flames_count // Используем camelCase для consistency
            })),
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
