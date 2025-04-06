import { Logger } from "../config/logger";
import {
  CODE_EXECUTION_FAILED,
  EXAM_SUBMISSION_ERROR,
  EXAM_SUBMISSION_FIELD_REQUIRED,
} from "../DTO/resDto/BaseErrorDto";
import { ExamSubmission } from "../entity/Exam_submission.entity";
import { ExamSubmissionContent } from "../entity/Exam_Submission_Content.entity";
import { IClassesRepository } from "../interfaces/classes.interface";
import { IExamSubmissionContentRepository } from "../interfaces/exam-submission-content.interface";
import { IExamSubmissionRepository } from "../interfaces/exam-submission.interface";
import { ILanguageCodeRepository } from "../interfaces/language-code.interface";
import { IStudentClassesRepository } from "../interfaces/student-classes.interface";
import { ClassesRepository } from "../repositories/classes.repository";
import { ExamSubmissionRepository } from "../repositories/exam-submission.repository";
import { ExamSubmissionContentRepository } from "../repositories/exam-submission-content.repository";
import { LanguageCodeRepository } from "../repositories/language-code.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { ApiError } from "../types/ApiError";
import { ITestCaseRepository } from "../interfaces/testcase.interface";
import { TestCaseRepository } from "../repositories/testcase.repository";
import { ExamContentRepository } from "../repositories/exam-content.repository";
import { IExamContentRepository } from "../interfaces/exam-content.interface";
import { ChildProcess, spawn } from "child_process";
class ExamSubmissionService {
  private readonly examSubmissionRepository: IExamSubmissionRepository =
    new ExamSubmissionRepository();
  private readonly studentClassRepository: IStudentClassesRepository =
    new StudentClassesRepository();
  private readonly classRepository: IClassesRepository =
    new ClassesRepository();
  private readonly examSubmissionContentRepository: IExamSubmissionContentRepository =
    new ExamSubmissionContentRepository();
  private readonly languageRepository: ILanguageCodeRepository =
    new LanguageCodeRepository();
  private readonly testcaseRepository: ITestCaseRepository =
    new TestCaseRepository();
  private readonly examContentRepository: IExamContentRepository =
    new ExamContentRepository();

  public async get(options: any): Promise<ExamSubmission[]> {
    return await this.examSubmissionRepository.find(options);
  }

  public async getExamSubmissionByExamId(
    exam_id: number
  ): Promise<ExamSubmission[]> {
    if (!exam_id) {
      throw new ApiError(
        400,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.details
      );
    }
    const exam = await this.examSubmissionRepository.findByExamId(exam_id);
    if (!exam) {
      throw new ApiError(404, "Exam not found", "Exam not found");
    }
    return await this.examSubmissionRepository.getExamSubmissionByExamId(
      exam_id
    );
  }

  public async getExamSubmissionByOneStudent(
    student_id: number,
    class_id: number,
    exam_id: number
  ): Promise<ExamSubmission> {
    if (!exam_id || !student_id) {
      throw new ApiError(
        400,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.details
      );
    }

    const existedStudentClass =
      await this.studentClassRepository.findByStudentId(student_id);
    if (!existedStudentClass) {
      throw new ApiError(
        404,
        "Student class not found",
        "Student class not found"
      );
    }

    const existedClass = await this.classRepository.findById(class_id);
    if (!existedClass) {
      throw new ApiError(404, "Class not found", "Class not found");
    }

    const studentClass =
      await this.studentClassRepository.findByUserIdAndClassId(
        student_id,
        class_id
      );
    if (!studentClass) {
      throw new ApiError(
        404,
        "Student is not enrolled in this class",
        "Student class record not found"
      );
    }

    const examSubmission =
      await this.examSubmissionRepository.findByExamIdAndStudentClassId(
        exam_id,
        studentClass.student_class_id
      );
    if (!examSubmission) {
      throw new ApiError(
        404,
        "Exam submission not found",
        "Exam submission record not found"
      );
    }

    const examSubmissionContents =
      await this.examSubmissionContentRepository.findByExamSubmissionId(
        examSubmission.exam_submission_id
      );
    return {
      ...examSubmission,
      examSubmissionContents,
    };
  }

  public async getExamSubmissionHaveSubmit(
    class_id: number,
    exam_id: number
  ): Promise<ExamSubmission[]> {
    try {
      if (!class_id || !exam_id) {
        throw new ApiError(
          400,
          EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
          EXAM_SUBMISSION_FIELD_REQUIRED.error.details
        );
      }
      const classInfo =
        await this.studentClassRepository.findByClassId(class_id);
      if (!classInfo) {
        throw new ApiError(404, "Class not found", "Class not found");
      }
      // get all students in class
      const listUser =
        await this.studentClassRepository.getAllStudentByClass(class_id);
      const listExamSubmission = [];
      // get all exam submission of students in class
      for (const user of listUser) {
        const examSubmission =
          await this.examSubmissionRepository.getExamSubmissionByOneStudent(
            user.student_id,
            class_id,
            exam_id
          );
        if (examSubmission) {
          listExamSubmission.push({
            ...examSubmission,
            student_id: user.student_id,
          });
        }
      }
      return listExamSubmission;
    } catch (error) {
      Logger.error(error);
      throw new ApiError(
        500,
        EXAM_SUBMISSION_ERROR.error.message,
        EXAM_SUBMISSION_ERROR.error.details
      );
    }
  }

  public async createExamSubmission(
    exam_id: number,
    student_id: number,
    class_id: number,
    data: { file_content: string; grade?: number; feed_back?: string }
  ): Promise<ExamSubmission> {
    if (!data) {
      throw new ApiError(
        400,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.details
      );
    }
    const studentClass = await this.getStudentClass(student_id, class_id);
    const existedUser = studentClass?.student_id;
    const existedClass = studentClass?.class_id;
    if (!studentClass) {
      throw new ApiError(
        404,
        "Student class not found",
        "Student class not found"
      );
    }
    if (!existedUser) {
      throw new ApiError(404, "User not found", "User not found");
    }
    if (!existedClass) {
      throw new ApiError(404, "Class not found", "Class not found");
    }
    const existedUserAndClass =
      await this.studentClassRepository.findByUserIdAndClassId(
        existedUser,
        existedClass
      );
    if (!existedUserAndClass) {
      throw new ApiError(404, "User not in class", "User not in class");
    }
    // check if the student has already submitted the exam
    const existedExamSubmission =
      await this.examSubmissionRepository.findByExamIdAndStudentClassId(
        exam_id,
        studentClass.student_class_id
      );
    // if not will create a new exam submission record, else just create a new content of submission
    let newExamSubmission: ExamSubmission;
    if (existedExamSubmission) {
      await this.examSubmissionContentRepository.createExamSubmissionContentByExamSubmissionId(
        existedExamSubmission.exam_submission_id,
        {
          file_content: data.file_content,
          exam_submission_id: existedExamSubmission.exam_submission_id,
          id: 0,
          created_at: new Date(),
        }
      );
      newExamSubmission = existedExamSubmission;
    } else {
      newExamSubmission = await this.createExamSubmissionRecord(
        exam_id,
        studentClass.student_class_id,
        {
          grade: data.grade,
          feed_back: data.feed_back,
        }
      );
    }
    return newExamSubmission;
  }
  catch(error) {
    Logger.error(error);
    throw new ApiError(
      500,
      CODE_EXECUTION_FAILED.error.message,
      CODE_EXECUTION_FAILED.error.details
    );
  }

  public async createExamSubmissionByStudentAndClass(
    exam_id: number,
    student_id: number,
    class_id: number,
    data: {
      file_content: string;
      grade?: number;
      feed_back?: string;
    }
  ): Promise<ExamSubmission> {
    this.validateExamSubmissionData(data);

    // get the grade and run_code_result from the judge0

    try {
      const studentClass = await this.getStudentClass(student_id, class_id);
      // check if the student has already submitted the exam
      const existedExamSubmission =
        await this.examSubmissionRepository.findByExamIdAndStudentClassId(
          exam_id,
          studentClass.student_class_id
        );

      // if not will create a new exam submission record, else just create a new content of submission
      let newExamSubmission: ExamSubmission;
      if (existedExamSubmission) {
        // Update timestamp in exam submission
        existedExamSubmission.updated_at = new Date();

        newExamSubmission =
          await this.examSubmissionRepository.updateExamSubmission(
            existedExamSubmission.exam_submission_id,
            existedExamSubmission
          );

        // Create new content entry
        await this.examSubmissionContentRepository.createExamSubmissionContentByExamSubmissionId(
          existedExamSubmission.exam_submission_id,
          {
            file_content: data.file_content,
            exam_submission_id: existedExamSubmission.exam_submission_id,
            id: 0,
            created_at: new Date(),
          }
        );
      } else {
        // Create new exam submission without file_content
        newExamSubmission = await this.createExamSubmissionRecord(
          exam_id,
          studentClass.student_class_id,
          {}
        );

        // Then create exam submission content with file_content
        await this.createExamSubmissionContent(
          newExamSubmission.exam_submission_id,
          data.file_content
        );
      }
      return newExamSubmission;
    } catch (error) {
      Logger.error(error);
      throw new ApiError(
        500,
        EXAM_SUBMISSION_ERROR.error.message,
        EXAM_SUBMISSION_ERROR.error.details
      );
    }
  }

  public async runCode(
    exam_content_id: number,
    data: {
      file_content: string;
      language_id: number;
      input?: string;
    }
  ): Promise<{ grade?: number; run_code_result?: string }> {
    this.validateExamSubmissionData(data);

    // case student input the data and judge0 will run the code with the input and return the result
    if (data.input) {
      // run dependent judge0 for input
      const judge0ResponseForInput = await this.submitToJudge0({
        source_code: data.file_content,
        language_id: data.language_id,
        stdin: data.input,
      });

      const submissionResultForInput = await this.getJudge0Result(
        judge0ResponseForInput.token
      );

      return { run_code_result: submissionResultForInput.stdout };
    }
    
    try {
      const testcases = await this.testcaseRepository.find({
        where: {
          exam_content_id: exam_content_id
        }
      });

      let totalGrade = 0;
      let run_code_result = "";
        

      // Run each testcase
      for (const testcase of testcases) {
        const judge0Response = await this.submitToJudge0({
          source_code: data.file_content,
          language_id: data.language_id,
          stdin: testcase.input,
          expected_output: testcase.expected_output,
        });

        const submissionResult = await this.getJudge0Result(
          judge0Response.token
        );

        // If testcase passed (status.id === 3 means Accepted)
        if (submissionResult.status.id === 3) {
          totalGrade += testcase.score;
          run_code_result += `Testcase ${testcase.id}: Passed (+${testcase.score} points)\n`;
        } else {
          run_code_result += `Testcase ${testcase.id}: Failed (${submissionResult.status.description})\n`;
          if (submissionResult.compile_output) {
            run_code_result += submissionResult.compile_output;
          }
        }
      }

      return { grade: totalGrade, run_code_result };
    } catch (error) {
      Logger.error(error);
      throw new ApiError(
        500,
        CODE_EXECUTION_FAILED.error.message,
        CODE_EXECUTION_FAILED.error.details
      );
    }
  }

  public async updateExamSubmissionWithGrade(
    exam_submission_id: number,
    grade: number,
    feedback: string
  ): Promise<ExamSubmission> {
    const existedExamSubmission =
      await this.examSubmissionRepository.findById(exam_submission_id);
    if (!existedExamSubmission) {
      throw new ApiError(
        404,
        "Exam submission not found",
        "Exam submission not found"
      );
    }
    
    existedExamSubmission.grade = grade;
    existedExamSubmission.feed_back = feedback;
    existedExamSubmission.updated_at = new Date();
    
    return this.examSubmissionRepository.updateExamSubmission(
      exam_submission_id,
      existedExamSubmission
    );
  }

  private async validateExamSubmissionData(data: {
    file_content: string;
    language_id?: number;
    stdin?: string;
    expected_output?: string;
  }): Promise<void> {
    if (!data.file_content) {
      throw new ApiError(
        400,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.details
      );
    }
    if (data.language_id) {
      const language = await this.languageRepository.findById(data.language_id);
      if (!language) {
        throw new ApiError(404, "Language not found", "Language not found");
      }
    }

    // // using child_process to run the code for validate the code
    // const child = spawn(language.name, [data.file_content]);
    // child.stdout.on("data", (data) => {
    //   console.log(data.toString());
    // });
  }

  private async getStudentClass(student_id: number, class_id: number) {
    const studentClass =
      await this.studentClassRepository.findByUserIdAndClassId(
        student_id,
        class_id
      );
    if (!studentClass) {
      throw new ApiError(
        404,
        "Student class not found",
        "Student class not found"
      );
    }
    return studentClass;
  }

  private async createExamSubmissionRecord(
    exam_id: number,
    student_class_id: number,
    data: { grade?: number; feed_back?: string; run_code_result?: string }
  ): Promise<ExamSubmission> {
    return await this.examSubmissionRepository.save({
      ...data,
      exam_id,
      student_class_id,
      submitted_at: new Date(),
      updated_at: new Date(),
      exam_submission_id: 0,
      ...(data.grade !== undefined && { grade: data.grade }),
      ...(data.feed_back !== undefined && { feed_back: data.feed_back }),
      ...(data.run_code_result !== undefined && { run_code_result: data.run_code_result }),
    });
  }

  private async createExamSubmissionContent(
    exam_submission_id: number,
    file_content: string
  ): Promise<void> {
    await this.examSubmissionContentRepository.save({
      exam_submission_id,
      file_content,
      id: 0,
      created_at: new Date(),
    });
  }

  public async updateExamSubmission(
    exam_submission_id: number,
    examSubmission: ExamSubmission
  ): Promise<ExamSubmission> {
    if (!examSubmission) {
      throw new ApiError(
        400,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.message,
        EXAM_SUBMISSION_FIELD_REQUIRED.error.details
      );
    }
    const existedExamSubmission =
      await this.examSubmissionRepository.findById(exam_submission_id);
    if (!existedExamSubmission) {
      throw new ApiError(
        404,
        "Exam submission not found",
        "Exam submission not found"
      );
    }
    // just update the updated_at field
    examSubmission.updated_at = new Date();
    return this.examSubmissionRepository.updateExamSubmission(
      exam_submission_id,
      examSubmission
    );
  }

  public async deleteExamSubmission(
    exam_submission_id: number
  ): Promise<ExamSubmission> {
    const existedExamSubmission =
      await this.examSubmissionRepository.findById(exam_submission_id);
    if (!existedExamSubmission) {
      throw new ApiError(
        404,
        "Exam submission not found",
        "Exam submission not found"
      );
    }
    return this.examSubmissionRepository.delete(exam_submission_id);
  }

  public async deleteExamSubmissionContent(
    exam_submission_id: number,
    id: number
  ): Promise<ExamSubmissionContent> {
    const existedExamSubmission =
      await this.examSubmissionRepository.findById(exam_submission_id);
    if (!existedExamSubmission) {
      throw new ApiError(
        404,
        "Exam submission not found",
        "Exam submission not found"
      );
    }
    const examSubmissionContent =
      await this.examSubmissionContentRepository.findByExamSubmissionId(
        exam_submission_id
      );
    if (!examSubmissionContent) {
      throw new ApiError(
        404,
        "Exam submission content not found",
        "Exam submission content not found"
      );
    }
    const deletedContent =
      await this.examSubmissionContentRepository.deleteExamSubmissionContent(
        exam_submission_id,
        id
      );
    return deletedContent;
  }

  private async submitToJudge0(submission: {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
  }) {
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*&wait=false",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify(submission),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit code to Judge0");
    }

    return await response.json();
  }

  private async getJudge0Result(token: string) {
    const response = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get submission result from Judge0");
    }

    return await response.json();
  }
}

export default ExamSubmissionService;
