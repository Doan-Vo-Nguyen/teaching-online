import 'reflect-metadata';
import { Express } from 'express-serve-static-core';
import 'dotenv/config';
export declare class Application {
    private _app;
    get app(): Express;
    private initControllers;
    init(): void;
    private initSwagger;
    start(): Promise<void>;
}
