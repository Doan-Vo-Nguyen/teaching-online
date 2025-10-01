import { IAttendanceRepository } from "../interfaces/attendance.interface";
import { AttendanceRepository } from "../repositories/attendance.repository";
import { ApiError } from "../types/ApiError";
import { FIELD_REQUIRED, NOT_FOUND, CREATE_FAILED } from "../DTO/resDto/BaseErrorDto";
import { ClassesRepository } from "../repositories/classes.repository";
import { UserRepository } from "../repositories/users.repository";
import { Role } from "../constant";
import bcrypt from "bcrypt";
import * as XLSX from "xlsx";
import { AttendanceSessionRepository } from "../repositories/attendance-session.repository";
import { ScheduleEnrollmentRepository } from "../repositories/schedule-enrollment.repository";
import { AttendanceSession } from "../entity/AttendanceSession.entity";
import { AttendanceRecord } from "../entity/AttendanceRecord.entity";
import { AppDataSource } from "../../data-source";

type ImportMode = 'create_only' | 'upsert' | 'replace';

interface ImportRowDto {
  class_signature: string;
  start_time: string;
  end_time: string;
  room?: string | null;
  note?: string | null;
  student_fullname?: string;
  student_dob?: string;
  student_phone?: string;
  student_email?: string;
  student_external_id?: string;
}

interface ImportOptions {
  mode: ImportMode;
  auto_create_accounts?: boolean;
  class_signature: string;
}

class AttendanceService {
  private readonly attendanceRepository: IAttendanceRepository = new AttendanceRepository();
  private readonly sessionRepository: AttendanceSessionRepository = new AttendanceSessionRepository();
  private readonly enrollmentRepository: ScheduleEnrollmentRepository = new ScheduleEnrollmentRepository();

  // BỎ import: chuyển sang nhập tay (bao gồm tạo 1 hoặc nhiều bản ghi)
  public async createSchedulesManually(payload: { class_signature: string; items: Array<{
    name?: string | null;
    room?: 'STEM' | 'SCRATCH' | string | null;
    capacity?: number | null;
    teacher_id?: number | null;
    note?: string | null;
  }>; }) {
    if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    if (!payload.class_signature) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }

    const parsedItems: Array<any> = [];
    for (const it of payload.items) {
      const normalizedRoom = this.normalizeRoom(it.room ?? null);
      if (it.room != null && normalizedRoom == null) {
        throw new ApiError(400, 'VALIDATION_FAILED', { field: 'room', message: 'Room phải là STEM hoặc SCRATCH' } as any);
      }
      parsedItems.push({
        class_signature: payload.class_signature,
        name: it.name ?? null,
        room: normalizedRoom,
        capacity: it.capacity ?? null,
        teacher_id: it.teacher_id ?? null,
        note: it.note ?? null,
      } as any);
    }

    const saved = await this.attendanceRepository.bulkInsert(parsedItems);
    return saved;
  }

  private parseCsvLikeBuffer(buf: Buffer): ImportRowDto[] {
    // Tối giản: hỗ trợ CSV từ Excel xuất ra (header theo guide)
    const text = buf.toString('utf8');
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (!lines.length) return [];
    const header = lines[0].split(',').map(h => h.trim());
    const rows: ImportRowDto[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = this.splitCsvLine(lines[i]);
      const obj: any = {};
      header.forEach((h, idx) => { obj[h] = (cols[idx] ?? '').trim(); });
      rows.push(obj as ImportRowDto);
    }
    return rows;
  }

  private splitCsvLine(line: string): string[] {
    // đơn giản: tách theo dấu phẩy, không xử lý quote phức tạp
    return line.split(',');
  }

  private tryParseXlsx(buf: Buffer): ImportRowDto[] {
    try {
      const wb = XLSX.read(buf, { type: 'buffer' });
      const wsName = wb.SheetNames[0];
      if (!wsName) return [];
      const ws = wb.Sheets[wsName];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      // Chuẩn hoá header về đúng key theo guide
      const rows = json.map((r: any) => ({
        class_signature: String(r.class_signature || r.Class_Signature || r["class signature"] || "").trim(),
        start_time: String(r.start_time || r.Start_Time || r["start time"] || "").trim(),
        end_time: String(r.end_time || r.End_Time || r["end time"] || "").trim(),
        room: this.normalizeRoom(r.room || r.Room || null),
        note: (r.note || r.Note || null) ? String(r.note || r.Note).trim() : null,
        student_fullname: String(r.student_fullname || r.Student_Fullname || r["student fullname"] || "").trim(),
        student_dob: String(r.student_dob || r.Student_DOB || r["student dob"] || "").trim(),
        student_phone: String(r.student_phone || r.Student_Phone || r["student phone"] || "").trim(),
        student_email: String(r.student_email || r.Student_Email || r["student email"] || "").trim().toLowerCase(),
        student_external_id: String(r.student_external_id || r.Student_External_Id || r["student external id"] || "").trim(),
      }));
      // Nếu không có start_time/end_time, coi như không phù hợp chuẩn
      const hasSchedule = rows.some(r => r.start_time && r.end_time);
      return hasSchedule ? rows : [];
    } catch {
      return [];
    }
  }

  private tryParseCustomGridXlsx(buf: Buffer, classSignatureFromInput?: string): ImportRowDto[] {
    try {
      const wb = XLSX.read(buf, { type: 'buffer' });
      const wsName = wb.SheetNames[0];
      if (!wsName) return [];
      const ws = wb.Sheets[wsName];

      // Lấy toàn bộ text vùng đầu trang (A1:Q10) để tìm tiêu đề và thời gian
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z50');
      const topRows = Math.min(12, range.e.r);
      let titleText = '';
      let timeText = '';
      for (let r = 0; r <= topRows; r++) {
        let line = '';
        for (let c = 0; c <= Math.min(range.e.c, 20); c++) {
          const cell = ws[XLSX.utils.encode_cell({ r, c })];
          if (cell && typeof cell.v !== 'undefined') {
            line += String(cell.v) + ' ';
          }
        }
        const normalized = line.trim();
        if (!titleText && /l[ịi]ch học lớp/i.test(normalized)) titleText = normalized;
        if (!timeText && /thời gian học/i.test(normalized)) timeText = normalized;
      }

      // class_signature
      let classSig = classSignatureFromInput || '';
      const mClass = titleText.match(/l[ịi]ch học lớp\s+([A-Za-z0-9_-]+)/i);
      if (!classSig && mClass) classSig = mClass[1];
      if (!classSig) return [];

      // Năm từ tiêu đề nếu có
      let year: number | null = null;
      const mYear = titleText.match(/(\d{4})/);
      if (mYear) year = parseInt(mYear[1], 10);
      if (!year) year = new Date().getFullYear();

      // Giờ bắt đầu/kết thúc: "Thời gian học: 17h30 - 19h00"
      let startH = 17, startM = 30, endH = 19, endM = 0;
      const mTime = timeText.match(/(\d{1,2})h(\d{2})\s*-\s*(\d{1,2})h(\d{2})/i);
      if (mTime) {
        startH = parseInt(mTime[1], 10); startM = parseInt(mTime[2], 10);
        endH = parseInt(mTime[3], 10); endM = parseInt(mTime[4], 10);
      }

      // Tìm hàng chứa các ngày dd/mm ở phần header (quét 5-10 hàng đầu)
      const dateRegex = /(\d{1,2})\/(\d{1,2})/;
      const dateCells: Array<{ r: number; c: number; dd: number; mm: number; }> = [];
      for (let r = 4; r <= Math.min(12, range.e.r); r++) {
        for (let c = 0; c <= range.e.c; c++) {
          const cell = ws[XLSX.utils.encode_cell({ r, c })];
          const v = cell?.v;
          if (v != null) {
            const s = String(v).trim();
            const m = s.match(dateRegex);
            if (m) {
              dateCells.push({ r, c, dd: parseInt(m[1], 10), mm: parseInt(m[2], 10) });
            }
          }
        }
        if (dateCells.length >= 3) break; // đã tìm thấy đủ cột ngày
      }
      if (!dateCells.length) return [];

      const rows: ImportRowDto[] = [];
      for (const dc of dateCells) {
        const dd = String(dc.dd).padStart(2, '0');
        const mm = String(dc.mm).padStart(2, '0');
        const yyyy = String(year);
        const startIso = `${yyyy}-${mm}-${dd}T${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}:00Z`;
        const endIso = `${yyyy}-${mm}-${dd}T${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}:00Z`;
        rows.push({ class_signature: classSig, start_time: startIso, end_time: endIso });
      }
      return rows;
    } catch {
      return [];
    }
  }

  private parseDateRange(start: string, end: string): { start: Date | null; end: Date | null } {
    return { 
      start: this.tryParseDate(start), 
      end: this.tryParseDate(end) 
    };
  }

  private tryParseDate(s: string): Date | null {
    // ISO
    const d1 = new Date(s);
    if (!isNaN(d1.getTime())) return d1;
    // dd/MM/yyyy HH:mm
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
    if (m) {
      const [_, dd, MM, yyyy, HH, mm] = m;
      const iso = `${yyyy}-${MM}-${dd}T${HH}:${mm}:00Z`;
      const d2 = new Date(iso);
      if (!isNaN(d2.getTime())) return d2;
    }
    return null;
  }

  private async autoCreateStudentIfNeeded(r: ImportRowDto, warnings: string[]): Promise<boolean> {
    const userRepo = new UserRepository();
    const fullname = (r.student_fullname || '').trim();
    const email = (r.student_email || '').trim().toLowerCase();
    const phone = (r.student_phone || '').trim();
    const dobStr = (r.student_dob || '').trim();

    // Check existing by email or phone or fullname+dob (đơn giản theo khả dụng)
    if (email) {
      const byEmail = await userRepo.findByEmail(email);
      if (byEmail) return false;
    }
    if (phone) {
      const existedByPhone = await userRepo.find({ where: { phone } as any } as any);
      if (Array.isArray(existedByPhone) && existedByPhone.length) return false;
    }

    let dob: Date | null = null;
    if (dobStr) {
      const m = dobStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) {
        const [_, dd, MM, yyyy] = m;
        dob = new Date(`${yyyy}-${MM}-${dd}T00:00:00Z`);
      } else {
        const d = new Date(dobStr);
        if (!isNaN(d.getTime())) dob = d; else dob = null;
      }
    } else {
      warnings.push('Thiếu student_dob, bỏ qua tạo tài khoản');
      return false;
    }

    // Generate username/password
    const { username, password } = await this.generateCreds(fullname, dob!);

    const toSave: any = {
      username,
      password: bcrypt.hashSync(password, 10),
      fullname,
      email: email || `${username}@placeholder.local`,
      phone: phone || null,
      dob,
      role: Role.STUDENT,
    };

    await userRepo.save(toSave);
    return true;
  }

  private async generateCreds(fullname: string, dob: Date): Promise<{ username: string; password: string }> {
    const lastToken = fullname.trim().split(/\s+/).slice(-1)[0] || 'student';
    const dd = String(dob.getUTCDate()).padStart(2, '0');
    const mm = String(dob.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = String(dob.getUTCFullYear());
    const base = `${lastToken}${dd}${mm}${yyyy}`;
    const specials = ['!', '#', '%', '&', '*', '+', '=', '?'];

    const userRepo = new UserRepository();
    let candidate = base;
    for (let i = 0; i < 5; i++) {
      const existed = await userRepo.find({ where: { username: candidate } as any } as any);
      if (!Array.isArray(existed) || existed.length === 0) {
        return { username: candidate, password: `${base}@` };
      }
      candidate = `${base}${specials[i % specials.length]}`;
    }
    return { username: `${base}${Date.now() % 100}`, password: `${base}@` };
  }

  public async getSchedules(query: any) {
    const result = await this.attendanceRepository.findSchedules(query || {});
    return result;
  }

  public async createSchedule(data: any & { class_signature?: string; }) {
    this.validateRequiredField(data, 'class_signature');
    const normalizedRoom = this.normalizeRoom(data.room ?? null);
    if (data.room != null && normalizedRoom == null) {
      throw new ApiError(400, 'VALIDATION_FAILED', { field: 'room', message: 'Room phải là STEM hoặc SCRATCH' } as any);
    }
    const created = await this.attendanceRepository.createSchedule({
      class_signature: data.class_signature,
      name: data.name ?? null,
      room: normalizedRoom,
      capacity: data.capacity ?? null,
      teacher_id: data.teacher_id ?? null,
      note: data.note ?? null,
    } as any);
    if (!created) {
      throw new ApiError(400, CREATE_FAILED.error.message, CREATE_FAILED.error.details);
    }
    return created;
  }

  // ---- Sessions ----
  public async listSessions(scheduleId: number) {
    this.validateRequiredField({ scheduleId }, 'scheduleId');
    return await this.sessionRepository.listBySchedule(scheduleId);
  }

  public async createSessions(scheduleId: number, items: Array<{ start_at: string | Date; end_at: string | Date; room?: 'STEM' | 'SCRATCH' | string | null; status?: 'planned'|'canceled'|'done'; }>) {
    this.validateRequiredField({ scheduleId }, 'scheduleId');
    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }
    const parsed: Array<Partial<AttendanceSession>> = [];
    for (const it of items) {
      const start = this.parseDateTimeFlexible(null, it.start_at as any);
      const end = this.parseDateTimeFlexible(null, it.end_at as any);
      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        throw new ApiError(400, 'VALIDATION_FAILED', { message: 'Thời gian buổi không hợp lệ' } as any);
      }
      const normalizedRoom = this.normalizeRoom(it.room ?? null);
      if (it.room != null && normalizedRoom == null) {
        throw new ApiError(400, 'VALIDATION_FAILED', { field: 'room', message: 'Room phải là STEM hoặc SCRATCH' } as any);
      }
      parsed.push({ start_at: start, end_at: end, room: normalizedRoom, status: it.status ?? 'planned' });
    }
    return await this.sessionRepository.createMany(scheduleId, parsed);
  }

  public async updateSession(scheduleId: number, sessionId: number, data: Partial<AttendanceSession>) {
    this.validateRequiredField({ scheduleId, sessionId }, 'scheduleId');
    this.validateRequiredField({ scheduleId, sessionId }, 'sessionId');
    // Optional: verify session belongs to scheduleId
    return await this.sessionRepository.updateSession(sessionId, data);
  }

  public async regenerateSessions(scheduleId: number, items: Array<{ start_at: string | Date; end_at: string | Date; room?: 'STEM' | 'SCRATCH' | string | null; status?: 'planned'|'canceled'|'done'; }>) {
    this.validateRequiredField({ scheduleId }, 'scheduleId');
    await this.sessionRepository.deleteBySchedule(scheduleId);
    return await this.createSessions(scheduleId, items);
  }

  // ---- Enrollments ----
  public async listEnrollments(scheduleId: number) {
    this.validateRequiredField({ scheduleId }, 'scheduleId');
    return await this.enrollmentRepository.listBySchedule(scheduleId);
  }

  public async addEnrollments(scheduleId: number, payload: { student_id?: number; studentIds?: number[]; session_id?: number; session_ids?: number[] }) {
    this.validateRequiredField({ scheduleId }, 'scheduleId');

    // Chuẩn hoá danh sách học sinh
    const studentIds: number[] = [];
    if (Array.isArray(payload?.studentIds) && payload.studentIds.length) studentIds.push(...payload.studentIds);
    if (payload?.student_id && !studentIds.includes(payload.student_id)) studentIds.push(payload.student_id);
    if (studentIds.length === 0) throw new ApiError(400, FIELD_REQUIRED.error.message, { field: 'student_id(s)' } as any);

    // Lấy danh sách sessions cần tạo record
    let sessionIds: number[] = [];
    if (Array.isArray(payload?.session_ids) && payload.session_ids.length) sessionIds = payload.session_ids.map(Number);
    else if (payload?.session_id) sessionIds = [Number(payload.session_id)];
    else {
      // Nếu không truyền, lấy toàn bộ buổi của lịch
      const sessions = await this.sessionRepository.listBySchedule(scheduleId);
      sessionIds = sessions.map(s => s.session_id);
    }
    if (sessionIds.length === 0) throw new ApiError(400, FIELD_REQUIRED.error.message, { field: 'session_id(s)' } as any);

    // Thêm enrollment, tránh trùng
    const existedEnrollments = await this.enrollmentRepository.listBySchedule(scheduleId);
    const existedStudentIds = new Set(existedEnrollments.map(e => e.student_id));
    const toCreateEnrollments = studentIds.filter(id => !existedStudentIds.has(id));
    if (toCreateEnrollments.length) {
      await this.enrollmentRepository.addStudents(scheduleId, toCreateEnrollments);
    }

    // Tạo AttendanceRecord cho mỗi (session, student)
    const recRepo = AppDataSource.getRepository(AttendanceRecord);
    for (const sid of sessionIds) {
      for (const studentId of studentIds) {
        const existed = await recRepo.findOne({ where: { session_id: sid, student_id: studentId } as any });
        if (!existed) {
          const rec = recRepo.create({ session_id: sid, student_id: studentId, status: 'present', check_in_at: null, check_out_at: null } as any);
          await recRepo.save(rec);
        }
      }
    }

    // Trả về danh sách enrollment hiện tại
    return await this.enrollmentRepository.listBySchedule(scheduleId);
  }

  public async removeEnrollment(scheduleId: number, studentId: number) {
    this.validateRequiredField({ scheduleId, studentId }, 'scheduleId');
    this.validateRequiredField({ scheduleId, studentId }, 'studentId');
    await this.enrollmentRepository.removeStudent(scheduleId, studentId);
  }

  // ---- Helpers ----
  private validateRequiredField(data: any, fieldName: string): void {
    if (!data || !data[fieldName]) {
      throw new ApiError(400, FIELD_REQUIRED.error.message, FIELD_REQUIRED.error.details);
    }
  }

  private parseDateOnly(dateInput?: string | Date | null): Date | null {
    if (!dateInput) return null;
    if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;
    const s = String(dateInput).trim();
    const m1 = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // dd/MM/yyyy
    if (m1) {
      const dd = m1[1], MM = m1[2], yyyy = m1[3];
      const d = new Date(`${yyyy}-${MM}-${dd}T00:00:00Z`);
      return isNaN(d.getTime()) ? null : d;
    }
    const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/); // yyyy-MM-dd
    if (m2) {
      const yyyy = m2[1], MM = m2[2], dd = m2[3];
      const d = new Date(`${yyyy}-${MM}-${dd}T00:00:00Z`);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  private parseTimeOnly(timeInput?: string | Date): { h: number; m: number } | null {
    if (!timeInput) return null;
    if (timeInput instanceof Date) {
      return { h: timeInput.getUTCHours(), m: timeInput.getUTCMinutes() };
    }
    const s = String(timeInput).trim();
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    if (isNaN(h) || isNaN(mm) || h < 0 || h > 23 || mm < 0 || mm > 59) return null;
    return { h, m: mm };
  }

  private parseDateTimeFlexible(dateInput: string | Date | null | undefined, timeInput: string | Date): Date | null {
    const tm = this.parseTimeOnly(timeInput);
    if (tm) {
      const d = this.parseDateOnly(dateInput ?? null);
      if (!d) return null;
      const yyyy = String(d.getUTCFullYear());
      const MM = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const HH = String(tm.h).padStart(2, '0');
      const mm = String(tm.m).padStart(2, '0');
      const iso = `${yyyy}-${MM}-${dd}T${HH}:${mm}:00Z`;
      const out = new Date(iso);
      return isNaN(out.getTime()) ? null : out;
    }
    if (typeof timeInput === 'string') {
      let s = timeInput.trim();
      // Chuẩn hoá một số biến thể ISO phổ biến
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?$/.test(s)) {
        s = s.replace(' ', 'T');
        if (!s.endsWith('Z')) s += 'Z';
      } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?$/.test(s)) {
        // thiếu Z -> thêm Z để đảm bảo UTC
        s = s + 'Z';
      }
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    const direct = timeInput instanceof Date ? timeInput : null;
    return (!direct || isNaN(direct.getTime())) ? null : direct;
  }

  private normalizeRoom(input: unknown): 'STEM' | 'SCRATCH' | null {
    if (input == null) return null;
    const v = String(input).trim().toUpperCase();
    if (v === 'STEM' || v === 'SCRATCH') return v as 'STEM' | 'SCRATCH';
    return null;
  }

  public async updateSchedule(id: number, data: any) {
    this.validateRequiredField({ id }, 'id');
    const updated = await this.attendanceRepository.updateSchedule(id, data);
    return updated;
  }

  public async deleteSchedule(id: number) {
    this.validateRequiredField({ id }, 'id');
    await this.attendanceRepository.deleteSchedule(id);
  }

  public async checkIn(sessionId: number, studentId: number, status?: 'present'|'late'|'absent'|'excused'|'other') {
    this.validateRequiredField({ sessionId, studentId }, 'sessionId');
    this.validateRequiredField({ sessionId, studentId }, 'studentId');
    if (status && !['present','late','absent','excused','other'].includes(status)) {
      throw new ApiError(400, 'VALIDATION_FAILED', { field: 'status', message: 'Trạng thái không hợp lệ' } as any);
    }
    return this.attendanceRepository.checkIn(sessionId, studentId, status);
  }

  public async checkOut(sessionId: number, studentId: number) {
    this.validateRequiredField({ sessionId, studentId }, 'sessionId');
    this.validateRequiredField({ sessionId, studentId }, 'studentId');
    return this.attendanceRepository.checkOut(sessionId, studentId);
  }

  public async getRecords(sessionId: number, studentId?: number) {
    this.validateRequiredField({ sessionId }, 'sessionId');
    return this.attendanceRepository.listRecords(sessionId, studentId);
  }
}

export default AttendanceService;


