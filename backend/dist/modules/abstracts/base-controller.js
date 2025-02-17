import { Router } from 'express';
class BaseController {
    _path;
    _router;
    constructor(path) {
        this._path = path;
        this._router = Router();
    }
    get path() {
        return this._path;
    }
    get router() {
        return this._router;
    }
}
export default BaseController;
//# sourceMappingURL=base-controller.js.map