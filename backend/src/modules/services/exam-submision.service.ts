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
import axios, { AxiosError } from "axios";
import { ExamSubmissionContentDetails } from "../entity/ExamSubmissionContentDetails.entity";
import { IExamSubmissionContentDetailsRepository } from "../interfaces/exam-submisison-content-details.interface";
import { ExamSubmissionContentDetailsRepository } from "../repositories/exam-submission-content-details.repository";

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
  private readonly examSubmissionContentDetailsRepository: IExamSubmissionContentDetailsRepository =
    new ExamSubmissionContentDetailsRepository();

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
    exam_submission_content_id: number,
    data: {
      file_content: string;
      grade?: number;
      feed_back?: string;
      language_id?: number;
      detailed_testcase_results?: {
        testcase_id: number;
        score: number;
        status: string;
        output?: string;
        error?: string;
      };
    }
  ): Promise<ExamSubmission> {
    this.validateExamSubmissionData(data);

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
        const submissionContent = await this.examSubmissionContentRepository.createExamSubmissionContentByExamSubmissionId(
          existedExamSubmission.exam_submission_id,
          {
            file_content: data.file_content,
            exam_submission_id: existedExamSubmission.exam_submission_id,
            id: 0,
            created_at: new Date(),
          }
        );
        
        // Save testcase results
        if (data.detailed_testcase_results) {
          // If detailed results are provided, use them
          Logger.info(`Saving detailed testcase result for exam submission content ${exam_submission_content_id}`);
          Logger.info(`Detailed testcase result: ${JSON.stringify(data.detailed_testcase_results)}`);
          await this.saveTestcaseResult(
            exam_submission_content_id,
            data.detailed_testcase_results
          );
        }
      } else {
        // Create new exam submission
        newExamSubmission = await this.createExamSubmissionRecord(
          exam_id,
          studentClass.student_class_id,
          {
            grade: data.grade,
            feed_back: data.feed_back,
          }
        );

        // Then create exam submission content with file_content
        const submissionContent = await this.createExamSubmissionContent(
          newExamSubmission.exam_submission_id,
          data.file_content
        );
        
        // Save testcase results
        if (data.detailed_testcase_results) {
          // If detailed results are provided, use them
          Logger.info(`Saving detailed testcase result for exam submission content ${exam_submission_content_id}`);
          Logger.info(`Detailed testcase result: ${JSON.stringify(data.detailed_testcase_results)}`);
          await this.saveTestcaseResult(
            exam_submission_content_id,
            data.detailed_testcase_results
          );
        }
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
  ): Promise<{ 
    grade?: number; 
    run_code_result?: string;
    testcase_results?: Array<{
      id: number;
      passed: boolean;
      score: number;
      status: {
        id: number;
        description: string;
      };
      output?: string;
      error?: string;
      expected_output?: string;
    }>;
    user_input_result?: {
      status: {
        id: number;
        description: string;
      };
      output?: string;
      error?: string;
      input?: string;
    };
  }> {
    Logger.info(`Starting runCode for exam_content_id: ${exam_content_id}, language_id: ${data.language_id}`);
    this.validateExamSubmissionData(data);

    let run_code_result = "";
    let totalGrade = 0;
    let user_input_result: {
      status: {
        id: number;
        description: string;
      };
      output?: string;
      error?: string;
      input?: string;
    } | undefined;
    const testcase_results: Array<{
      id: number;
      passed: boolean;
      score: number;
      status: {
        id: number;
        description: string;
      };
      output?: string;
      error?: string;
      expected_output?: string;
    }> = [];

    // Handle user input if provided
    if (data.input && data.input !== "") {
      Logger.info(`Running code with user-provided input: ${data.input.substring(0, 50)}...`);
      try {
        const judge0ResponseForInput = await this.submitToJudge0({
          source_code: data.file_content,
          language_id: data.language_id,
          stdin: data.input,
        });
        
        Logger.info(`Judge0 submission successful. Token: ${judge0ResponseForInput.token}`);

        const submissionResultForInput = await this.getJudge0Result(
          judge0ResponseForInput.token
        );
        
        Logger.info(`Judge0 result received. Status: ${JSON.stringify(submissionResultForInput.status)}`);
        
        // Decode base64 stdout if it exists
        let stdout = '';
        if (submissionResultForInput.stdout) {
          try {
            stdout = Buffer.from(submissionResultForInput.stdout, 'base64').toString();
            Logger.info(`User input stdout received: ${stdout.substring(0, 100)}${stdout.length > 100 ? '...' : ''}`);
          } catch (error) {
            Logger.error(`Error decoding stdout for user input: ${(error as Error).message}`);
            stdout = 'Error decoding output';
          }
        } else {
          Logger.info('No stdout available for user input');
        }
        
        run_code_result += `User Input Result:\n${submissionResultForInput.stdout}\n\n`;
        
        // Create user input result object
        user_input_result = {
          status: {
            id: submissionResultForInput.status.id,
            description: submissionResultForInput.status.description,
          },
          output: submissionResultForInput.stdout,
          input: data.input,
          error: submissionResultForInput.stderr
        };
        
        // Add any error information
        let errorInfo = '';
        if (submissionResultForInput.compile_output) {
          try {
            const decodedOutput = Buffer.from(submissionResultForInput.compile_output, 'base64').toString();
            errorInfo += `Compilation Error:\n${decodedOutput}\n`;
          } catch (error) {
            Logger.error(`Error decoding compile_output for user input: ${(error as Error).message}`);
            errorInfo += `Compilation Error: Error decoding output\n`;
          }
        }
        
        if (submissionResultForInput.stderr) {
          try {
            const decodedStderr = Buffer.from(submissionResultForInput.stderr, 'base64').toString();
            errorInfo += `Standard Error:\n${decodedStderr}\n`;
          } catch (error) {
            Logger.error(`Error decoding stderr for user input: ${(error as Error).message}`);
            errorInfo += `Standard Error: Error decoding output\n`;
          }
        }
        
        if (errorInfo) {
          user_input_result.error = errorInfo;
        }
      } catch (error) {
        Logger.error(`Error running code with input: ${(error as Error).message}`);
        throw new ApiError(
          500,
          CODE_EXECUTION_FAILED.error.message,
          CODE_EXECUTION_FAILED.error.details
        );
      }
    }

    // Handle testcases
    try {
      Logger.info(`Fetching testcases for exam_content_id: ${exam_content_id}`);
      const testcases = await this.testcaseRepository.find({
        where: {
          exam_content_id: exam_content_id
        }
      });
      
      Logger.info(`Found ${testcases.length} testcases`);

      // Run each testcase
      for (const testcase of testcases) {
        Logger.info(`Running testcase ${testcase.id} with input: ${testcase.input.substring(0, 50)}...`);
        
        const judge0Response = await this.submitToJudge0({
          source_code: data.file_content,
          language_id: data.language_id,
          stdin: testcase.input,
          expected_output: testcase.expected_output,
        });

        Logger.info(`Judge0 submission for testcase ${testcase.id} successful. Token: ${judge0Response.token}`);

        const submissionResult = await this.getJudge0Result(
          judge0Response.token
        );

        Logger.info(`Judge0 result for testcase ${testcase.id} received. Status: ${JSON.stringify(submissionResult.status)}`);

        const testcaseResult = {
          id: testcase.id,
          passed: submissionResult.status.id === 3,
          score: testcase.score,
          status: {
            id: submissionResult.status.id,
            description: submissionResult.status.description,
          },
          input: testcase.input,
          expected_output: testcase.expected_output,
          output: submissionResult.stdout,
          error: submissionResult.stderr,
        };

        // Always decode stdout if it exists, for both passing and failing testcases
        if (submissionResult.stdout) {
          try {
            const decodedStdout = Buffer.from(submissionResult.stdout, 'base64').toString();
            testcaseResult.output = decodedStdout;
            Logger.info(`Testcase ${testcase.id} output: ${decodedStdout.substring(0, 100)}${decodedStdout.length > 100 ? '...' : ''}`);
          } catch (error) {
            Logger.error(`Error decoding stdout for testcase ${testcase.id}: ${(error as Error).message}`);
            testcaseResult.output = 'Error decoding output';
          }
        } else {
          Logger.info(`No stdout available for testcase ${testcase.id}`);
        }

        // If testcase passed (status.id === 3 means Accepted)
        if (submissionResult.status.id === 3) {
          totalGrade += testcase.score;
          run_code_result += `Testcase ${testcase.id}: Passed (+${testcase.score} points)\n`;
          if (testcaseResult.output) {
            run_code_result += `Program Output:\n${testcaseResult.output}\n`;
          }
          Logger.info(`Testcase ${testcase.id} passed. Score: ${testcase.score}`);
        } else {
          run_code_result += `Testcase ${testcase.id}: Failed (${submissionResult.status.description})\n`;
          
          let errorInfo = '';
          
          // Decode base64 outputs if they exist
          if (submissionResult.compile_output) {
            try {
              const decodedOutput = Buffer.from(submissionResult.compile_output, 'base64').toString();
              run_code_result += `Compilation Error:\n${decodedOutput}\n`;
              errorInfo += `Compilation Error:\n${decodedOutput}\n`;
            } catch (error) {
              Logger.error(`Error decoding compile_output for testcase ${testcase.id}: ${(error as Error).message}`);
              errorInfo += `Compilation Error: Error decoding output\n`;
            }
          }
          
          if (submissionResult.stderr) {
            try {
              const decodedStderr = Buffer.from(submissionResult.stderr, 'base64').toString();
              run_code_result += `Standard Error:\n${decodedStderr}\n`;
              errorInfo += `Standard Error:\n${decodedStderr}\n`;
            } catch (error) {
              Logger.error(`Error decoding stderr for testcase ${testcase.id}: ${(error as Error).message}`);
              errorInfo += `Standard Error: Error decoding output\n`;
            }
          }
          
          // Add program output to run_code_result if it exists
          if (testcaseResult.output) {
            run_code_result += `Program Output:\n${testcaseResult.output}\n`;
          }
          
          if (errorInfo) {
            testcaseResult.error = errorInfo;
          }
          
          Logger.info(`Testcase ${testcase.id} failed. Status: ${submissionResult.status.description}`);
        }
        
        testcase_results.push(testcaseResult);
      }

      Logger.info(`All testcases completed. Total grade: ${totalGrade}`);
      return { grade: totalGrade, run_code_result, testcase_results, user_input_result };
    } catch (error) {
      Logger.error(`Error in runCode: ${(error as Error).message}`);
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
  ): Promise<ExamSubmissionContent> {
    return await this.examSubmissionContentRepository.save({
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
    Logger.info(`Submitting code to Judge0. Language ID: ${submission.language_id}`);
    
    try {
      Logger.info(`Judge0 API Key present: ${!!process.env.JUDGE0_API_KEY}`);
      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: {
          base64_encoded: "true",
          fields: "*",
        },
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
      Logger.info(`Making request to: ${options.url}`);
      
      const response = await axios.post(options.url, submission, {
        headers: options.headers,
      });

      Logger.info(`Judge0 submission successful. Token: ${response.data.token}`);
      return response.data;
    } catch (error) {
      Logger.error(`Error in submitToJudge0: ${(error as Error).message}`);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          Logger.error(`Judge0 API error: ${axiosError.response.status} ${axiosError.response.statusText}`);
          Logger.error(`Response data: ${JSON.stringify(axiosError.response.data)}`);
        }
      }
      throw error;
    }
  }

  private async getJudge0Result(token: string) {
    Logger.info(`Getting Judge0 result for token: ${token}`);
    
    const maxAttempts = 10;
    const pollingInterval = 1000; // 1 second
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const options = {
          method: "GET",
          url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          params: {
            base64_encoded: "true",
            fields: "*",
          },
          headers: {
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
        Logger.info(`Polling attempt ${attempt}/${maxAttempts} - Making request to: ${options.url}`);
        
        const response = await axios.get(options.url, {
          headers: options.headers,
        });

        Logger.info(`Judge0 result received. Status ID: ${response.data.status?.id}, Description: ${response.data.status?.description}`);
        
        // If status is not "Processing" (id=2), we can return the result
        if (response.data.status?.id !== 2) {
          return response.data;
        }
        
        // If we're still processing and haven't reached max attempts, wait before trying again
        if (attempt < maxAttempts) {
          Logger.info(`Code still processing. Waiting ${pollingInterval}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, pollingInterval));
        } else {
          Logger.info(`Maximum polling attempts (${maxAttempts}) reached. Last status was "Processing".`);
          return response.data; // Return the last result even if it's still processing
        }
      } catch (error) {
        Logger.error(`Error in getJudge0Result attempt ${attempt}: ${(error as Error).message}`);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            Logger.error(`Judge0 API error: ${axiosError.response.status} ${axiosError.response.statusText}`);
            Logger.error(`Response data: ${JSON.stringify(axiosError.response.data)}`);
          }
        }
        if (attempt === maxAttempts) {
          throw error;
        }
        // Wait before retrying after an error
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
      }
    }
    
    // This should not be reached due to the return in the loop, but TypeScript might expect a return
    throw new Error("Failed to get Judge0 result after maximum attempts");
  }

  /**
   * Get detailed exam submission information including testcase results
   */
  public async getDetailsExamSubmission(exam_submission_id: number, data: {
    exam_submission_content_id?: number;
    exam_submission_content_details_id?: number;
  }): Promise<ExamSubmission> {
    const existedExamSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
    if (!existedExamSubmission) {
      throw new ApiError(404, "Exam submission not found", "Exam submission not found");
    }

    const examSubmissionContents = await this.examSubmissionContentRepository.findByExamSubmissionId(exam_submission_id);
    if (!examSubmissionContents) {
      throw new ApiError(404, "Exam submission content not found", "Exam submission content not found");
    }

    const examSubmissionContent = await this.examSubmissionContentRepository.findById(data.exam_submission_content_id);
    if (!examSubmissionContent) {
      throw new ApiError(404, "Exam submission content not found", "Exam submission content not found");
    }

    return await this.examSubmissionRepository.getDetailsExamSubmission(exam_submission_id, data);
  }

  /**
   * Save a testcase result
   */
  private async saveTestcaseResult(
    exam_submission_content_id: number,
    detailed_testcase_results: {
      testcase_id: number;
      score: number;
      status: string;
      output?: string;
      error?: string;
    }
  ): Promise<ExamSubmissionContentDetails> {
    try {
      Logger.info(`Saving testcase result for exam_submission_content_id: ${exam_submission_content_id}, testcase_id: ${detailed_testcase_results.testcase_id}`);
      
      // Create new entity
      const testcaseResult = new ExamSubmissionContentDetails();
      testcaseResult.exam_submission_content_id = exam_submission_content_id;
      testcaseResult.testcase_id = detailed_testcase_results.testcase_id;
      testcaseResult.score = detailed_testcase_results.score;
      testcaseResult.status = detailed_testcase_results.status;
      testcaseResult.output = detailed_testcase_results.output;
      testcaseResult.error = detailed_testcase_results.error;
      
      // Save to database using our repository
      return await this.examSubmissionContentDetailsRepository.save(testcaseResult);
    } catch (error) {
      Logger.error(`Error saving testcase result: ${(error as Error).message}`);
      throw error;
    }
  }

}

export default ExamSubmissionService;
