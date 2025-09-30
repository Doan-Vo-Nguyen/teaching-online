## Attendance - Tổng hợp API cho FE

### 1) Role mới
- receptionist: lễ tân (điểm danh). Đã thêm vào enum `Role` và middleware:
  - authorReceptionist
  - authorAdOrReceptionist (admin hoặc lễ tân)

### 2) Entities (TypeORM)
- AttendanceSchedule (bảng lịch học)
  - schedule_id: number (PK)
  - class_id: number (FK -> Classes.class_id)
  - start_time: Date (datetime)
  - end_time: Date (datetime)
  - room: string | null
  - note: string | null
  - created_at: Date
  - updated_at: Date

- AttendanceRecord (bảng điểm danh)
  - attendance_id: number (PK)
  - schedule_id: number (FK -> AttendanceSchedule.schedule_id)
  - student_id: number (FK -> Users.user_id)
  - check_in_at: Date | null
  - check_out_at: Date | null
  - status: 'present' | 'late' | 'absent' (default 'present')
  - created_at: Date
  - updated_at: Date

### 3) Base path controller
- Tất cả endpoint nằm dưới: `/app/attendance` (đã gắn auth + audit ở layer app)
- Cần `Authorization: Bearer <token>` và role: admin hoặc receptionist

### 4) Endpoints

1. Import lịch từ Excel
   - POST `/app/attendance/import`
   - Auth: bearer, role: admin|receptionist
   - Payload:
     - multipart/form-data: file (binary)
     - hoặc application/json: `{ "file_base64": string }`
   - Response 200: `{ imported: number }`

2. Lấy danh sách lịch học
   - GET `/app/attendance/schedules`
   - Auth: bearer, role: admin|receptionist
   - Query (tùy chọn):
     - `class_id`: number
     - `from`: ISO datetime
     - `to`: ISO datetime
   - Response 200: `AttendanceSchedule[]`

3. Tạo lịch học
   - POST `/app/attendance/schedules`
   - Auth: bearer, role: admin|receptionist
   - Body (JSON):
     - `class_id` (number, required)
     - `start_time` (ISO datetime, required)
     - `end_time` (ISO datetime, required)
     - `room` (string, optional)
     - `note` (string, optional)
   - Response 201: `AttendanceSchedule`

4. Cập nhật lịch học
   - PATCH `/app/attendance/schedules/{id}`
   - Auth: bearer, role: admin|receptionist
   - Path: `id` = schedule_id (number)
   - Body (JSON): bất kỳ trường nào của `AttendanceSchedule` (trừ PK)
   - Response 200: `AttendanceSchedule`

5. Xóa lịch học
   - DELETE `/app/attendance/schedules/{id}`
   - Auth: bearer, role: admin|receptionist
   - Path: `id` = schedule_id (number)
   - Response 204: no content

6. Check-in học sinh
   - POST `/app/attendance/attendance/{scheduleId}/check-in`
   - Auth: bearer, role: admin|receptionist
   - Path: `scheduleId` (number)
   - Body (JSON): `{ "student_id": number }`
   - Response 200: `AttendanceRecord`

7. Check-out học sinh
   - POST `/app/attendance/attendance/{scheduleId}/check-out`
   - Auth: bearer, role: admin|receptionist
   - Path: `scheduleId` (number)
   - Body (JSON): `{ "student_id": number }`
   - Response 200: `AttendanceRecord`

### 5) Swagger
- File YAML: `src/docs/swagger/entities/attendance.schema.yaml`
- UI: `/api-docs` (Swagger UI). Nhóm tag: `Attendance`.

### 6) Ghi chú tích hợp FE
- Luồng cơ bản lễ tân:
  1) Import lịch (hoặc tạo thủ công)
  2) List lịch theo ngày/lớp
  3) Chọn lịch -> điểm danh check-in/check-out theo học sinh
- FE cần token với role `receptionist` hoặc `admin`.

