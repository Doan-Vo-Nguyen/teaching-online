import BaseController from "../abstracts/base-controller";
import LecturesService from "../services/lectures.service";
export class LecturesController extends BaseController {
    private readonly _service: LecturesService;

    constructor(path: string) {
        super(path);
        this._service = new LecturesService();
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get('/', this._service.getAll);
        this.router.get('/:id', this._service.getById);
        this.router.post('/', this._service.create);
        this.router.put('/:id', this._service.update);
        this.router.delete('/:id', this._service.delete);
    }
}