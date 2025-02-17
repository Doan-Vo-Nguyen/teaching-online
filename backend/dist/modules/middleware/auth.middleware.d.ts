import { Response, NextFunction } from 'express';
import { IRequest } from '../types/IRequest';
export declare const authentication: (req: IRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const authorAdmin: (req: IRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const authorAd: (req: IRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
