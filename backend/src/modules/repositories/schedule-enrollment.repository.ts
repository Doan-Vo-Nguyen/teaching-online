import { BaseRepository } from './base.repository'
import { AppDataSource } from '../../data-source'
import { ScheduleEnrollment } from '../entity/ScheduleEnrollment.entity'
import { IScheduleEnrollmentRepository } from '../interfaces/attendance.interface'

export class ScheduleEnrollmentRepository extends BaseRepository<ScheduleEnrollment> implements IScheduleEnrollmentRepository {
    constructor() {
        super(ScheduleEnrollment)
    }

    async listBySchedule(scheduleId: number): Promise<ScheduleEnrollment[]> {
        return await this.repository.find({ where: { schedule_id: scheduleId } as any })
    }

    async addStudents(scheduleId: number, studentIds: number[]): Promise<ScheduleEnrollment[]> {
        if (!studentIds?.length) return []
        const repo = AppDataSource.getRepository(ScheduleEnrollment)
        const entities = repo.create(studentIds.map(id => ({ 
            schedule_id: scheduleId, 
            student_id: id 
        })))
        return await repo.save(entities)
    }

    async removeStudent(scheduleId: number, studentId: number): Promise<void> {
        const entity = await this.repository.findOne({ where: { schedule_id: scheduleId, student_id: studentId } as any })
        if (entity) await this.repository.remove(entity)
    }
}


