import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import UserService from "../services/users.service";
import {
  authentication,
  authorAdOrTeacher,
} from "../middleware/auth.middleware";
import {
  validateCreate,
  validatePhoneAndEMail,
} from "../middleware/validate/user.validate";
import { validParamId } from "../middleware/validate/field.validate";
import { sendResponse } from "../../common/interfaces/base-response";
import { Role } from "../entity/User.entity";

export class UserController extends BaseController {
  private readonly userService: UserService;

  constructor(path: string) {
    super(path);
    this.userService = new UserService();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/", this.getAllUsers);
    this.router.get("/search", this.getUserByName);
    this.router.get("/:id", validParamId, this.getUserById);
    this.router.get("/role/:role", authentication, this.getUserByRole);
    this.router.post("/", authentication, validateCreate, this.createUser);
    this.router.post(
      "/:id/class",
      authentication,
      authorAdOrTeacher,
      this.addClass
    );
    this.router.post(
      "/:id/join/:class_join_code",
      authentication,
      this.joinClass
    );
    this.router.post("/:id/leave/:class_id", authentication, this.leaveClass);
    this.router.patch(
      "/:id",
      authentication,
      validatePhoneAndEMail,
      this.updateUser
    );
    this.router.put("/:id/password", authentication, this.changePassword);
    this.router.patch("/:id/roles/", authentication, this.updateUserRole);
    this.router.delete("/:id", authentication, validParamId, this.deleteUser);
  }

  private readonly getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.userService.getAllUsers();
      return sendResponse(res, true, 200, "Get all users successfully", users);
    } catch (error) {
      next(error);
    }
  };

  private readonly getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await this.userService.getUserById(userId);
      return sendResponse(res, true, 200, "Get user by id successfully", user);
    } catch (error) {
      next(error);
    }
  };

  private readonly getUserByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fullname = req.query.name as string;
      const user = await this.userService.getUserByName(fullname);
      return sendResponse(
        res,
        true,
        200,
        "Get user by name successfully",
        user
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newUser = await this.userService.createUser(req.body);
      return sendResponse(res, true, 201, "Create user successfully", newUser);
    } catch (error) {
      next(error);
    }
  };

  private readonly updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const updatedUser = await this.userService.updateUser(userId, req.body);
      return sendResponse(
        res,
        true,
        200,
        "Update user successfully",
        updatedUser
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const role = req.body.role as Role;
      const updatedUser = await this.userService.updateUserRole(userId, role);
      return sendResponse(
        res,
        true,
        200,
        "Update user role successfully",
        updatedUser
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(req.params.id, 10);
      this.userService.deleteUser(userId);
      return sendResponse(res, true, 200, "Delete user successfully");
    } catch (error) {
      next(error);
    }
  };

  private readonly changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
      const userId = parseInt(id, 10);
      const result = await this.userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      return sendResponse(
        res,
        true,
        200,
        "Change password successfully",
        result
      );
    } catch (error) {
      next(error);
    }
  };

  private readonly joinClass = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, class_join_code } = req.params;
      const userId = parseInt(id, 10);
      await this.userService.joinClass(userId, class_join_code);
      return sendResponse(res, true, 200, "Join class successfully");
    } catch (error) {
      next(error);
    }
  };

  private readonly addClass = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const teacherId = parseInt(id, 10);
      const classData = req.body;
      await this.userService.addClass(teacherId, classData);
      return sendResponse(res, true, 200, "Add class successfully");
    } catch (error) {
      next(error);
    }
  };

  private readonly leaveClass = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, class_id } = req.params;
      const userId = parseInt(id, 10);
      const classId = parseInt(class_id, 10);
      await this.userService.leaveClass(userId, classId);
      return sendResponse(res, true, 200, "Leave class successfully");
    } catch (error) {
      next(error);
    }
  };

  private readonly getUserByRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const role = req.body.role as Role;
      const users = await this.userService.getUserByRole(role);
      return sendResponse(
        res,
        true,
        200,
        "Get user by role successfully",
        users
      );
    } catch (error) {
      next(error);
    }
  };
}
