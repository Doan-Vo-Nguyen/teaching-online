import { BaseRepository } from './base.repository'
import { AppDataSource } from '../../data-source'
import { AttendanceSession } from '../entity/AttendanceSession.entity'
import { IAttendanceSessionRepository } from '../interfaces/attendance.interface'

export class AttendanceSessionRepository extends BaseRepository<AttendanceSession> implements IAttendanceSessionRepository {
    constructor() {
        super(AttendanceSession)
    }

    async listBySchedule(scheduleId: number): Promise<AttendanceSession[]> {
        return await this.repository.find({ where: { schedule_id: scheduleId } as any, order: { start_at: 'ASC' } as any })
    }

    async createMany(scheduleId: number, items: Array<Partial<AttendanceSession>>): Promise<AttendanceSession[]> {
        const repo = AppDataSource.getRepository(AttendanceSession)
        const entities = repo.create(items.map(it => ({
            schedule_id: scheduleId,
            start_at: it.start_at!,
            end_at: it.end_at!,
            room: it.room ?? null,
            status: it.status ?? 'planned',
        })))
        return await repo.save(entities)
    }

    async updateSession(sessionId: number, data: Partial<AttendanceSession>): Promise<AttendanceSession> {
        await this.repository.update({ session_id: sessionId } as any, data as any)
        const updated = await this.repository.findOneBy({ session_id: sessionId } as any)
        return updated as AttendanceSession
    }

    async deleteBySchedule(scheduleId: number): Promise<number> {
        const res = await this.repository.createQueryBuilder()
            .delete()
            .from(AttendanceSession)
            .where('schedule_id = :scheduleId', { scheduleId })
            .execute()
        return res.affected || 0
    }
}


