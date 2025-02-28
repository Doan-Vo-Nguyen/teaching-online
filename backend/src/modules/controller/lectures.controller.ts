import { authorAdOrTeacher } from "./../middleware/auth.middleware";
import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import LecturesService from "../services/lectures.service";
import { validParamId } from "../middleware/validate/field.validate";
import { sendResponse } from "../../common/interfaces/base-response";
export class LecturesController extends BaseController {
  private readonly lecturesService: LecturesService;

  constructor(path: string) {
    super(path);
    this.lecturesService = new LecturesService();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/", this.getAllLectures);
    this.router.get("/:id", validParamId, this.getLectureById);
    this.router.post("/", authorAdOrTeacher, this.createLecture);
    this.router.patch("/:id", validParamId, this.updateLecture);
    this.router.delete("/:id", validParamId, this.deleteLecture);
  }

  private readonly getAllLectures = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectures = await this.lecturesService.getAllLectures();
      return sendResponse(
        res,
        true,
        200,
        "Get all lectures successfully",
        lectures
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly getLectureById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectureId = parseInt(req.params.id, 10);
      const lectureData = await this.lecturesService.getLectureById(lectureId);
      return sendResponse(
        res,
        true,
        200,
        "Get lecture by id successfully",
        lectureData
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly createLecture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newLecture = await this.lecturesService.createLecture(req.body);
      return sendResponse(
        res,
        true,
        200,
        "Create lecture successfully",
        newLecture
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly updateLecture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectureId = parseInt(req.params.id, 10);
      const updatedLecture = await this.lecturesService.updateLecture(
        lectureId,
        req.body
      );
      return sendResponse(
        res,
        true,
        200,
        "Update lecture successfully",
        updatedLecture
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly deleteLecture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectureId = parseInt(req.params.id, 10);
      const result = await this.lecturesService.deleteLecture(lectureId);
      return sendResponse(
        res,
        true,
        200,
        "Delete lecture successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  };
}
