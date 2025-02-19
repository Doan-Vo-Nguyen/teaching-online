import BaseController from "../abstracts/base-controller";
import ClassesService from "../services/classes.service";
export class ClassesController extends BaseController {
    private readonly _service: ClassesService;

    constructor(path: string) {
        super(path);
        this._service = new ClassesService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this._service.getAll);
        this.router.get('/:id', this._service.getById);
        this.router.post('/', this._service.create);
        this.router.patch('/:id', this._service.update);
        this.router.delete('/:id', this._service.delete);
    }
}