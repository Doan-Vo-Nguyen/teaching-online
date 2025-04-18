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
import { ExamTypeForStudent } from "../constant/index";
import { IExamRepository } from "../interfaces/exam.interface";
import { ExamRepository } from "../repositories/exam.repository";

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
  private readonly examContentRepository: IExamContentRepository =
    new ExamContentRepository();
  private readonly examRepository: IExamRepository =
    new ExamRepository();

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
    try {
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
    } catch (error) {
      Logger.error(error);
      throw new ApiError(
        500,
        CODE_EXECUTION_FAILED.error.message,
        CODE_EXECUTION_FAILED.error.details
      );
    }
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
      Logger.info(`Creating exam submission for student ${student_id} in class ${class_id} for exam ${exam_id}`);
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
        Logger.info(`Existing submission found (ID: ${existedExamSubmission.exam_submission_id}). Updating...`);
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
        
        Logger.info(`New submission content created (ID: ${submissionContent.id})`);
        
        // Process and save testcase results from frontend
        await this.processAndSaveTestcaseResults(
          exam_content_id, 
          submissionContent.id, 
          data.detailed_testcase_results
        );

        // Extract testcase results and use them to calculate grade
        const testcaseResults = this.extractTestcaseResults(data.detailed_testcase_results);
        Logger.info(`Extracted ${testcaseResults.length} testcase results from frontend data`);
        
        // Calculate and update grade for IT students
        await this.calculateAndUpdateGrade(exam_id, newExamSubmission.exam_submission_id, testcaseResults);
      } else {
        Logger.info(`No existing submission found. Creating new submission...`);
        // Create new exam submission
        newExamSubmission = await this.createExamSubmissionRecord(
          exam_id,
          studentClass.student_class_id,
          {
            grade: data.grade,
            feed_back: data.feed_back,
          }
        );
        
        Logger.info(`New submission created (ID: ${newExamSubmission.exam_submission_id})`);

        // Then create exam submission content with file_content
        submissionContent = await this.createExamSubmissionContent(
          newExamSubmission.exam_submission_id,
          data.file_content
        );
        
        Logger.info(`New submission content created (ID: ${submissionContent.id})`);
        
        // Process and save testcase results from frontend
        await this.processAndSaveTestcaseResults(
          exam_content_id, 
          submissionContent.id, 
          data.detailed_testcase_results
        );

        // Extract testcase results and use them to calculate grade
        const testcaseResults = this.extractTestcaseResults(data.detailed_testcase_results);
        Logger.info(`Extracted ${testcaseResults.length} testcase results from frontend data`);
        
        // Calculate and update grade for IT students
        await this.calculateAndUpdateGrade(exam_id, newExamSubmission.exam_submission_id, testcaseResults);
      }
      
      // Get the most recent state of the submission with updated grade
      const updatedSubmission = await this.examSubmissionRepository.findById(
        newExamSubmission.exam_submission_id
      );
      
      Logger.info(`Returning final submission with grade: ${updatedSubmission.grade}`);
      return updatedSubmission || newExamSubmission;
    } catch (error) {
      Logger.error(`Error in createExamSubmissionByStudentAndClass: ${(error as Error).message}`);
      throw new ApiError(
        500,
        EXAM_SUBMISSION_ERROR.error.message,
        EXAM_SUBMISSION_ERROR.error.details
      );
    }
  }

  /**
   * Extract testcase results from the detailed_testcase_results parameter
   * This handles different formats that might come from the frontend
   */
  private extractTestcaseResults(detailed_testcase_results: any): Array<{
    id: number;
    passed: boolean;
    score: number;
  }> {
    if (!detailed_testcase_results) {
      return [];
    }

    try {
      // Parse if it's a string
      let results = detailed_testcase_results;
      if (typeof detailed_testcase_results === 'string') {
        try {
          results = JSON.parse(detailed_testcase_results);
          Logger.info('Parsed detailed_testcase_results from string to object');
        } catch (parseError) {
          Logger.error(`Error parsing detailed_testcase_results: ${(parseError as Error).message}`);
          return [];
        }
      }

      // Handle array of results
      if (Array.isArray(results)) {
        Logger.info(`Processing array of ${results.length} test results`);
        return results.map(result => ({
          id: result.testcase_id,
          passed: result.passed === true || result.status === 'Accepted' || result.status === 'passed',
          score: typeof result.score === 'number' ? result.score : 0
        }));
      }
      
      // Handle single result object
      Logger.info('Processing single test result object');
      return [{
        id: results.testcase_id,
        passed: results.passed === true || results.status === 'Accepted' || results.status === 'passed',
        score: typeof results.score === 'number' ? results.score : 0
      }];
    } catch (error) {
      Logger.error(`Error extracting testcase results: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Calculates and updates the grade for an exam submission based on passing testcases
   * This will only apply automatic grading to students with an IT type exam
   * The grade is the sum of all exam_content_id submissions for the same exam_id
   */
  public async calculateAndUpdateGrade(
    exam_id: number,
    exam_submission_id: number,
    testcase_results: Array<{
      id: number;
      passed: boolean;
      score: number;
    }>
  ): Promise<ExamSubmission> {
    try {
      Logger.info(`***** CALCULATE AND UPDATE GRADE STARTING *****`);
      Logger.info(`Exam ID: ${exam_id}, Submission ID: ${exam_submission_id}`);
      Logger.info(`Current testcase results count: ${testcase_results ? testcase_results.length : 0}`);
      
      // Get the exam to check its type
      const exam = await this.examRepository.findById(exam_id);
      if (!exam) {
        Logger.error(`Exam ${exam_id} not found`);
        throw new ApiError(404, "Exam not found", "Exam not found");
      }
      
      Logger.info(`Exam found. Type for student: ${exam.type_student}`);
      
      // Get the current exam submission
      const examSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
      if (!examSubmission) {
        Logger.error(`Exam submission ${exam_submission_id} not found`);
        throw new ApiError(404, "Exam submission not found", "Exam submission not found");
      }

      Logger.info(`Exam submission found. Current grade: ${examSubmission.grade || 0}`);

      // Only apply automatic grading for IT students
      if (exam.type_student === ExamTypeForStudent.IT) {
        Logger.info(`Applying automatic grading for IT student.`);
        
        // Get all exam contents for this exam
        Logger.info(`Getting all exam contents for exam ${exam_id}`);
        const allExamContents = await this.examContentRepository.findByExamId(exam_id);
        Logger.info(`Found ${allExamContents.length} exam contents for exam ${exam_id}`);
        
        // Get the current exam_content_id from the testcase results
        let currentExamContentId = null;
        try {
          if (testcase_results && testcase_results.length > 0) {
            const testcase = await this.testcaseRepository.findById(testcase_results[0].id);
            if (testcase) {
              currentExamContentId = testcase.exam_content_id;
              Logger.info(`Current submission is for exam_content_id: ${currentExamContentId}`);
            }
          }
        } catch (error) {
          Logger.error(`Error finding testcase: ${(error as Error).message}`);
        }
        
        // Calculate score for current testcase results
        let currentScore = 0;
        if (testcase_results && testcase_results.length > 0) {
          for (const result of testcase_results) {
            Logger.info(`Testcase ${result.id}: passed=${result.passed}, score=${result.score}`);
            if (result.passed) {
              // Make sure score is a clean number
              const cleanScore = Math.round(Number(result.score) * 100) / 100;
              currentScore += cleanScore;
              Logger.info(`Adding ${cleanScore} points. Current content score: ${currentScore}`);
            }
          }
        }
        
        // If there's no existing grade, initialize to 0
        let existingGrade = examSubmission.grade ? Number(examSubmission.grade) : 0;
        // Make sure the existing grade is a clean number
        existingGrade = Math.round(existingGrade * 100) / 100;
        Logger.info(`Existing grade before update: ${existingGrade}`);
        
        // Update the grade by adding the current score
        let newGrade = existingGrade + currentScore;
        // Round to 2 decimal places to avoid floating point issues
        newGrade = Math.round(newGrade * 100) / 100;
        Logger.info(`New grade after adding current score (${currentScore}): ${newGrade}`);
        
        // Update the exam submission with the calculated total grade
        examSubmission.grade = newGrade;
        examSubmission.updated_at = new Date();
        
        Logger.info(`Updating grade in database to ${newGrade}...`);
        const updatedSubmission = await this.examSubmissionRepository.updateExamSubmission(
          exam_submission_id,
          examSubmission
        );
        
        Logger.info(`Grade updated successfully. New grade: ${updatedSubmission.grade}`);
        Logger.info(`***** CALCULATE AND UPDATE GRADE COMPLETED *****`);
        
        return updatedSubmission;
      } else {
        Logger.info(`Skipping automatic grading for non-IT student. Exam Type: ${exam.type_student}`);
        Logger.info(`***** CALCULATE AND UPDATE GRADE SKIPPED *****`);
        return examSubmission;
      }
    } catch (error) {
      Logger.error(`Error calculating and updating grade: ${(error as Error).message}`);
      Logger.error(`***** CALCULATE AND UPDATE GRADE FAILED *****`);
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
    error?: string;
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
    let error = "";
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

    // Encode file_content and stdin for Judge0
    const encodedFileContent = Buffer.from(data.file_content).toString('base64');
    const encodedStdin = data.input ? Buffer.from(data.input).toString('base64') : '';

    // Handle user input if provided - make sure we check for empty strings too
    if (data.input && data.input.trim() !== "") {
      Logger.info(`Running code with user-provided input: ${data.input.substring(0, 50)}...`);
      try {
        const judge0ResponseForInput = await this.submitToJudge0({
          source_code: encodedFileContent,
          language_id: data.language_id,
          stdin: encodedStdin,
        });
        
        Logger.info(`Judge0 submission successful. Token: ${judge0ResponseForInput.token}`);

        const submissionResultForInput = await this.getJudge0Result(
          judge0ResponseForInput.token
        );
        
        Logger.info(`Judge0 result received. Status: ${JSON.stringify(submissionResultForInput.status)}`);
        
        // Add the results to run_code_result with decoded error messages
        run_code_result += `User Input Result:\n${submissionResultForInput.status.description}\n`;
        
        // Process program output
        let decodedOutput = "";
        if (submissionResultForInput.stdout) {
          decodedOutput = Buffer.from(submissionResultForInput.stdout, 'base64').toString();
          run_code_result += `Program Output:\n${decodedOutput}\n`;
        }

        // Process runtime errors
        let decodedStderr = "";
        if (submissionResultForInput.stderr) {
          decodedStderr = Buffer.from(submissionResultForInput.stderr, 'base64').toString();
          run_code_result += `Runtime Error:\n${decodedStderr}\n`;
          error += decodedStderr;
        }
        
        // Process compilation errors
        let decodedCompileOutput = "";
        if (submissionResultForInput.compile_output) {
          decodedCompileOutput = Buffer.from(submissionResultForInput.compile_output, 'base64').toString();
          run_code_result += `Compilation Error:\n${decodedCompileOutput}\n`;
          error += decodedCompileOutput;
        }
        
        // Create user input result object with decoded values
        user_input_result = {
          status: {
            id: submissionResultForInput.status.id,
            description: submissionResultForInput.status.description,
          },
          output: decodedOutput || undefined,
          input: data.input,
          error: decodedStderr || decodedCompileOutput || undefined
        };
      } catch (error) {
        Logger.error(`Error running code with input: ${(error as Error).message}`);
        // Don't throw an error here - we want to continue with testcases even if user input fails
        run_code_result += `Error processing user input: ${(error as Error).message}\n\n`;
      }
    } else {
      // Log that we're skipping user input because none was provided
      Logger.info('No user input provided, skipping input execution');
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

      // If no testcases found and no user input provided, run the code with empty input
      if (testcases.length === 0 && (!data.input || data.input.trim() === "")) {
        Logger.info('No testcases found and no user input. Running code with empty input to check compilation.');
        try {
          const judge0Response = await this.submitToJudge0({
            source_code: encodedFileContent,
            language_id: data.language_id,
            stdin: "",
          });

          Logger.info(`Judge0 submission for compilation check successful. Token: ${judge0Response.token}`);

          const submissionResult = await this.getJudge0Result(
            judge0Response.token
          );

          Logger.info(`Judge0 result for compilation check received. Status: ${JSON.stringify(submissionResult.status)}`);

          // Add the results to run_code_result
          run_code_result += `Compilation Check Result:\n${submissionResult.status.description}\n`;

          // Process all outputs and errors
          let decodedOutput = "";
          let decodedStderr = "";
          let decodedCompileOutput = "";

          // Process stdout
          if (submissionResult.stdout) {
            decodedOutput = Buffer.from(submissionResult.stdout, 'base64').toString();
            run_code_result += `Program Output:\n${decodedOutput}\n`;
          }
          
          // Process stderr (runtime errors)
          if (submissionResult.stderr) {
            decodedStderr = Buffer.from(submissionResult.stderr, 'base64').toString();
            run_code_result += `Runtime Error:\n${decodedStderr}\n`;
            error += decodedStderr;
          }
          
          // Process compile_output (compilation errors)
          if (submissionResult.compile_output) {
            decodedCompileOutput = Buffer.from(submissionResult.compile_output, 'base64').toString();
            run_code_result += `Compilation Error:\n${decodedCompileOutput}\n`;
            error += decodedCompileOutput;
          }

          // Create user input result for empty input
          user_input_result = {
            status: {
              id: submissionResult.status.id,
              description: submissionResult.status.description,
            },
            output: decodedOutput || undefined,
            input: "",
            error: decodedStderr || decodedCompileOutput || undefined
          };
        } catch (error) {
          Logger.error(`Error performing compilation check: ${(error as Error).message}`);
          run_code_result += `Error during compilation check: ${(error as Error).message}\n\n`;
        }
      }

      // Process testcases in batches to improve performance
      const BATCH_SIZE = 3; // Process 3 testcases at a time
      
      // Split testcases into batches
      const testcaseBatches = [];
      for (let i = 0; i < testcases.length; i += BATCH_SIZE) {
        testcaseBatches.push(testcases.slice(i, i + BATCH_SIZE));
      }
      
      Logger.info(`Processing testcases in ${testcaseBatches.length} batches of ${BATCH_SIZE}`);
      
      // Process each batch in sequence
      for (let batchIndex = 0; batchIndex < testcaseBatches.length; batchIndex++) {
        const batch = testcaseBatches[batchIndex];
        Logger.info(`Processing batch ${batchIndex + 1}/${testcaseBatches.length} with ${batch.length} testcases`);
        
        // Submit all testcases in the batch in parallel
        const batchSubmissions = await Promise.all(
          batch.map(async (testcase) => {
            Logger.info(`Submitting testcase ${testcase.id} with input: ${testcase.input.substring(0, 50)}...`);
            
            // Encode testcase input
            const encodedTestInput = Buffer.from(testcase.input).toString('base64');
            const encodedExpectedOutput = testcase.expected_output 
              ? Buffer.from(testcase.expected_output).toString('base64')
              : undefined;
              
            const judge0Response = await this.submitToJudge0({
              source_code: encodedFileContent,
              language_id: data.language_id,
              stdin: encodedTestInput,
              expected_output: encodedExpectedOutput,
            });
            
            Logger.info(`Judge0 submission for testcase ${testcase.id} successful. Token: ${judge0Response.token}`);
            
            return {
              testcase,
              token: judge0Response.token
            };
          })
        );
        
        // Wait for all results in the batch in parallel
        const batchResults = await Promise.all(
          batchSubmissions.map(async ({ testcase, token }) => {
            Logger.info(`Getting results for testcase ${testcase.id} with token: ${token}`);
            const submissionResult = await this.getJudge0Result(token);
            
            Logger.info(`Judge0 result for testcase ${testcase.id} received. Status: ${JSON.stringify(submissionResult.status)}`);
            
            return {
              testcase,
              submissionResult
            };
          })
        );
        
        // Process all results in the batch
        for (const { testcase, submissionResult } of batchResults) {
          // Decode all outputs and errors
          let decodedOutput = "";
          let decodedStderr = "";
          let decodedCompileOutput = "";
          
          if (submissionResult.stdout) {
            decodedOutput = Buffer.from(submissionResult.stdout, 'base64').toString();
          }
          
          if (submissionResult.stderr) {
            decodedStderr = Buffer.from(submissionResult.stderr, 'base64').toString();
          }
          
          if (submissionResult.compile_output) {
            decodedCompileOutput = Buffer.from(submissionResult.compile_output, 'base64').toString();
          }
          
          // Combine error information
          const errorInfo = decodedStderr || decodedCompileOutput || "";
          
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
            output: decodedOutput || undefined,
            error: errorInfo || undefined,
          };

          // If testcase passed (status.id === 3 means Accepted)
          if (submissionResult.status.id === 3) {
            totalGrade += testcase.score;
            run_code_result += `Testcase ${testcase.id}: Passed (+${testcase.score} points)\n`;
            if (decodedOutput) {
              run_code_result += `Program Output:\n${decodedOutput}\n`;
            }
            Logger.info(`Testcase ${testcase.id} passed. Score: ${testcase.score}`);
          } else {
            run_code_result += `Testcase ${testcase.id}: Failed (${submissionResult.status.description})\n`;
            
            // Include decoded outputs and errors
            if (decodedCompileOutput) {
              run_code_result += `Compilation Error:\n${decodedCompileOutput}\n`;
            }
            
            if (decodedStderr) {
              run_code_result += `Runtime Error:\n${decodedStderr}\n`;
            }
            
            // Add program output if it exists
            if (decodedOutput) {
              run_code_result += `Program Output:\n${decodedOutput}\n`;
            }
            
            Logger.info(`Testcase ${testcase.id} failed. Status: ${submissionResult.status.description}`);
          }
          
          testcase_results.push(testcaseResult);
        }
        
        // Add a small delay between batches to avoid API rate limits
        if (batchIndex < testcaseBatches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      Logger.info(`All testcases completed. Total grade: ${totalGrade}`);
      return { grade: totalGrade, run_code_result, testcase_results, user_input_result, error};
    } catch (error) {
      Logger.error(`Error in runCode: ${(error as Error).message}`);
      throw new ApiError(
        500,
        CODE_EXECUTION_FAILED.error.message,
        CODE_EXECUTION_FAILED.error.details
      );
    }
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
        data: submission,
      }
      
      Logger.info(`Making request to: ${options.url}`);
      
      const response = await axios.request(options);

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
    
    const maxAttempts = 5;
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
        
        const response = await axios.request(options);

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
