import BaseController from "../abstracts/base-controller";
import { validate } from "../middleware/validate/field.validate";
import AuthenService from "../services/authen.service";

export class AuthenController extends BaseController {
    private readonly _authenService: AuthenService;

    constructor(path: string) {
        super(path);
        this._authenService = new AuthenService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.post('/login', validate(['email', 'password']) ,this._authenService.authenticate);
    }
}