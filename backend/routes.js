import express from "express";
import { createUser, getUser } from "./controllers/UserControllers.js";
import { updateGiftsCount } from "./controllers/GiftControllers.js";
import { giveDailyBonus, updateLoginAndCheckStatus } from "./controllers/DailyStreakController.js";
import { getLeaderboard } from "./controllers/LeaderboardController.js";
import { getTasksStatus, checkEmojiInUsername, checkInviteFriends, checkIsWalletConnected, checkIsSubscribedToTgChannel, checkTwitterSub, checkTwitterShare } from "./controllers/TasksController.js";
import { getRegistrationReward } from "./controllers/InitialRewardController.js";
import { getReferrals } from "./controllers/referralsController.js"
import { authorize } from "./middlewares/authMiddleware.js";
import { walletHandler } from "./controllers/walletController.js";

import { test } from "./controllers/test.js"; //test

const router = express.Router();

//test
router.get("/test", test);

// Создание пользователя
router.post("/create-user", createUser);

//Middleware который не даёт попасть на роуты после него если нет валидного токена
router.use(authorize());//Мб надо не вызывать

// Получение данных пользователя
router.get("/get-user", getUser);

// Обновление времени логина и проверка статуса входа
router.get('/login-status', updateLoginAndCheckStatus);

// Расчет даты регистрации
router.get("/registrationReward", getRegistrationReward);

// Выдача ежедневного бонуса
router.post("/daily-bonus", giveDailyBonus);

// Обработка кошелька
router.post("/wallet", walletHandler)

// Обновление количества подарков
router.post("/update-gifts", updateGiftsCount);

// Получаем инфу о рефах
router.get("/referrals", getReferrals);

// Лидерборд
router.get("/leaderboard", getLeaderboard);

// Таски
router.get("/tasks", getTasksStatus); // Получаем все таски
router.get("/tasks/check-emoji", checkEmojiInUsername); // Проверка 🔥 в username
router.get("/tasks/invite-friends", checkInviteFriends); // Проверка есть ли 5 рефералов
router.get("/tasks/connect_wallet", checkIsWalletConnected) // Проверка подключенного кошелька
router.get("/tasks/sub_flame_tg", checkIsSubscribedToTgChannel) // Проверка подписан ли на ТГ канал
router.get("/tasks/sub_flame_x", checkTwitterSub) // Фиктивная проверка подписки на Twitter
router.get("/tasks/share_on_x", checkTwitterShare) // Фиктивная проверка share about us on X

export default router;
