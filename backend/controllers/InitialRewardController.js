import regression from "regression"
import UserModel from '../models/user.js';

// Данные Telegram ID и даты регистрации (в формате Unix Timestamp)
const data = {
    1: new Date('2013-08-22').getTime() / 1000, //Durov
    389737917: new Date('2017-06-28').getTime() / 1000, //Erik
    439244929: new Date('2017-10-17').getTime() / 1000, //Я
    464360519: new Date('2017-12-09').getTime() / 1000, //Adnrey
    363301173: new Date('2017-04-25').getTime() / 1000, //Arman
    489278036: new Date('2018-01-27').getTime() / 1000, //Альберт
    503431221: new Date('2018-02-23').getTime() / 1000, //Mr_mapo007
    577420158: new Date('2018-07-03').getTime() / 1000, //Vitalik
    550930866: new Date('2018-05-20').getTime() / 1000, //Papa registered: 2018-05-20
    643262548: new Date('2018-10-13').getTime() / 1000, //Levon
    671377623: new Date('2018-11-21').getTime() / 1000, //dashalays
    810426971: new Date('2019-05-09').getTime() / 1000, //Армен
    858219060: new Date('2019-06-28').getTime() / 1000, // Alina
    864922324: new Date('2019-07-05').getTime() / 1000, //Grant
    883725005: new Date('2019-07-24').getTime() / 1000, //Aren
    1128174147: new Date('2020-03-05').getTime() / 1000, //Lilit
    1294228742: new Date('2020-05-20').getTime() / 1000, //Ruzanna
    1359177804: new Date('2020-08-02').getTime() / 1000, //Anahit
    1373416370: new Date('2020-08-11').getTime() / 1000, //Мама
    1083684763: new Date('2020-01-24').getTime() / 1000, //updyvi
    5776450429: new Date('2022-09-23').getTime() / 1000, //J_eanna
    6203647478: new Date('2023-03-04').getTime() / 1000, //Danya
};

// Массивы для ID и соответствующих дат
const x = Object.keys(data).map(id => parseInt(id));
const y = Object.values(data);
const points = x.map((value, index) => [value, y[index]]);
const result = regression.polynomial(points, { order: 2 });

// Основная функция
export const getRegistrationReward = async (req, res) => {
    try {
        const id = req.userId;
        let user = await UserModel.findOne({ id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Вычисляем предсказанную дату регистрации
        const registrationTimestamp = result.predict(id)[1];
        let registrationDate = new Date(registrationTimestamp * 1000);

        // Если дата регистрации в будущем, устанавливаем ее как текущую дату
        const currentDate = new Date();
        if (registrationDate > currentDate) {
            registrationDate = currentDate;
        }

        const registrationDateString = registrationDate.toISOString().split('T')[0];

        // Рассчитываем количество дней с момента регистрации
        const daysRegistered = Math.floor((currentDate - registrationDate) / (1000 * 60 * 60 * 24));

        // Рассчитываем количество лет с округлением вверх, минимально 1 год
        const yearsRegistered = Math.max(1, Math.round((currentDate - registrationDate) / (1000 * 60 * 60 * 24 * 365.25)));

        // Рассчитываем награду
        const reward = daysRegistered < 200 ? 200 : daysRegistered;

        if (user.initial_flames_reward === 0) {
            // Добавляем результаты в БД
            user.flames_count += reward; // Добавляем базовую награду за возраст аккаунта
            user.initial_flames_reward += reward;
            if (user.is_premium) {
                user.flames_count += 500; // Добавляем +500 flames, если пользователь премиум
                user.initial_flames_reward += 500;
            }
            user.years = yearsRegistered; // Добавляем сколько лет зарегистрирован

            await user.save();
        }

        // Обновляем данные реферера
        const referrerId = user.referrer_tg_id;
        if (referrerId) {
            const referrer = await UserModel.findOne({ id: referrerId });
            if (referrer) {
                // Проверка, существует ли уже такой реферал
                const alreadyReferred = referrer.referrals.some(ref => ref.referral_telegram_id === user.id);

                if (!alreadyReferred) {
                    // Рассчитываем базовое значение для got_from_referral
                    let gotFromReferral = Math.floor(reward / 10);

                    // Если пользователь имеет премиум статус, добавляем бонус
                    if (user.is_premium) {
                        gotFromReferral += 50;
                    }

                    // Добавляем запись в referrals
                    const referralData = {
                        referral_username: user.username ? user.username : user.first_name,
                        referral_years: yearsRegistered,
                        got_from_referral: gotFromReferral,
                        referral_telegram_id: user.id,
                    };

                    // Обновляем массив рефералов
                    referrer.referrals.push(referralData);
                    // Отправляем рефереру награду
                    referrer.flames_count += gotFromReferral;

                    await referrer.save();
                }
            }
        }


        // Отправляем результат
        res.json({
            approximateRegistrationDate: registrationDateString,
            reward,
            yearsRegistered,
            is_premium: user.is_premium,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error when calculating award and registration date" });
    }
};