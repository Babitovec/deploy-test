import User from '../models/user.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authorize = () => async (req, res, next) => {
    try {
        // console.log(req.headers); // вся инфа
        const { decoded } = await getDecodedVerifiedTokenFromRequest(req);
        const user = await User.findOne({ id: decoded });

        if (!user) throw new Error('User not found');
        req.userId = decoded; // Передаем id пользователя в запрос для дальнейшего использования
        next();
    } catch (err) {
        const status = err.status || 401;
        const message = err.message || "Authorization failed";
        res.status(status).json({ error: message });
    }
};

// Вынесенная функция для получения и проверки токена
const getDecodedVerifiedTokenFromRequest = async (req) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new Error("Authorization token not found");
    }

    const decoded = await verifyAccessToken(token);
    return { decoded, token };
};
