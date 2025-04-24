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
import { BaseService } from "../abstracts/base-service";
import { cacheManager } from "../utils/cache-manager";

/**
 * Service for handling exam submissions
 * Manages exam submissions, their contents, and related operations
 */
class ExamSubmissionService extends BaseService {
  private readonly CACHE_PREFIX = 'exam-submission:';
  private readonly CACHE_TTL = 300; // 5 minutes
  
  // Dependencies injected through the constructor
  private readonly examSubmissionRepository: IExamSubmissionRepository;
  private readonly studentClassRepository: IStudentClassesRepository;
  private readonly classRepository: IClassesRepository;
  private readonly examSubmissionContentRepository: IExamSubmissionContentRepository;
  private readonly languageRepository: ILanguageCodeRepository;
  private readonly testcaseRepository: ITestCaseRepository;
  private readonly examSubmissionContentDetailsRepository: IExamSubmissionContentDetailsRepository;
  private readonly examContentRepository: IExamContentRepository;
  private readonly examRepository: IExamRepository;

  /**
   * Constructor with dependency injection
   */
  constructor(
    examSubmissionRepository: IExamSubmissionRepository = new ExamSubmissionRepository(),
    studentClassRepository: IStudentClassesRepository = new StudentClassesRepository(),
    classRepository: IClassesRepository = new ClassesRepository(),
    examSubmissionContentRepository: IExamSubmissionContentRepository = new ExamSubmissionContentRepository(),
    languageRepository: ILanguageCodeRepository = new LanguageCodeRepository(),
    testcaseRepository: ITestCaseRepository = new TestCaseRepository(),
    examSubmissionContentDetailsRepository: IExamSubmissionContentDetailsRepository = new ExamSubmissionContentDetailsRepository(),
    examContentRepository: IExamContentRepository = new ExamContentRepository(),
    examRepository: IExamRepository = new ExamRepository()
  ) {
    super();
    this.examSubmissionRepository = examSubmissionRepository;
    this.studentClassRepository = studentClassRepository;
    this.classRepository = classRepository;
    this.examSubmissionContentRepository = examSubmissionContentRepository;
    this.languageRepository = languageRepository;
    this.testcaseRepository = testcaseRepository;
    this.examSubmissionContentDetailsRepository = examSubmissionContentDetailsRepository;
    this.examContentRepository = examContentRepository;
    this.examRepository = examRepository;
  }

  //==============================
  // READ OPERATIONS
  //==============================

  /**
   * Get exam submissions based on query options with caching
   * @param options Query options for finding exam submissions
   * @returns Array of exam submissions matching the criteria
   */
  public async get(options: any): Promise<ExamSubmission[]> {
    try {
      const cacheKey = `${this.CACHE_PREFIX}all:${JSON.stringify(options)}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => this.examSubmissionRepository.find(options),
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'get');
    }
  }

  /**
   * Get exam submissions by exam ID with caching
   * @param exam_id The ID of the exam
   * @returns Array of exam submissions for the specified exam
   */
  public async getExamSubmissionByExamId(
    exam_id: number
  ): Promise<ExamSubmission[]> {
    try {
      this.validateRequired(exam_id, 'exam_id');
      
      const cacheKey = `${this.CACHE_PREFIX}exam:${exam_id}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          const exam = await this.examSubmissionRepository.findByExamId(exam_id);
          this.validateExists(exam, 'exam');
          
          return this.examSubmissionRepository.getExamSubmissionByExamId(exam_id);
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getExamSubmissionByExamId');
    }
  }

  /**
   * Get exam submission for a specific student with caching
   * @param student_id The ID of the student
   * @param class_id The ID of the class
   * @param exam_id The ID of the exam
   * @returns The exam submission for the specified student
   */
  public async getExamSubmissionByOneStudent(
    student_id: number,
    class_id: number,
    exam_id: number
  ): Promise<ExamSubmission> {
    try {
      this.validateRequired(exam_id, 'exam_id');
      this.validateRequired(student_id, 'student_id');
      this.validateRequired(class_id, 'class_id');
      
      const cacheKey = `${this.CACHE_PREFIX}student:${student_id}:class:${class_id}:exam:${exam_id}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          const existedStudentClass =
            await this.studentClassRepository.findByStudentId(student_id);
          this.validateExists(existedStudentClass, 'student class');
    
          const existedClass = await this.classRepository.findById(class_id);
          this.validateExists(existedClass, 'class');
    
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
          this.validateExists(examSubmission, 'exam submission');
    
          const examSubmissionContents =
            await this.examSubmissionContentRepository.findByExamSubmissionId(
              examSubmission.exam_submission_id
            );
          return {
            ...examSubmission,
            examSubmissionContents,
          };
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getExamSubmissionByOneStudent');
    }
  }

  /**
   * Get submissions for all students who have submitted an exam with caching
   * @param class_id The ID of the class
   * @param exam_id The ID of the exam
   * @returns Array of exam submissions for the class and exam
   */
  public async getExamSubmissionHaveSubmit(
    class_id: number,
    exam_id: number
  ): Promise<ExamSubmission[]> {
    try {
      this.validateRequired(class_id, 'class_id');
      this.validateRequired(exam_id, 'exam_id');
      
      const cacheKey = `${this.CACHE_PREFIX}class:${class_id}:exam:${exam_id}:submissions`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          const classInfo = await this.studentClassRepository.findByClassId(class_id);
          this.validateExists(classInfo, 'class');
          
          // Get all students in class
          const listUser = await this.studentClassRepository.getAllStudentByClass(class_id);
          const listExamSubmission = [];
          
          // Get all exam submissions of students in class
          for (const user of listUser) {
            try {
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
            } catch (error) {
              // Skip failed submissions and log error
              Logger.error(`Failed to get submission for student ${user.student_id}`);
            }
          }
          return listExamSubmission;
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getExamSubmissionHaveSubmit');
    }
  }

  //==============================
  // WRITE OPERATIONS
  //==============================

  /**
   * Create a new exam submission
   * @param exam_id The ID of the exam
   * @param student_id The ID of the student
   * @param class_id The ID of the class
   * @param data Submission data including file content
   * @returns The created exam submission
   */
  public async createExamSubmission(
    exam_id: number,
    student_id: number,
    class_id: number,
    data: { file_content: string; grade?: number; feed_back?: string }
  ): Promise<ExamSubmission> {
    try {
      this.validateRequired(data, 'data');
      this.validateRequired(data.file_content, 'file_content');
      this.validateRequired(exam_id, 'exam_id');
      this.validateRequired(student_id, 'student_id');
      this.validateRequired(class_id, 'class_id');
      
      const studentClass = await this.getStudentClass(student_id, class_id);
      const existedUser = studentClass?.student_id;
      const existedClass = studentClass?.class_id;
      
      this.validateExists(studentClass, 'student class');
      this.validateExists(existedUser, 'user');
      this.validateExists(existedClass, 'class');
      
      const existedUserAndClass =
        await this.studentClassRepository.findByUserIdAndClassId(
          existedUser,
          existedClass
        );
      this.validateExists(existedUserAndClass, 'user in class');
      
      // Check if the student has already submitted the exam
      const existedExamSubmission =
        await this.examSubmissionRepository.findByExamIdAndStudentClassId(
          exam_id,
          studentClass.student_class_id
        );
      
      // If not, create a new exam submission record; else just create a new content of submission
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
        
        await this.createExamSubmissionContent(
          newExamSubmission.exam_submission_id,
          data.file_content
        );
      }
      
      // Invalidate related caches
      this.invalidateCache(exam_id, student_id, class_id);
      
      return newExamSubmission;
    } catch (error) {
      this.handleError(error, 'createExamSubmission');
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

  /**
   * Run code for an exam submission
   * @param exam_content_id The ID of the exam content
   * @param data The code data to run
   * @returns The result of running the code
   */
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
    error?: string;
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
    try {
      this.validateRequired(exam_content_id, 'exam_content_id');
      await this.validateExamSubmissionData(data);
      
      const examContent = await this.examContentRepository.findById(exam_content_id);
      this.validateExists(examContent, 'exam content');
      
      // Utility functions for encoding/decoding
      const encoded = (str) => str ? Buffer.from(str, "binary").toString("base64") : "";
      const decoded = (str) => str ? Buffer.from(str, "base64").toString() : "";
      
      // Results to return
      const result: {
        grade?: number;
        run_code_result?: string;
        error?: string;
        testcase_results?: Array<any>;
        user_input_result?: any;
      } = {};
      
      // Handle user-provided input if it exists
      if (data.input) {
        try {
          const userInputRequest = await this.submitToJudge0({
            source_code: data.file_content,
            language_id: data.language_id,
            stdin: data.input
          });
          
          const userInputResult = await this.getJudge0Result(userInputRequest.token);
          
          result.user_input_result = {
            status: userInputResult.status,
            output: decoded(userInputResult.stdout),
            error: decoded(userInputResult.stderr),
            input: data.input
          };
        } catch (err) {
          const error = err as Error;
          Logger.error('Error running code with user input', undefined, {
            exam_content_id,
            language_id: data.language_id,
            ctx: 'judge0',
            error: error.message
          });
          
          result.error = error.message;
        }
      }
      
      // Run against testcases if available
      const testcases = await this.testcaseRepository.getAllTestcasesByExamContentId(
        exam_content_id
      );
      
      if (testcases && testcases.length > 0) {
        result.testcase_results = [];
        
        for (const testcase of testcases) {
          try {
            const testcaseRequest = await this.submitToJudge0({
              source_code: data.file_content,
              language_id: data.language_id,
              stdin: testcase.input,
              expected_output: testcase.expected_output
            });
            
            const testcaseResult = await this.getJudge0Result(testcaseRequest.token);
            
            const isPassed = testcaseResult.status.id === 3; // 3 is "Accepted"
            
            result.testcase_results.push({
              id: testcase.id,
              passed: isPassed,
              score: isPassed ? testcase.score : 0,
              status: testcaseResult.status,
              output: decoded(testcaseResult.stdout),
              error: decoded(testcaseResult.stderr),
              expected_output: testcase.expected_output
            });
          } catch (err) {
            const error = err as Error;
            Logger.error('Error running code against testcase', undefined, {
              exam_content_id,
              testcase_id: testcase.id,
              ctx: 'judge0',
              error: error.message
            });
            
            result.testcase_results.push({
              id: testcase.id,
              passed: false,
              score: 0,
              status: {
                id: 999,
                description: "Execution error"
              },
              error: error.message
            });
          }
        }
        
        // Calculate total grade
        if (result.testcase_results.length > 0) {
          result.grade = result.testcase_results.reduce(
            (total, current) => total + current.score,
            0
          );
        }
      }
      
      return result;
    } catch (error) {
      this.handleError(error, 'runCode');
    }
  }

  /**
   * Update an exam submission with grade and feedback
   * @param exam_submission_id The ID of the exam submission
   * @param grade The grade to assign
   * @param feedback The feedback to provide
   * @returns The updated exam submission
   */
  public async updateExamSubmissionWithGrade(
    exam_submission_id: number,
    grade: number,
    feedback: string
  ): Promise<ExamSubmission> {
    try {
      this.validateRequired(exam_submission_id, 'exam_submission_id');
      
      const existingSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
      this.validateExists(existingSubmission, 'exam submission');
      
      // Update the submission with grade and feedback
      const updatedSubmission = await this.examSubmissionRepository.update(
        exam_submission_id,
        {
          ...existingSubmission,
          grade,
          feed_back: feedback,
          updated_at: new Date()
        }
      );
      
      // Invalidate related caches
      this.invalidateCache(existingSubmission.exam_id);
      
      return updatedSubmission;
    } catch (error) {
      this.handleError(error, 'updateExamSubmissionWithGrade');
    }
  }

  /**
   * Validate exam submission data to ensure all required fields are present
   * @param data The submission data to validate
   * @throws ApiError if any required data is missing or invalid
   */
  private async validateExamSubmissionData(data: {
    file_content: string;
    language_id?: number;
    stdin?: string;
    expected_output?: string;
  }): Promise<void> {
    try {
      this.validateRequired(data.file_content, 'file_content');
      
      if (data.language_id) {
        const language = await this.languageRepository.findById(data.language_id);
        this.validateExists(language, 'language');
      }
    } catch (error) {
      this.handleError(error, 'validateExamSubmissionData');
    }
  }

  /**
   * Get student class by student ID and class ID
   * @param student_id The ID of the student
   * @param class_id The ID of the class
   * @returns The student class record
   */
  private async getStudentClass(student_id: number, class_id: number) {
    try {
      this.validateRequired(student_id, 'student_id');
      this.validateRequired(class_id, 'class_id');
      
      const studentClass = await this.studentClassRepository.findByUserIdAndClassId(
        student_id,
        class_id
      );
      
      this.validateExists(studentClass, 'student class');
      return studentClass;
    } catch (error) {
      this.handleError(error, 'getStudentClass');
    }
  }

  /**
   * Create a new exam submission record
   * @param exam_id The ID of the exam
   * @param student_class_id The ID of the student class
   * @param data Additional data for the submission
   * @returns The created exam submission
   */
  private async createExamSubmissionRecord(
    exam_id: number,
    student_class_id: number,
    data: { grade?: number; feed_back?: string; run_code_result?: string }
  ): Promise<ExamSubmission> {
    try {
      this.validateRequired(exam_id, 'exam_id');
      this.validateRequired(student_class_id, 'student_class_id');
      
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
    } catch (error) {
      this.handleError(error, 'createExamSubmissionRecord');
    }
  }

  /**
   * Create a new exam submission content
   * @param exam_submission_id The ID of the exam submission
   * @param file_content The file content to save
   * @returns The created exam submission content
   */
  private async createExamSubmissionContent(
    exam_submission_id: number,
    file_content: string
  ): Promise<ExamSubmissionContent> {
    try {
      this.validateRequired(exam_submission_id, 'exam_submission_id');
      this.validateRequired(file_content, 'file_content');
      
      return await this.examSubmissionContentRepository.save({
        exam_submission_id,
        file_content,
        id: 0,
        created_at: new Date(),
      });
    } catch (error) {
      this.handleError(error, 'createExamSubmissionContent');
    }
  }

  /**
   * Update an existing exam submission
   * @param exam_submission_id The ID of the exam submission to update
   * @param examSubmission The updated exam submission data
   * @returns The updated exam submission
   */
  public async updateExamSubmission(
    exam_submission_id: number,
    examSubmission: ExamSubmission
  ): Promise<ExamSubmission> {
    try {
      this.validateRequired(exam_submission_id, 'exam_submission_id');
      this.validateRequired(examSubmission, 'examSubmission');
      
      const existingSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
      this.validateExists(existingSubmission, 'exam submission');
      
      const updatedSubmission = await this.examSubmissionRepository.update(
        exam_submission_id, 
        {
          ...examSubmission,
          updated_at: new Date(),
        }
      );
      
      // Invalidate related caches
      this.invalidateCache(existingSubmission.exam_id);
      
      return updatedSubmission;
    } catch (error) {
      this.handleError(error, 'updateExamSubmission');
    }
  }

  /**
   * Delete an exam submission
   * @param exam_submission_id The ID of the exam submission to delete
   * @returns The deleted exam submission
   */
  public async deleteExamSubmission(
    exam_submission_id: number
  ): Promise<ExamSubmission> {
    try {
      this.validateRequired(exam_submission_id, 'exam_submission_id');
      
      const existingSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
      this.validateExists(existingSubmission, 'exam submission');
      
      // Get all contents for this submission
      const contents = await this.examSubmissionContentRepository.findByExamSubmissionId(exam_submission_id);
      
      // Delete each content individually
      for (const content of contents) {
        await this.examSubmissionContentRepository.delete(content.id);
      }
      
      const deletedSubmission = await this.examSubmissionRepository.delete(exam_submission_id);
      
      // Invalidate related caches
      this.invalidateCache(existingSubmission.exam_id);
      
      return deletedSubmission;
    } catch (error) {
      this.handleError(error, 'deleteExamSubmission');
    }
  }

  /**
   * Delete an exam submission content
   * @param exam_submission_id The ID of the exam submission
   * @param id The ID of the content to delete
   * @returns The deleted exam submission content
   */
  public async deleteExamSubmissionContent(
    exam_submission_id: number,
    id: number
  ): Promise<ExamSubmissionContent> {
    try {
      this.validateRequired(exam_submission_id, 'exam_submission_id');
      this.validateRequired(id, 'id');
      
      const existingSubmission = await this.examSubmissionRepository.findById(exam_submission_id);
      this.validateExists(existingSubmission, 'exam submission');
      
      const existingContent = await this.examSubmissionContentRepository.findById(id);
      this.validateExists(existingContent, 'exam submission content');
      
      if (existingContent.exam_submission_id !== exam_submission_id) {
        throw new ApiError(400, "Content does not belong to this submission", "Invalid content ID for this submission");
      }
      
      const deletedContent = await this.examSubmissionContentRepository.delete(id);
      
      // Invalidate related caches
      this.invalidateCache(existingSubmission.exam_id);
      
      return deletedContent;
    } catch (error) {
      this.handleError(error, 'deleteExamSubmissionContent');
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
        data: submission
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
    
    const maxAttempts = 15;
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

  //==============================
  // CACHE MANAGEMENT
  //==============================

  /**
   * Invalidate caches after updates
   * @param exam_id The ID of the exam (optional)
   * @param student_id The ID of the student (optional)
   * @param class_id The ID of the class (optional)
   */
  private invalidateCache(exam_id?: number, student_id?: number, class_id?: number): void {
    try {
      // If no specific IDs are provided, invalidate all exam submission caches
      if (!exam_id && !student_id && !class_id) {
        cacheManager.deleteByPrefix(this.CACHE_PREFIX);
        Logger.debug('Invalidated all exam submission caches');
        return;
      }
      
      // List of cache keys to invalidate
      const keysToInvalidate: string[] = [];
      
      // Invalidate exam-specific cache
      if (exam_id) {
        keysToInvalidate.push(`${this.CACHE_PREFIX}exam:${exam_id}`);
      }
      
      // Invalidate student-specific cache
      if (student_id && class_id && exam_id) {
        keysToInvalidate.push(`${this.CACHE_PREFIX}student:${student_id}:class:${class_id}:exam:${exam_id}`);
      }
      
      // Invalidate class-specific cache
      if (class_id && exam_id) {
        keysToInvalidate.push(`${this.CACHE_PREFIX}class:${class_id}:exam:${exam_id}:submissions`);
      }
      
      // Invalidate all-submissions cache
      keysToInvalidate.push(`${this.CACHE_PREFIX}all:`);
      
      // Invalidate the keys
      if (keysToInvalidate.length > 0) {
        cacheManager.deleteMany(keysToInvalidate);
        Logger.debug(`Invalidated exam submission caches: ${keysToInvalidate.join(', ')}`);
      }
    } catch (error) {
      Logger.error('Failed to invalidate exam submission cache');
    }
  }
}

export default ExamSubmissionService;
