import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { IRequest } from '../types/IRequest';
import { AUTHENTICATION_ERROR, INVALID_TOKEN } from '../DTO/resDto/BaseErrorDto';
import jwt from 'jsonwebtoken';
import { Logger } from '../config/logger';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY;

const getTokenFromHeader = (authorizationHeader: string | undefined): string | null => {
    if (!authorizationHeader) return null;
    const parts = authorizationHeader.split(' ');
    return parts.length === 2 ? parts[1] : null;
};

const verifyToken = (token: string): { id: number; role: string[]; username: string; fullname: string; email: string } | null => {
    try {
        return jwt.verify(token, JWT_KEY) as { id: number; role: string[]; username: string; fullname: string; email: string };
    } catch (error) {
        Logger.error(error);
        return null;
    }
};

export const authentication = async (req: IRequest, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req.headers['authorization']);
    if (!token) {
        return res.status(401).json({ AUTHENTICATION_ERROR });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(400).json({ INVALID_TOKEN });
    }

    req.user = decoded;
    next();
};

const authorize = (allowedRoles: string[]) => {
    return (req: IRequest, res: Response, next: NextFunction) => {
        const { role } = req.user;
        if (!role.some(r => allowedRoles.includes(r))) {
            return res.status(403).json({ AUTHENTICATION_ERROR });
        }
        next();
    };
};

export const authorAdmin = authorize(['admin']);
export const authorAd = authorize(['admin']);
