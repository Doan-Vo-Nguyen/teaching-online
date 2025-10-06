import ExamSubmissionService, {  } from "./exam-submision.service";
import { ExamSubmissionRepository } from "../repositories/exam-submission.repository";
import { StudentClassesRepository } from "../repositories/student-classes.repository";
import { ClassesRepository } from "../repositories/classes.repository";
import { ExamSubmissionContentRepository } from "../repositories/exam-submission-content.repository";
import { LanguageCodeRepository } from "../repositories/language-code.repository";
import { TestCaseRepository } from "../repositories/testcase.repository";
import { ExamSubmissionContentDetailsRepository } from "../repositories/exam-submission-content-details.repository";
import { ExamContentRepository } from "../repositories/exam-content.repository";
import { ExamRepository } from "../repositories/exam.repository";
import { OneCompilerService } from "./onecompiler.service";

/**
 * Factory for creating ExamSubmissionService with default dependencies
 */
export class ExamSubmissionServiceFactory {
  private static instance: ExamSubmissionService;

  public static getInstance(): ExamSubmissionService {
    if (!this.instance) {
      this.instance = new ExamSubmissionService(
        new ExamSubmissionRepository(),
        new StudentClassesRepository(),
        new ClassesRepository(),
        new ExamSubmissionContentRepository(),
        new LanguageCodeRepository(),
        new TestCaseRepository(),
        new ExamSubmissionContentDetailsRepository(),
        new ExamContentRepository(),
        new ExamRepository(),
        new OneCompilerService()
      );
    }
    return this.instance;
  }

  public static createWithCustomDependencies(
    examSubmissionRepository: any,
    studentClassRepository: any,
    classRepository: any,
    examSubmissionContentRepository: any,
    languageRepository: any,
    testcaseRepository: any,
    examSubmissionContentDetailsRepository: any,
    examContentRepository: any,
    examRepository: any,
    oneCompilerService: any
  ): ExamSubmissionService {
    return new ExamSubmissionService(
      examSubmissionRepository,
      studentClassRepository,
      classRepository,
      examSubmissionContentRepository,
      languageRepository,
      testcaseRepository,
      examSubmissionContentDetailsRepository,
      examContentRepository,
      examRepository,
      oneCompilerService
    );
  }
}
