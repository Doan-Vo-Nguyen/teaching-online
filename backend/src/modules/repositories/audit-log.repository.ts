import { AppDataSource2 } from "../../data-source";
import { IAuditLogRepository } from "../interfaces/audit-log.interface";
import { AuditLog, ActionType } from "../entity/AuditLog.mongo";
import { Between } from "typeorm";

export class AuditLogRepository implements IAuditLogRepository {
    private readonly repository = AppDataSource2.getRepository(AuditLog);

    async find(options: any): Promise<AuditLog[]> {
        return this.repository.find(options);
    }

    async findById(id: number): Promise<AuditLog> {
        // For MongoDB, id is not a number but an ObjectId string
        return this.repository.findOneBy({ id: id.toString() as any });
    }

    async findByUserId(userId: number): Promise<AuditLog[]> {
        return this.repository.find({ where: { user_id: userId } });
    }

    async findByAction(action: string): Promise<AuditLog[]> {
        return this.repository.find({ where: { action: action as ActionType } });
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
        return this.repository.find({
            where: {
                start_time: Between(startDate, endDate)
            }
        });
    }

    async save(auditLog: AuditLog): Promise<AuditLog> {
        return this.repository.save(auditLog);
    }

    async logUserAction(auditLogData: Partial<AuditLog>): Promise<AuditLog> {
        try {
            const auditLog = this.repository.create(auditLogData as AuditLog);
            return this.repository.save(auditLog);
        } catch (error) {
            console.error('Error in logUserAction:', error);
            return null;
        }
    }

    async update(id: number, auditLog: Partial<AuditLog>): Promise<AuditLog> {
        try {
            await this.repository.update(id, auditLog as any);
            return this.findById(id);
        } catch (error) {
            console.error('Error in update:', error);
            return null;
        }
    }

    async updateLogEndTime(id: string, endTime: Date): Promise<AuditLog> {
        try {
            // For MongoDB with TypeORM, we need to fetch first
            const auditLog = await this.repository.findOneBy({ id: id as any });
            
            if (!auditLog) {
                return null;
            }
            
            auditLog.end_time = endTime;
            
            // Calculate duration in seconds
            const startTime = auditLog.start_time.getTime();
            const endTimeMs = endTime.getTime();
            auditLog.duration_seconds = Math.floor((endTimeMs - startTime) / 1000);
            
            return this.repository.save(auditLog);
        } catch (error) {
            console.error('Error in updateLogEndTime:', error);
            return null;
        }
    }

    async delete(id: number): Promise<AuditLog> {
        try {
            const auditLog = await this.repository.findOneBy({ id: id.toString() as any });
            if (!auditLog) {
                return null;
            }
            await this.repository.remove(auditLog);
            return auditLog;
        } catch (error) {
            console.error('Error in delete:', error);
            return null;
        }
    }
} 