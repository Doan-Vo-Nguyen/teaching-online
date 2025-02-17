export declare class ExamSubmissionDTO {
    exam_submission_id: number;
    exam_id: number;
    student_class_id: number;
    file_content: string;
    submitted_at: Date;
    grade: number;
    feed_back: string;
}
export declare class ExamSubmissionDTOPost {
    exam_id: number;
    student_class_id: number;
    file_content: string;
    grade: number;
    feed_back: string;
}
