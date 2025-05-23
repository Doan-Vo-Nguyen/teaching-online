import dotenv from 'dotenv';
import { Response, NextFunction } from 'express';
import { IRequest } from '../types/IRequest';
import { AUTHENTICATION_ERROR, INVALID_TOKEN } from '../DTO/resDto/BaseErrorDto';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_KEY = process.env.JWT_KEY || '';

// In-memory token blacklist (for development/demo)
// In production, use Redis or another distributed cache
// const tokenBlacklist = new Map<string, number>();

interface DecodedToken {
    id: number;
    role: string[];
    username: string;
    fullname: string;
    email: string;
}

export const getTokenFromHeader = (authorizationHeader: string | undefined): string | null => {
    if (!authorizationHeader) return null;
    const parts = authorizationHeader.split(' ');
    return parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : null;
};

const verifyToken = (token: string): DecodedToken | null => {
    if (!JWT_KEY) {
        return null;
    }
    try {
        const decoded = jwt.verify(token, JWT_KEY) as DecodedToken;
        decoded.role = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
        return decoded;
    } catch {
        return null;
    }
};

// Check if token is blacklisted
/* 
const isTokenBlacklisted = (token: string): boolean => {
    return tokenBlacklist.has(token);
};
*/

// Add token to blacklist with expiry time
/*
export const blacklistToken = (token: string, expiryInSeconds: number = 3600): void => {
    // Store token in blacklist
    tokenBlacklist.set(token, Date.now() + expiryInSeconds * 1000);
    
    // Set up cleanup for this token after it expires
    setTimeout(() => {
        tokenBlacklist.delete(token);
    }, expiryInSeconds * 1000);
};
*/

// Cleanup function to remove expired tokens from blacklist (call periodically)
/*
export const cleanupBlacklist = (): void => {
    const now = Date.now();
    for (const [token, expiry] of tokenBlacklist.entries()) {
        if (expiry <= now) {
            tokenBlacklist.delete(token);
        }
    }
};
*/

export const authentication = async (req: IRequest, res: Response, next: NextFunction) => {
    const token = getTokenFromHeader(req.headers['authorization']);
    if (!token) {
        return res.status(401).json({ error: AUTHENTICATION_ERROR });
    }

    // Check if token is blacklisted
    /*
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ error: INVALID_TOKEN });
    }
    */

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: INVALID_TOKEN });
    }

    req.user = {
        id: decoded.id,
        role: decoded.role,
        username: decoded.username,
        fullname: decoded.fullname,
        email: decoded.email
    };

    next();
};

const authorize = (allowedRoles: string[]) => (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.user?.role) {
        return res.status(403).json({ error: AUTHENTICATION_ERROR });
    }

    const userRoles = req.user.role;
    const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role.toLowerCase()));
    if (!hasAllowedRole) {
        return res.status(403).json({ error: AUTHENTICATION_ERROR });
    }

    next();
};

export const verifyRefreshToken = async (req: IRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: AUTHENTICATION_ERROR })
    }

    try {
        const decoded = jwt.verify(token, JWT_KEY) as DecodedToken
        req.user = {
            id: decoded.id,
            role: decoded.role,
            username: decoded.username,
            fullname: decoded.fullname,
            email: decoded.email
        }
        next()
    } catch (error) {
        return res.status(401).json({ error: INVALID_TOKEN })
    }
}

export const authorAdmin = authorize(['admin']);
export const authorTeacher = authorize(['teacher']);
export const authorAdOrTeacher = authorize(['admin', 'teacher']);
