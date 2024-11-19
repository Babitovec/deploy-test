import UserModel from "../models/user.js";

export const getReferrer = async (data, referral_id) => {
    // Находим строку с параметром start_param и извлекаем значение
    const userStartParam = data.split('\n')
        .find(line => line.startsWith('start_param='))
        ?.split('=')[1]; // Опциональная цепочка, если start_param не найден, вернёт undefined

    // Если userStartParam существует, проверяем, есть ли такой реферер в базе
    if (userStartParam) {
        const referrerExists = await UserModel.exists({ id: Number(userStartParam) });
        const referralExists = await UserModel.exists({ id: referral_id });

        // Обработка рефералки
        if (referrerExists && !referralExists) {
            return Number(userStartParam);
        }
    }

    // Если реферера нет или userStartParam отсутствует, возвращаем значение по умолчанию
    return null;
};


export const referralHandler = async (referrer_id, referral_id) => {
    let referrerInDB = await UserModel.findOne({ id: referrer_id });
    if (referrerInDB && !haseReferred) {
        console.log('Referrer exists in the database.');
    } else {
        console.log('Referrer does not exist.');
    }
}