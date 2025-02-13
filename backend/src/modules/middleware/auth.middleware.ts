import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { IRequest } from '../types/IRequest';
import { AUTHEN_ERROR, INVALID_TOKEN } from '../DTO/BaseErrorDto';
import jwt from 'jsonwebtoken';
import { Logger } from '../config/logger';
dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

export const authentication = async (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({AUTHEN_ERROR});
    }

    const token = req.headers['authorization'].split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_KEY) as { id: number; role: string[]; username: string; fullname: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        Logger.error(error);
        return res.status(400).json({INVALID_TOKEN});
    }
}

const author = (ROLE_TYPES) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        const {role} = req.user;
        try {
            if (!role.some((r) => ROLE_TYPES.includes(r))) {
                return res.status(403).json({AUTHEN_ERROR});
            }
            next();
        }
        catch (error) {
            Logger.error(error);
            return res.status(400).json({INVALID_TOKEN});
        }
    }
}

export const authorAdmin = (req: IRequest, res: Response, next: NextFunction) => {
    const {role} = req.user;

    try {
        if (!role.includes('admin')) {
            return res.status(403).json({AUTHEN_ERROR});
        }
        next();
    } catch (error) {
        Logger.error(error);
        return res.status(400).json({INVALID_TOKEN});
    }
}

export const authorAd = author(['admin']);