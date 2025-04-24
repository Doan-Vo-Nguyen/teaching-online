import { Request, Response, NextFunction } from 'express';
import BaseController from "../abstracts/base-controller";
import AuditLogService from "../services/audit-log.service";
import { validParam } from "../middleware/validate/field.validate";
import { authorAdmin } from "../middleware/auth.middleware";
import { validateDto, validatePartialDto } from '../utils/dto-validator';
import { AuditLogDTO, AuditLogQueryDTO } from '../DTO/audit-log.dto';
import { ActionType } from '../entity/AuditLog.mongo';

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: API endpoints for audit logs management (admin only)
 */
export class AuditLogController extends BaseController {
    private readonly auditLogService: AuditLogService;

    constructor(path: string, auditLogService?: AuditLogService) {
        super(path);
        this.auditLogService = auditLogService || new AuditLogService();
        this.initRoutes();
    }

    public initRoutes(): void {
        // Routes accessible by admin users only
        this.router.get('/', authorAdmin, this.asyncHandler(this.getAllAuditLogs));
        this.router.get('/user/:userId', authorAdmin, validParam("userId"), this.asyncHandler(this.getAuditLogsByUserId));
        this.router.get('/action/:action', authorAdmin, validParam("action"), this.asyncHandler(this.getAuditLogsByAction));
        this.router.get('/:id', authorAdmin, validParam("id"), this.asyncHandler(this.getAuditLogById));
    }

    /**
     * @swagger
     * /app/audit-logs:
     *   get:
     *     tags: [Audit Logs]
     *     summary: Get all audit logs with optional filtering
     *     description: Returns a list of all audit logs. Admin access required.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: user_id
     *         in: query
     *         schema:
     *           type: integer
     *         description: Filter by user ID
     *       - name: action
     *         in: query
     *         schema:
     *           type: string
     *           enum: [login, logout, view_page, submit_assignment, take_exam, join_meeting, leave_meeting, comment, other]
     *         description: Filter by action type
     *       - name: start_date
     *         in: query
     *         schema:
     *           type: string
     *           format: date-time
     *         description: Filter by start date (inclusive)
     *       - name: end_date
     *         in: query
     *         schema:
     *           type: string
     *           format: date-time
     *         description: Filter by end date (inclusive)
     *     responses:
     *       200:
     *         description: A list of audit logs
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Admin access required
     */
    private readonly getAllAuditLogs = async (req: Request, res: Response) => {
        // Parse query parameters
        const filters: {
            user_id?: number;
            action?: ActionType;
            startDate?: Date;
            endDate?: Date;
        } = {};
        
        if (req.query.user_id) {
            filters.user_id = parseInt(req.query.user_id as string);
        }
        
        if (req.query.action && Object.values(ActionType).includes(req.query.action as ActionType)) {
            filters.action = req.query.action as ActionType;
        }
        
        if (req.query.start_date) {
            filters.startDate = new Date(req.query.start_date as string);
        }
        
        if (req.query.end_date) {
            filters.endDate = new Date(req.query.end_date as string);
        }
        
        const auditLogs = await this.auditLogService.getAllAuditLogs(filters);
        return this.sendSuccess(res, 200, "Get all audit logs successfully", auditLogs);
    }

    /**
     * @swagger
     * /app/audit-logs/{id}:
     *   get:
     *     tags: [Audit Logs]
     *     summary: Get an audit log by ID
     *     description: Returns a specific audit log by its ID. Admin access required.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the audit log
     *     responses:
     *       200:
     *         description: Audit log details
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Admin access required
     *       404:
     *         description: Audit log not found
     */
    private readonly getAuditLogById = async (req: Request, res: Response) => {
        const auditLogId = this.parseId(req.params.id);
        const auditLog = await this.auditLogService.getAuditLogById(auditLogId);
        return this.sendSuccess(res, 200, "Get audit log by id successfully", auditLog);
    }

    /**
     * @swagger
     * /app/audit-logs/user/{userId}:
     *   get:
     *     tags: [Audit Logs]
     *     summary: Get audit logs by user ID
     *     description: Returns all audit logs for a specific user. Admin access required.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the user
     *     responses:
     *       200:
     *         description: A list of audit logs for the specified user
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Admin access required
     */
    private readonly getAuditLogsByUserId = async (req: Request, res: Response) => {
        const userId = this.parseId(req.params.userId);
        const auditLogs = await this.auditLogService.getAuditLogsByUserId(userId);
        return this.sendSuccess(res, 200, "Get audit logs by user id successfully", auditLogs);
    }

    /**
     * @swagger
     * /app/audit-logs/action/{action}:
     *   get:
     *     tags: [Audit Logs]
     *     summary: Get audit logs by action type
     *     description: Returns all audit logs for a specific action type. Admin access required.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: action
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *           enum: [login, logout, view_page, submit_assignment, take_exam, join_meeting, leave_meeting, comment, other]
     *         description: Type of action
     *     responses:
     *       200:
     *         description: A list of audit logs for the specified action type
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Admin access required
     */
    private readonly getAuditLogsByAction = async (req: Request, res: Response) => {
        const action = req.params.action;
        const auditLogs = await this.auditLogService.getAuditLogsByAction(action);
        return this.sendSuccess(res, 200, "Get audit logs by action successfully", auditLogs);
    }
} 