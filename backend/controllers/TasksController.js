import axios from "axios"
import UserModel from '../models/user.js';

// Общая функция для получения пользователя по id
const getUserById = async (id, res) => {
    try {
        const user = await UserModel.findOne({ id });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return null;
        }
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
        return null;
    }
};

// Общая функция для обновления статуса задачи
const updateTaskStatus = async (user, taskName, flames_reward, gifts_reward) => {
    const taskIndex = user.tasks.findIndex(task => task.name === taskName);
    if (taskIndex !== -1) {
        const task = user.tasks[taskIndex];

        // Проверяем, завершена ли задача
        if (task.completed) {
            // Если задача уже выполнена, не обновляем её и не добавляем бонус
            return;
        }

        // Обновляем статус задачи
        task.completed = true;
        task.date_completed = new Date();
        user.flames_count += flames_reward;
        user.gifts_count += gifts_reward;

        // Сохраняем изменения в базе данных
        await user.save();
    }
};


// Получаем таски
export const getTasksStatus = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        res.json(user.tasks);
    }
};

// Проверка наличия символа 🔥 в username
export const checkEmojiInUsername = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        const hasFlameEmoji = /🔥/.test(user.first_name);
        if (hasFlameEmoji) {
            await updateTaskStatus(user, "emoji_in_name", 0, 1);
            res.json({ message: "Flame emoji found in username", completed: true });
        } else {
            res.json({ message: "Flame emoji not found in username", completed: false });
        }
    }
};

// Проверка наличия 5 приглашенных друзей
export const checkInviteFriends = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        const hasEnoughInvitedFriends = user.referrals.length >= 5;
        if (hasEnoughInvitedFriends) {
            await updateTaskStatus(user, "invite_5_friends", 0, 5);
            res.json({ message: "Invite 5 friends", completed: true });
        } else {
            res.json({ message: "5 friends not invited", completed: false });
        }
    }
};

// Проверка подключен ли кошелек
export const checkIsWalletConnected = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        const hasConnectedWalletAddress = user.wallet_address;
        if (hasConnectedWalletAddress) {
            await updateTaskStatus(user, "connect_wallet", 0, 1);
            res.json({ message: "Connected wallet address found", completed: true });
        } else {
            res.json({ message: "No connected wallet address", completed: false });
        }
    }
};

// Проверка подписан ли пользователь на ТГ канал Flame
export const checkIsSubscribedToTgChannel = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        const chatUsername = '@flame_coin_community';  // Юзернейм канала
        const userId = user.id;  // ID пользователя для проверки

        try {
            const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`, {
                params: {
                    chat_id: chatUsername,  // Или chat_id, если у вас есть его
                    user_id: userId
                }
            });

            const memberStatus = response.data.result.status;  // Статус пользователя

            if (memberStatus === 'member' || memberStatus === 'administrator' || memberStatus === 'creator') {
                // Если пользователь подписан
                await updateTaskStatus(user, "sub_flame_tg", 100, 0);
                res.json({ message: "User is subscribed to the channel", completed: true });
            } else {
                // Если не подписан
                res.json({ message: "User is not subscribed to the channel", completed: false });
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
            res.status(500).json({ message: "Error checking subscription" });
        }
    }
};

// фиктивная проверка подписки на Twitter
export const checkTwitterSub = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        await updateTaskStatus(user, "sub_flame_x", 100, 0);
        res.json({ message: "User is subscribed to X", completed: true });
    };
};

// фиктивная проверка share_on_x
export const checkTwitterShare = async (req, res) => {
    const user = await getUserById(req.userId, res);
    if (user) {
        await updateTaskStatus(user, "share_on_x", 100, 0);
        res.json({ message: "User is shared on X", completed: true });
    };
};