import dotenv from 'dotenv';
import { AUTHEN_ERROR, INVALID_TOKEN } from '../DTO/BaseErrorDto';
import jwt from 'jsonwebtoken';
import { Logger } from '../config/logger';
dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
export const authentication = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({ AUTHEN_ERROR });
    }
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        Logger.error(error);
        return res.status(400).json({ INVALID_TOKEN });
    }
};
const author = (ROLE_TYPES) => {
    return async (req, res, next) => {
        const { role } = req.user;
        try {
            if (!role.some((r) => ROLE_TYPES.includes(r))) {
                return res.status(403).json({ AUTHEN_ERROR });
            }
            next();
        }
        catch (error) {
            Logger.error(error);
            return res.status(400).json({ INVALID_TOKEN });
        }
    };
};
export const authorAdmin = (req, res, next) => {
    const { role } = req.user;
    try {
        if (!role.includes('admin')) {
            return res.status(403).json({ AUTHEN_ERROR });
        }
        next();
    }
    catch (error) {
        Logger.error(error);
        return res.status(400).json({ INVALID_TOKEN });
    }
};
export const authorAd = author(['admin']);
//# sourceMappingURL=auth.middleware.js.map