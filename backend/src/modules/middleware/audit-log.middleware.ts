import { Response, NextFunction } from 'express';
import { IRequest } from '../types/IRequest';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import { ActionType } from '../entity/AuditLog.mongo';

const auditLogRepository = new AuditLogRepository();

/**
 * Helper function to convert UTC date to Vietnam timezone (UTC+7)
 */
const getVietnamTime = (): Date => {
    const now = new Date();
    // Add 7 hours to UTC time for Vietnam timezone
    const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    return vietnamTime;
};

/**
 * Middleware that logs user actions automatically
 * @param action The type of action being performed
 * @param options Additional options for the audit log
 */
export const auditLog = (action: ActionType, options?: {
    getTargetId?: (req: IRequest) => number | null;
    getTargetType?: (req: IRequest) => string | null;
    getDetails?: (req: IRequest) => string | null;
}) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        // Check if user data exists either in req.user or res.locals.userData
        const userData = req.user || res.locals.userData;
        
        // Skip logging if user data is not available
        if (!userData) {
            return next();
        }
        
        // Check if user is a student - only log student activities
        const userRoles = userData.role || [];
        const isStudent = userRoles.some(role => role.toLowerCase() === 'student');
        
        // Skip logging for non-student users (teachers, admins)
        if (!isStudent) {
            return next();
        }

        try {
            // Create the audit log entry
            const auditLogEntry = {
                user_id: userData.id,
                username: userData.username,
                fullname: userData.fullname,
                action,
                ip_address: req.ip,
                user_agent: req.get('user-agent'),
                page_url: req.originalUrl,
                target_id: options?.getTargetId ? options.getTargetId(req) : null,
                target_type: options?.getTargetType ? options.getTargetType(req) : null,
                details: options?.getDetails ? options.getDetails(req) : null,
                start_time: getVietnamTime() // Use Vietnam timezone
            };

            // Save the audit log
            const savedLog = await auditLogRepository.logUserAction(auditLogEntry);

            // Store the audit log ID in the request for later use
            req.auditLogId = savedLog?.id?.toString();

            // Capture response finish event to update end_time
            res.on('finish', async () => {
                try {
                    if (req.auditLogId) {
                        await auditLogRepository.updateLogEndTime(req.auditLogId, getVietnamTime());
                    }
                } catch (error) {
                    console.error('Error updating audit log end time:', error);
                }
            });

            next();
        } catch (error) {
            // Don't block the request if logging fails
            console.error('Error creating audit log:', error);
            next();
        }
    };
};

// Predefined middleware for common actions
export const logLogin = auditLog(ActionType.LOGIN);
export const logLogout = auditLog(ActionType.LOGOUT);

// Middleware for logging page views
export const logPageView = auditLog(ActionType.VIEW_PAGE);

// Middleware for logging exam actions
export const logExamStart = auditLog(ActionType.TAKE_EXAM, {
    getTargetId: (req) => parseInt(req.params.examId),
    getTargetType: () => 'exam'
});

// Middleware for logging meeting actions
export const logMeetingJoin = auditLog(ActionType.JOIN_MEETING, {
    getTargetId: (req) => parseInt(req.params.meetingId),
    getTargetType: () => 'meeting'
});

export const logMeetingLeave = auditLog(ActionType.LEAVE_MEETING, {
    getTargetId: (req) => parseInt(req.params.meetingId),
    getTargetType: () => 'meeting'
}); 