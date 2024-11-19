import jwt from 'jsonwebtoken';

export const sign = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET);
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};