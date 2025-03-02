import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import LecturesService from "../services/lectures.service";
import {
  validParam,
} from "../middleware/validate/field.validate";
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
    this.router.get("/:id", validParam("id"), this.getLectureById);
    this.router.post("/", this.createLecture);
    this.router.patch("/:id", validParam("id"), this.updateLecture);
    this.router.delete("/:id", validParam("id"), this.deleteLecture);
    this.router.get("/class/:classId", validParam("classId"), this.getAllLecturesByClassId);
    this.router.get("/:id/class/:classId",  validParam("classId"), this.getLecturesDetailsByClassId);
    this.router.post("/class/:classId",  validParam("classId"), this.createLectureByClassId);
    this.router.patch("/:id/class/:classId",  validParam("classId"), this.updateLectureByClassId);
    this.router.delete("/:id/class/:classId",  validParam("classId"), this.deleteLectureByClassId);
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

  private readonly getAllLecturesByClassId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = parseInt(req.params.classId, 10);
      const lectures = await this.lecturesService.getAllLecturesByClassId(classId);
      return sendResponse(
        res,
        true,
        200,
        "Get lectures by class id successfully",
        lectures
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly getLecturesDetailsByClassId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectureId = parseInt(req.params.id, 10);
      const classId = parseInt(req.params.classId, 10);
      const lectures = await this.lecturesService.getLecturesDetailsByClassId(
        lectureId,
        classId
      );
      return sendResponse(
        res,
        true,
        200,
        "Get lectures details by class id successfully",
        lectures
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly createLectureByClassId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = parseInt(req.params.classId, 10);
      const lectureData = req.body;
      const newLecture = await this.lecturesService.createLectureByClassId(
        classId,
        lectureData
      );
      return sendResponse(
        res,
        true,
        200,
        "Create lecture by class id successfully",
        newLecture
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly updateLectureByClassId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectureId = parseInt(req.params.id, 10);
      const classId = parseInt(req.params.classId, 10);
      const updatedLecture = await this.lecturesService.updateLectureByClassId(
        lectureId,
        classId,
        req.body
      );
      return sendResponse(
        res,
        true,
        200,
        "Update lecture by class id successfully",
        updatedLecture
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly deleteLectureByClassId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lectureId = parseInt(req.params.id, 10);
      const classId = parseInt(req.params.classId, 10);
      const result = await this.lecturesService.deleteLectureByClassId(
        lectureId,
        classId
      );
      return sendResponse(
        res,
        true,
        200,
        "Delete lecture by class id successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  };
}
