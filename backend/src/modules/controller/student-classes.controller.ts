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
    this.router.get("/student/:id", this.getAllClassesByStudentJoined);
    this.router.get("/class/:id", this.getAllStudentByClass);
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
      next(error);
    }
  };
  
  private readonly getAllStudentByClass = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const classId = parseInt(req.params.id, 10);
      const studentClasses =
        await this.studentClassService.getAllStudentByClass(classId);
      return sendResponse(
        res,
        true,
        200,
        "Get all students by class id successfully",
        studentClasses
      );
    } catch (error) {
      next(error);
    }
  }

  private readonly getAllClassesByStudentJoined = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const studentId = parseInt(req.params.id, 10);
      const studentClasses =
        await this.studentClassService.getAllClassesByStudentJoined(studentId);
      return sendResponse(
        res,
        true,
        200,
        "Get all classes by student joined successfully",
        studentClasses
      );
    } catch (error) {
      next(error);
    }
  };
}
