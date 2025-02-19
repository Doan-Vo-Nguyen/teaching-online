import BaseController from "../abstracts/base-controller";
import UserService from "../services/users.service";
import { authentication } from "../middleware/auth.middleware";
import { validateCreate, validatePhoneAndEMail } from "../middleware/validate/user.validate";
import { validParamId } from "../middleware/validate/field.validate";
export class UserController extends BaseController {
    private readonly _service: UserService;

    constructor(path: string) {
        super(path);
        this._service = new UserService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this._service.getAll);
        this.router.get('/search', this._service.getByName);
        this.router.get('/:id', validParamId, this._service.getById);
        this.router.post('/', authentication, validateCreate, this._service.create);
        this.router.patch('/:id', authentication, validatePhoneAndEMail, this._service.update);
        this.router.patch('/:id/roles/:role', authentication, this._service.updateRole);
        this.router.delete('/:id', authentication, validParamId, this._service.delete);
    }
}
