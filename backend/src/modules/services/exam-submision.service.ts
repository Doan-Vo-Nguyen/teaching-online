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
    return this.examSubmissionRepository.find(options);
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
    return this.examSubmissionRepository.getExamSubmissionByExamId(
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
    exam_content_id: number,
    data: {
      file_content: string;
      grade?: number;
      feed_back?: string;
      language_id?: number;
      detailed_testcase_results?: string | {
        testcase_id: number;
        score: number;
        status: string;
        output?: string;
        error?: string;
        exam_submission_content_id?: number;
        passed?: boolean;
      } | Array<{
        testcase_id: number;
        score: number;
        status: string;
        output?: string;
        error?: string;
        exam_submission_content_id?: number;
        passed?: boolean;
      }>;
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
      let submissionContent: ExamSubmissionContent;
      
      if (existedExamSubmission) {
        // Update timestamp in exam submission
        existedExamSubmission.updated_at = new Date();
        
        newExamSubmission =
          await this.examSubmissionRepository.updateExamSubmission(
            existedExamSubmission.exam_submission_id,
            existedExamSubmission
          );

        // Create new content entry
        submissionContent = await this.examSubmissionContentRepository.createExamSubmissionContentByExamSubmissionId(
          existedExamSubmission.exam_submission_id,
          {
            file_content: data.file_content,
            exam_submission_id: existedExamSubmission.exam_submission_id,
            id: 0,
            created_at: new Date(),
          }
        );
        
        // Always process testcase results (even if no results provided, it will create default entries)
        await this.processAndSaveTestcaseResults(
          exam_content_id, 
          submissionContent.id, 
          data.detailed_testcase_results
        );
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
        submissionContent = await this.createExamSubmissionContent(
          newExamSubmission.exam_submission_id,
          data.file_content
        );
        
        // Always process testcase results (even if no results provided, it will create default entries)
        await this.processAndSaveTestcaseResults(
          exam_content_id, 
          submissionContent.id, 
          data.detailed_testcase_results
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
        
        // Add the results to run_code_result without decoding
        run_code_result += `User Input Result:\n${submissionResultForInput.status.description}\n`;
        if (submissionResultForInput.stdout) {
          run_code_result += `Program Output (Base64):\n${submissionResultForInput.stdout}\n`;
        }
        
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
        
        // Add error information
        if (submissionResultForInput.compile_output) {
          run_code_result += `Compilation Output (Base64):\n${submissionResultForInput.compile_output}\n`;
        }
        
        if (submissionResultForInput.stderr) {
          run_code_result += `Standard Error (Base64):\n${submissionResultForInput.stderr}\n`;
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

        // If testcase passed (status.id === 3 means Accepted)
        if (submissionResult.status.id === 3) {
          totalGrade += testcase.score;
          run_code_result += `Testcase ${testcase.id}: Passed (+${testcase.score} points)\n`;
          if (testcaseResult.output) {
            run_code_result += `Program Output (Base64):\n${testcaseResult.output}\n`;
          }
          Logger.info(`Testcase ${testcase.id} passed. Score: ${testcase.score}`);
        } else {
          run_code_result += `Testcase ${testcase.id}: Failed (${submissionResult.status.description})\n`;
          
          // Include Base64 outputs
          if (submissionResult.compile_output) {
            run_code_result += `Compilation Output (Base64):\n${submissionResult.compile_output}\n`;
          }
          
          if (submissionResult.stderr) {
            run_code_result += `Standard Error (Base64):\n${submissionResult.stderr}\n`;
          }
          
          // Add program output if it exists
          if (testcaseResult.output) {
            run_code_result += `Program Output (Base64):\n${testcaseResult.output}\n`;
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
    return this.examSubmissionRepository.save({
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
    return this.examSubmissionContentRepository.save({
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
    exam_content_id?: number;
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

    const examSubmissionContent = await this.examSubmissionContentRepository.findById(data.exam_content_id);
    if (!examSubmissionContent) {
      throw new ApiError(404, "Exam submission content not found", "Exam submission content not found");
    }

    return this.examSubmissionRepository.getDetailsExamSubmission(exam_submission_id, data);
  }

  /**
   * Save a testcase result
   */
  private async saveTestcaseResult(
    exam_content_id: number,
    detailed_testcase_results: {
      testcase_id: number;
      score: number;
      status: string;
      output?: string;
      error?: string;
      exam_submission_content_id?: number;
      passed?: boolean;
    }
  ): Promise<ExamSubmissionContentDetails> {
    try {
      // First ensure detailed_testcase_results is an object and not a string
      let resultObj = detailed_testcase_results;
      
      // If it's a string, try to parse it
      if (typeof detailed_testcase_results === 'string') {
        try {
          resultObj = JSON.parse(detailed_testcase_results);
          Logger.info(`Parsed detailed_testcase_results string into object: ${JSON.stringify(resultObj)}`);
        } catch (parseError) {
          Logger.error(`Error parsing detailed_testcase_results string: ${(parseError as Error).message}`);
          throw new Error(`Invalid detailed_testcase_results format: ${(parseError as Error).message}`);
        }
      }
      
      // If the parsed result is an array, take the first item
      if (Array.isArray(resultObj)) {
        if (resultObj.length === 0) {
          throw new Error('Empty detailed_testcase_results array provided');
        }
        Logger.info(`detailed_testcase_results is an array, using first element: ${JSON.stringify(resultObj[0])}`);
        resultObj = resultObj[0];
      }
      
      // Check if we have a valid testcase_id
      if (!resultObj.testcase_id) {
        Logger.error(`Missing testcase_id in detailed_testcase_results: ${JSON.stringify(resultObj)}`);
        throw new Error('Missing testcase_id in detailed_testcase_results');
      }
      
      Logger.info(`Saving testcase result for exam_content_id: ${exam_content_id}, testcase_id: ${resultObj.testcase_id}`);
      
      // Create new entity
      const testcaseResult = new ExamSubmissionContentDetails();
      
      // Set both fields - exam_content_id is required, exam_submission_content_id might come from detailed results
      testcaseResult.exam_content_id = exam_content_id;
      
      // Set exam_submission_content_id from detailed results if provided
      if (resultObj.exam_submission_content_id) {
        testcaseResult.exam_submission_content_id = resultObj.exam_submission_content_id;
      } else {
        // If exam_submission_content_id is not provided, try to get the most recent submission
        try {
          const latestSubmission = await this.examSubmissionContentRepository.findLatestByExamContentId(exam_content_id);
          if (latestSubmission) {
            testcaseResult.exam_submission_content_id = latestSubmission.id;
            Logger.info(`Using latest submission content ID: ${latestSubmission.id}`);
          } else {
            Logger.error(`No exam submission content found for exam_content_id: ${exam_content_id}`);
            throw new Error(`No exam submission content found for exam_content_id: ${exam_content_id}`);
          }
        } catch (error) {
          Logger.error(`Error finding latest submission: ${(error as Error).message}`);
          throw error;
        }
      }
      
      testcaseResult.testcase_id = resultObj.testcase_id;
      
      // Default score to 0 unless explicitly passed and has a valid status
      const isPassed = resultObj.passed === true || resultObj.status === 'Accepted' || resultObj.status === 'passed';
      
      // If testcase passed, use provided score, otherwise 0
      if (isPassed && typeof resultObj.score === 'number' && !isNaN(resultObj.score)) {
        testcaseResult.score = resultObj.score;
      } else {
        testcaseResult.score = 0;
        Logger.info(`Testcase ${resultObj.testcase_id} failed or not run. Setting score to 0.`);
      }
      
      // Set status with appropriate default value
      if (!resultObj.status || resultObj.status.trim() === '') {
        testcaseResult.status = isPassed ? 'Accepted' : 'Failed';
      } else {
        testcaseResult.status = resultObj.status;
      }
      
      testcaseResult.output = resultObj.output || '';
      testcaseResult.error = resultObj.error || '';
      
      // Save to database using our repository
      return this.examSubmissionContentDetailsRepository.save(testcaseResult);
    } catch (error) {
      Logger.error(`Error saving testcase result: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Process and save testcase results with proper submission content ID
   */
  private async processAndSaveTestcaseResults(
    exam_content_id: number,
    exam_submission_content_id: number,
    detailed_testcase_results: any
  ): Promise<void> {
    Logger.info(`Saving detailed testcase result for exam content ${exam_content_id} and submission content ${exam_submission_content_id}`);
    
    // Check if detailed_testcase_results is undefined or null
    if (!detailed_testcase_results) {
      // No test results provided - fetch testcases for this exam content and save with default values
      Logger.info(`No testcase results provided. Fetching testcases for exam_content_id: ${exam_content_id}`);
      
      try {
        const testcases = await this.testcaseRepository.find({
          where: { exam_content_id }
        });
        
        if (testcases && testcases.length > 0) {
          Logger.info(`Found ${testcases.length} testcases to save with default values`);
          
          // Save each testcase with default values (score=0, status="Not Run")
          for (const testcase of testcases) {
            const defaultResult = {
              testcase_id: testcase.id,
              score: 0,
              status: "Not Run",
              output: "",
              error: "",
              exam_submission_content_id
            };
            
            await this.saveTestcaseResult(exam_content_id, defaultResult);
          }
        } else {
          Logger.info(`No testcases found for exam_content_id: ${exam_content_id}`);
        }
        
        return;
      } catch (error) {
        Logger.error(`Error fetching testcases: ${(error as Error).message}`);
        throw error;
      }
    }
    
    Logger.info(`Detailed testcase result: ${JSON.stringify(detailed_testcase_results)}`);
    
    // Handle both single result and array of results
    if (Array.isArray(detailed_testcase_results) || 
        (typeof detailed_testcase_results === 'string' && 
         detailed_testcase_results.trim().startsWith('['))) {
      // It's an array or array-like string
      let results = detailed_testcase_results;
      if (typeof results === 'string') {
        try {
          results = JSON.parse(results);
          Logger.info(`Parsed string array into object: ${JSON.stringify(results)}`);
        } catch (error) {
          Logger.error(`Error parsing testcase results string: ${(error as Error).message}`);
        }
      }
      
      // Process each result in the array
      if (Array.isArray(results)) {
        for (const result of results) {
          // Add the submission content ID to each result
          const resultWithSubmissionId = {
            ...result,
            exam_submission_content_id
          };
          await this.saveTestcaseResult(exam_content_id, resultWithSubmissionId);
        }
      }
    } else {
      // It's a single result
      // Parse if it's a string
      let resultObj = detailed_testcase_results;
      if (typeof detailed_testcase_results === 'string') {
        try {
          resultObj = JSON.parse(detailed_testcase_results);
        } catch (error) {
          Logger.error(`Error parsing single test result: ${(error as Error).message}`);
        }
      }
      
      // Add the submission content ID
      const resultWithSubmissionId = {
        ...resultObj,
        exam_submission_content_id
      };
      
      await this.saveTestcaseResult(exam_content_id, resultWithSubmissionId);
    }
  }

}

export default ExamSubmissionService;
