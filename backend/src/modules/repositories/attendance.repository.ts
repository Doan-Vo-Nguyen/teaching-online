import { BaseRepository } from './base.repository';
import { IAttendanceRepository } from '../interfaces/attendance.interface';
import { AttendanceSchedule } from '../entity/AttendanceSchedule.entity';
import { AppDataSource } from '../../data-source';
import { AttendanceRecord } from '../entity/AttendanceRecord.entity';
import { AttendanceSession } from '../entity/AttendanceSession.entity';

export class AttendanceRepository extends BaseRepository<AttendanceSchedule> implements IAttendanceRepository {
    constructor() {
        super(AttendanceSchedule);
    }

    async findSchedules(options: any): Promise<AttendanceSchedule[]> {
        const qb = this.repository.createQueryBuilder('sch');
        if (options?.class_signature) qb.andWhere('sch.class_signature = :sig', { sig: options.class_signature });
        const items = await qb.orderBy('sch.created_at', 'DESC').getMany();
        return items as any;
    }

    async createSchedule(data: Partial<AttendanceSchedule>): Promise<AttendanceSchedule> {
        const repo = AppDataSource.getRepository(AttendanceSchedule);
        const entity = repo.create({
            class_signature: data.class_signature!,
            name: data.name ?? null,
            room: data.room ?? null,
            capacity: data.capacity ?? null,
            teacher_id: data.teacher_id ?? null,
            note: data.note ?? null,
        } as any);
        const saved = await repo.save(entity);
        return saved as any;
    }

    async updateSchedule(id: number, data: Partial<AttendanceSchedule>): Promise<AttendanceSchedule> {
        await this.repository.update({ schedule_id: id } as any, data as any);
        const updated = await this.repository.findOneBy({ schedule_id: id } as any);
        return updated as any;
    }

    async deleteSchedule(id: number): Promise<void> {
        const entity = await this.repository.findOneBy({ schedule_id: id } as any);
        if (entity) {
            await this.repository.remove(entity);
        }
    }

    async checkIn(sessionId: number, studentId: number): Promise<AttendanceRecord> {
        const recRepo = AppDataSource.getRepository(AttendanceRecord);
        let record = await recRepo.findOne({ where: { session_id: sessionId, student_id: studentId } });
        if (!record) {
            record = recRepo.create({ session_id: sessionId, student_id: studentId, check_in_at: new Date(), status: 'present' } as AttendanceRecord);
        } else {
            record.check_in_at = new Date();
        }
        const saved: AttendanceRecord = await recRepo.save(record as AttendanceRecord);
        return saved as AttendanceRecord;
    }

    async checkOut(sessionId: number, studentId: number): Promise<AttendanceRecord> {
        const recRepo = AppDataSource.getRepository(AttendanceRecord);
        let record = await recRepo.findOne({ where: { session_id: sessionId, student_id: studentId } });
        if (!record) {
            record = recRepo.create({ session_id: sessionId, student_id: studentId, check_out_at: new Date(), status: 'present' } as AttendanceRecord);
        } else {
            record.check_out_at = new Date();
        }
        const saved: AttendanceRecord = await recRepo.save(record as AttendanceRecord);
        return saved as AttendanceRecord;
    }

    // Header không còn start/end, nếu cần key tự nhiên hãy dựa vào (class_signature, name, room)

    async deleteAllByClassSignature(class_signature: string): Promise<number> {
        const res = await this.repository.createQueryBuilder()
            .delete()
            .from(AttendanceSchedule)
            .where('class_signature = :class_signature', { class_signature })
            .execute();
        return res.affected || 0;
    }

    async bulkInsert(items: Array<Partial<AttendanceSchedule>>): Promise<AttendanceSchedule[]> {
        if (!items?.length) return [] as any;
        const repo = AppDataSource.getRepository(AttendanceSchedule);
        const entities = repo.create(items as any);
        const saved = await repo.save(entities as any);
        return saved as any;
    }
}


