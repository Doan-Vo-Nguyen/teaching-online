import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import { sendResponse } from './common/interfaces/base-response.js';
import { AppDataSource, AppDataSource2 } from './data-source.js';
import { CommentController } from './modules/controller/comment.controller.js';
import { UserController } from './modules/controller/users.controller.js';
import { ClassesController } from './modules/controller/classes.controller.js';
import { Logger } from './modules/config/logger.js';
import swaggerJsDocs from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import options from './docs/swagger/config/swagger.config.js';
export class Application {
    _app;
    get app() {
        if (!this._app) {
            throw new Error('App not initialized');
        }
        return this._app;
    }
    initControllers() {
        this._app?.get('/', (req, res) => {
            return sendResponse(res, true, 200, 'Hello World!');
        });
        const commentController = new CommentController('/comment');
        this._app?.use(commentController.path, commentController.router);
        const userController = new UserController('/users');
        this._app?.use(userController.path, userController.router);
        const classesController = new ClassesController('/classes');
        this._app?.use(classesController.path, classesController.router);
    }
    init() {
        this._app = express();
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this.initControllers();
        this.initSwagger();
    }
    initSwagger() {
        const specs = swaggerJsDocs(options);
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    }
    async start() {
        const port = process.env.APP_PORT || 10000;
        const name = process.env.APP_SERVER || '44B';
        try {
            await AppDataSource.initialize();
            await AppDataSource2.initialize();
            console.info('Data Source has been initialized!');
            this.app.listen(port, () => {
                Logger.info(`Server ${name} is running at port ${port}`);
            });
        }
        catch (error) {
            Logger.error(error);
        }
    }
}
//# sourceMappingURL=app.js.map