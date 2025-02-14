export declare class SubmissionDTO {
    submission_id: number;
    assignment_id: number;
    student_id: number;
    file_content: string;
    submitted_at: Date;
    grade: number;
    feed_back: string;
}
export declare class SubmissionDTOPost {
    assignment_id: number;
    student_id: number;
    file_content: string;
}
