import { sendResponse } from "../../common/interfaces/base-response";
import BaseController from "../abstracts/base-controller";
import StudentClassesService from "../services/student-class.service";
import { Request, Response, NextFunction } from "express";
export class StudentClassesController extends BaseController {
  private readonly studentClassService: StudentClassesService;
  constructor(path: string) {
    super(path);
    this.studentClassService = new StudentClassesService();
    this.initRoutes();
  }

  public initRoutes(): void {
    // Put more specific routes first
    this.router.get("/joined-class", this.getStudentJoinedClasses);
    // Then put parameter routes after
    this.router.get("/:id", this.getStudentClassById);
    // Put general routes last
    this.router.get("/", this.getAllStudentClasses);
  }

  private readonly getAllStudentClasses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const studentClasses =
        await this.studentClassService.getAllStudentClasses();
      return sendResponse(
        res,
        true,
        200,
        "Get all student classes successfully",
        studentClasses
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly getStudentClassById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const studentClassId = parseInt(req.params.id, 10);
      const studentClass =
        await this.studentClassService.getStudentClassById(studentClassId);
      return sendResponse(
        res,
        true,
        200,
        "Get student class by id successfully",
        studentClass
      );
    } catch (error) {
      next(error);
      console.error(error);
    }
  };

  private readonly getStudentJoinedClasses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(req.query.user_id as string, 10);
      const classId = parseInt(req.query.class_id as string, 10);

      // Validation
      if (isNaN(userId) || isNaN(classId)) {
        return sendResponse(
          res,
          false,
          400,
          "Invalid user_id or class_id parameters",
          null
        );
      }

      const studentClasses =
        await this.studentClassService.getStudentJoinedClasses(userId, classId);
      return sendResponse(
        res,
        true,
        200,
        "Get student joined classes successfully",
        studentClasses
      );
    } catch (error) {
      console.error("getStudentJoinedClasses error:", error);
      next(error);
    }
  };
}
