import { Request } from 'express';
export interface IRequest extends Request {
    user?: {
        id: number;
        username: string;
        fullname: string;
        email: string;
        role: Array<string>;
    };
}
