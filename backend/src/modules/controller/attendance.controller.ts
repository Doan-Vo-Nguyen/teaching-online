import { Request, Response, NextFunction } from "express";
import BaseController from "../abstracts/base-controller";
import { authorAdOrReceptionist, authentication, authorAdOrReceptionistOrTeacher } from "../middleware/auth.middleware";
import { sendResponse } from "../../common/interfaces/base-response";
import AttendanceService from "../services/attendance.service";
import multer from "multer";

export class AttendanceController extends BaseController {
  private readonly attendanceService: AttendanceService;
  private readonly upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

  constructor(path: string) {
    super(path);
    this.attendanceService = new AttendanceService();
    this.initRoutes();
  }

  public initRoutes(): void {
    // Bỏ import file, chuyển sang nhập tay
    this.router.get("/schedules", authentication, authorAdOrReceptionistOrTeacher, this.getSchedules);
    this.router.post("/schedules", authentication, authorAdOrReceptionist, this.createSchedule);
    this.router.post("/schedules/bulk", authentication, authorAdOrReceptionist, this.createSchedulesBulk);
    this.router.patch("/schedules/:id", authentication, authorAdOrReceptionist, this.updateSchedule);
    this.router.delete("/schedules/:id", authentication, authorAdOrReceptionist, this.deleteSchedule);

    // Sessions
    this.router.get("/schedules/:scheduleId/sessions", authentication, authorAdOrReceptionistOrTeacher, this.listSessions);
    this.router.post("/schedules/:scheduleId/sessions", authentication, authorAdOrReceptionistOrTeacher, this.createSessions);
    this.router.post("/schedules/:scheduleId/sessions:regenerate", authentication, authorAdOrReceptionistOrTeacher, this.regenerateSessions);
    this.router.patch("/schedules/:scheduleId/sessions/:sessionId", authentication, authorAdOrReceptionistOrTeacher, this.updateSession);

    this.router.post("/sessions/:sessionId/check-in", authentication, authorAdOrReceptionistOrTeacher, this.checkInStudent);
    this.router.post("/sessions/:sessionId/check-out", authentication, authorAdOrReceptionistOrTeacher, this.checkOutStudent);
    this.router.get("/sessions/:sessionId/records", authentication, authorAdOrReceptionistOrTeacher, this.listRecords);

    // Enrollments
    this.router.get("/schedules/:scheduleId/enrollments", authentication, authorAdOrReceptionist, this.listEnrollments);
    this.router.post("/schedules/:scheduleId/enrollments", authentication, authorAdOrReceptionist, this.addEnrollments);
    this.router.delete("/schedules/:scheduleId/enrollments/:studentId", authentication, authorAdOrReceptionist, this.removeEnrollment);
    // download template
    this.router.get("/import/template", authentication, authorAdOrReceptionist, this.downloadTemplate);
  }

  // route nhập tay hàng loạt
  private readonly createSchedulesBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.attendanceService.createSchedulesManually(req.body);
      return sendResponse(res, true, 201, "Created schedules successfully", result);
    } catch (error) {
      next(error);
    }
  };

  private readonly downloadTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = [
        'class_signature','start_time','end_time','room','note',
        'student_fullname','student_dob','student_phone','student_email','student_external_id'
      ];
      const content = headers.join(',') + "\n";
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance_import_template.csv"');
      return res.status(200).send(content);
    } catch (error) {
      next(error);
    }
  };

  private readonly getSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.attendanceService.getSchedules(req.query || {});
      return sendResponse(res, true, 200, "Get schedules successfully", items);
    } catch (error) {
      next(error);
    }
  };

  // ---- Sessions ----
  private readonly listSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const items = await this.attendanceService.listSessions(scheduleId);
      return sendResponse(res, true, 200, "Get sessions successfully", items);
    } catch (error) { next(error); }
  };

  private readonly createSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      const created = await this.attendanceService.createSessions(scheduleId, items);
      return sendResponse(res, true, 201, "Create sessions successfully", created);
    } catch (error) { next(error); }
  };

  private readonly regenerateSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      const created = await this.attendanceService.regenerateSessions(scheduleId, items);
      return sendResponse(res, true, 200, "Regenerate sessions successfully", created);
    } catch (error) { next(error); }
  };

  private readonly updateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const sessionId = parseInt(req.params.sessionId, 10);
      const updated = await this.attendanceService.updateSession(scheduleId, sessionId, req.body);
      return sendResponse(res, true, 200, "Update session successfully", updated);
    } catch (error) { next(error); }
  };

  private readonly createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await this.attendanceService.createSchedule(req.body);
      return sendResponse(res, true, 201, "Create schedule successfully", created);
    } catch (error) {
      next(error);
    }
  };

  private readonly updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await this.attendanceService.updateSchedule(id, req.body);
      return sendResponse(res, true, 200, "Update schedule successfully", updated);
    } catch (error) {
      next(error);
    }
  };

  private readonly deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.attendanceService.deleteSchedule(id);
      return sendResponse(res, true, 204, "Delete schedule successfully", null);
    } catch (error) {
      next(error);
    }
  };

  private readonly checkInStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = parseInt(req.params.sessionId, 10);
      const studentId = parseInt((req.body?.student_id || req.query?.student_id) as string, 10);
      const status = (req.body?.status || req.query?.status) as any;
      const record = await this.attendanceService.checkIn(sessionId, studentId, status);
      return sendResponse(res, true, 200, "Check-in successfully", record);
    } catch (error) {
      next(error);
    }
  };

  private readonly checkOutStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = parseInt(req.params.sessionId, 10);
      const studentId = parseInt((req.body?.student_id || req.query?.student_id) as string, 10);
      const record = await this.attendanceService.checkOut(sessionId, studentId);
      return sendResponse(res, true, 200, "Check-out successfully", record);
    } catch (error) {
      next(error);
    }
  };

  private readonly listRecords = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = parseInt(req.params.sessionId, 10);
      const studentId = req.query?.student_id ? parseInt(String(req.query.student_id), 10) : undefined;
      const items = await this.attendanceService.getRecords(sessionId, studentId);
      return sendResponse(res, true, 200, "Get attendance records successfully", items);
    } catch (error) { next(error); }
  };

  // ---- Enrollments ----
  private readonly listEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const items = await this.attendanceService.listEnrollments(scheduleId);
      return sendResponse(res, true, 200, "Get enrollments successfully", items);
    } catch (error) { next(error); }
  };

  private readonly addEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const created = await this.attendanceService.addEnrollments(scheduleId, req.body || {});
      return sendResponse(res, true, 201, "Add enrollments successfully", created);
    } catch (error) { next(error); }
  };

  private readonly removeEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId, 10);
      const studentId = parseInt(req.params.studentId, 10);
      await this.attendanceService.removeEnrollment(scheduleId, studentId);
      return sendResponse(res, true, 204, "Remove enrollment successfully", null);
    } catch (error) { next(error); }
  };
}

export default AttendanceController;


