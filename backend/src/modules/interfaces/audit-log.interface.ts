import { AuditLog } from "../entity/AuditLog.mongo"
import { IBaseRepository } from "./base.interface"

export interface IAuditLogRepository extends IBaseRepository<AuditLog> {
    findByUserId(userId: number): Promise<AuditLog[]>;
    findByAction(action: string): Promise<AuditLog[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]>;
    logUserAction(auditLog: Partial<AuditLog>): Promise<AuditLog>;
    updateLogEndTime(id: string, endTime: Date): Promise<AuditLog>;
} 