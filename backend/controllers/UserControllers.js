import UserModel from "../models/user.js";
import crypto from "crypto";
import * as jwt from "../utils/jwt.js"
import { getReferrer } from "./referralController.js";

export const createUser = async (req, res) => {
    console.log("Received request body:", req.body); // Логируем запрос
    try {
        const { dataCheckString, hash } = req.body;
        const isValid = isAuthAttemptValid(dataCheckString, hash);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (isValid) {
            const tgUserData = getUserData(dataCheckString);
            let user = await UserModel.findOne({ id: tgUserData.id });

            if (user) {
                // Если пользователь найден, обновляем его данные
                const updateData = {
                    first_name: tgUserData.first_name,
                    last_name: tgUserData.last_name,
                    username: tgUserData.username,
                    language_code: tgUserData.language_code,
                    is_premium: tgUserData.is_premium,
                    ip: ip,
                };

                user = await UserModel.findByIdAndUpdate(user._id, updateData, { new: true });
                return res.json({
                    token: jwt.sign(tgUserData.id),
                    message: "Пользователь уже существует и был обновлен",
                    userExists: true,
                    years: user.years,
                    initial_flames_reward: user.initial_flames_reward,
                    is_premium: user.is_premium,
                    flames_count: user.flames_count,
                    gifts_count: user.gifts_count,
                });

            } else {
                // Получаем реферера
                const referrerId = await getReferrer(dataCheckString, tgUserData.id);

                // Если пользователь не найден, создаем нового

                // Находим максимальный flame_id в базе данных c учетом, что в базе уже есть 1 пользователь
                // const lastFlameId = (await UserModel.findOne().sort({ flame_id: -1 })).flame_id;
                // const newFlameId = lastFlameId + 1;

                // Находим максимальный flame_id в базе данных без учета, что в базе уже есть 1 пользователь
                const lastUser = await UserModel.findOne().sort({ flame_id: -1 });
                const newFlameId = lastUser ? lastUser.flame_id + 1 : 1;

                // Инициализируем таски
                const defaultTasks = [
                    { name: "emoji_in_name", completed: false },
                    { name: "invite_5_friends", completed: false },
                    { name: "connect_wallet", completed: false },
                    { name: "sub_flame_tg", completed: false },
                    { name: "sub_flame_x", completed: false },
                    { name: "share_on_x", completed: false },
                ];

                const defaultReferrals = [];

                const newUser = new UserModel({
                    id: tgUserData.id,
                    is_bot: tgUserData.is_bot,
                    first_name: tgUserData.first_name,
                    last_name: tgUserData.last_name,
                    username: tgUserData.username,
                    language_code: tgUserData.language_code,
                    is_premium: tgUserData.is_premium,
                    photo_url: tgUserData.photo_url,
                    ip: ip,
                    flame_id: newFlameId,
                    wallet_address: null,
                    flames_count: 0,
                    initial_flames_reward: 0,
                    gifts_count: 1,
                    opened_gifts_count: 0,
                    flames_burned: 0,
                    flames_bought: 0,
                    ton_spent: 0,
                    referrals: defaultReferrals,
                    referrer_tg_id: referrerId,
                    years: null,
                    streak_day: 1,
                    last_time_login: new Date(),
                    last_time_got_daily_reward: new Date(),
                    tasks: defaultTasks, // Добавляем массив с заданиями
                });

                user = await newUser.save();
            }
            return res.json({
                token: jwt.sign(tgUserData.id),
                message: "Пользователь успешно добавлен в БД",
                showRewards: true,
            });
        }
        else {
            res.status(403).json({
                message: "Набека для уебка",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось добавить пользователя",
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const id = req.userId;
        const user = await UserModel.findOne({ id: id });
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        res.json({
            flamesCount: user.flames_count,
            giftsCount: user.gifts_count,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить данные пользователя",
        });
    }
};

const isAuthAttemptValid = (data, hash) => {
    const botToken = process.env.BOT_TOKEN;
    const secretKey = crypto.createHmac('sha256', "WebAppData").update(botToken).digest();
    const checkHash = crypto.createHmac('sha256', secretKey).update(data).digest();

    return crypto.timingSafeEqual(Buffer.from(checkHash, 'hex'), Buffer.from(hash, 'hex'));
}

const getUserData = (data) => {
    // Находим строку с user и парсим её
    const userQuery = data.split('\n').find(line => line.startsWith('user='));
    const userDataAsString = decodeURIComponent(userQuery.split('=')[1]);
    const userData = JSON.parse(userDataAsString);

    return userData;
}
