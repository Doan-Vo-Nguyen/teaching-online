import { IBaseRepository } from "./base.interface";
import { AttendanceSchedule } from "../entity/AttendanceSchedule.entity";
import { AttendanceRecord } from "../entity/AttendanceRecord.entity";
import { AttendanceSession } from "../entity/AttendanceSession.entity";
import { ScheduleEnrollment } from "../entity/ScheduleEnrollment.entity";

export interface IAttendanceRepository extends IBaseRepository<AttendanceSchedule> {
    findSchedules(options: any): Promise<AttendanceSchedule[]>;
    createSchedule(data: Partial<AttendanceSchedule>): Promise<AttendanceSchedule>;
    updateSchedule(id: number, data: Partial<AttendanceSchedule>): Promise<AttendanceSchedule>;
    deleteSchedule(id: number): Promise<void>;

    checkIn(sessionId: number, studentId: number, status?: 'present' | 'late' | 'absent' | 'excused' | 'other'): Promise<AttendanceRecord>;
    checkOut(sessionId: number, studentId: number): Promise<AttendanceRecord>;

    // Query records
    listRecords(sessionId: number, studentId?: number): Promise<AttendanceRecord[]>;

    deleteAllByClassSignature(class_signature: string): Promise<number>;
    bulkInsert(items: Array<Partial<AttendanceSchedule>>): Promise<AttendanceSchedule[]>;
}

export interface IAttendanceSessionRepository extends IBaseRepository<AttendanceSession> {
    listBySchedule(scheduleId: number): Promise<AttendanceSession[]>;
    createMany(scheduleId: number, items: Array<Partial<AttendanceSession>>): Promise<AttendanceSession[]>;
    updateSession(sessionId: number, data: Partial<AttendanceSession>): Promise<AttendanceSession>;
    deleteBySchedule(scheduleId: number): Promise<number>;
}

export interface IScheduleEnrollmentRepository extends IBaseRepository<ScheduleEnrollment> {
    listBySchedule(scheduleId: number): Promise<ScheduleEnrollment[]>;
    addStudents(scheduleId: number, studentIds: number[]): Promise<ScheduleEnrollment[]>;
    removeStudent(scheduleId: number, studentId: number): Promise<void>;
}


