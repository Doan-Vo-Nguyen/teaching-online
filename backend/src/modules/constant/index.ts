export const TOKEN_EXPIRE = 60 * 60 * 12; // 12 hours
export const REFRESH_TOKEN_EXPIRE = 60 * 60 * 24 * 7; // 7 days
export const RESET_CODE_EXPIRE = 60 * 10 * 1000; // 10 minutes

export enum Role {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}

export enum LectureType {
    DOCUMENTS = 'documents',
    VIDEOS = 'videos',
}

export enum ExamType {
    QUIZ = "quiz",
    TEST = "test",
    MIDTERM = "midterm",
    FINAL = "final"
}

export enum ExamTypeForStudent {
    COMMON = "common",
    IT = "it",
}
