import { AuditLogDTO } from "../DTO/audit-log.dto";
import { IAuditLogRepository } from "../interfaces/audit-log.interface";
import { AuditLogRepository } from "../repositories/audit-log.repository";
import { ApiError } from "../types/ApiError";
import {
  CREATE_FAILED,
  FIELD_REQUIRED,
  NOT_FOUND,
} from "../DTO/resDto/BaseErrorDto";
import { BaseService } from "../abstracts/base-service";
import { cacheManager } from "../utils/cache-manager";
import { Logger } from "../config/logger";
import { ActionType, AuditLog } from "../entity/AuditLog.mongo";

class AuditLogService extends BaseService {
  private readonly auditLogRepository: IAuditLogRepository;
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'audit_log:';

  constructor(auditLogRepository: IAuditLogRepository = new AuditLogRepository()) {
    super();
    this.auditLogRepository = auditLogRepository;
  }

  /**
   * Get all audit logs with optional filtering and caching
   */
  public async getAllAuditLogs(filters: {
    user_id?: number;
    action?: ActionType;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    try {
      // Create a cache key based on filters
      const filterKey = JSON.stringify(filters);
      const cacheKey = `${this.CACHE_PREFIX}all:${filterKey}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          // Apply filters
          let query: any = {};
          
          if (filters.user_id) {
            query.user_id = filters.user_id;
          }
          
          if (filters.action) {
            query.action = filters.action;
          }
          
          if (filters.startDate && filters.endDate) {
            return this.auditLogRepository.findByDateRange(filters.startDate, filters.endDate);
          }
          
          return this.auditLogRepository.find(query);
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getAllAuditLogs');
    }
  }

  /**
   * Get audit log by ID with caching
   */
  public async getAuditLogById(id: number) {
    try {
      this.validateRequired(id, 'id');
      
      const cacheKey = `${this.CACHE_PREFIX}${id}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          const auditLog = await this.auditLogRepository.findById(id);
          this.validateExists(auditLog, 'audit log');
          return auditLog;
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getAuditLogById');
    }
  }

  /**
   * Get audit logs by user ID with caching
   */
  public async getAuditLogsByUserId(userId: number) {
    try {
      this.validateRequired(userId, 'userId');
      
      const cacheKey = `${this.CACHE_PREFIX}user:${userId}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          return this.auditLogRepository.findByUserId(userId);
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getAuditLogsByUserId');
    }
  }

  /**
   * Get audit logs by action type with caching
   */
  public async getAuditLogsByAction(action: string) {
    try {
      this.validateRequired(action, 'action');
      
      const cacheKey = `${this.CACHE_PREFIX}action:${action}`;
      
      return await cacheManager.getOrSet(
        cacheKey,
        async () => {
          return this.auditLogRepository.findByAction(action);
        },
        this.CACHE_TTL
      );
    } catch (error) {
      this.handleError(error, 'getAuditLogsByAction');
    }
  }

  /**
   * Create a new audit log entry
   */
  public async createAuditLog(auditLogData: Partial<AuditLogDTO>) {
    try {
      this.validateRequired(auditLogData, 'auditLogData');
      this.validateRequired(auditLogData.user_id, 'user_id');
      this.validateRequired(auditLogData.username, 'username');
      this.validateRequired(auditLogData.action, 'action');
      
      const newAuditLog = await this.auditLogRepository.logUserAction(auditLogData as AuditLog);
      if (!newAuditLog) {
        throw new ApiError(
          400,
          CREATE_FAILED.error.message,
          CREATE_FAILED.error.details
        );
      }
      
      // Invalidate cache
      this.invalidateCache();
      
      return newAuditLog;
    } catch (error) {
      this.handleError(error, 'createAuditLog');
    }
  }

  /**
   * Update an audit log entry
   */
  public async updateAuditLog(id: number, auditLogData: Partial<AuditLogDTO>) {
    try {
      this.validateRequired(id, 'id');
      
      const existingAuditLog = await this.auditLogRepository.findById(id);
      this.validateExists(existingAuditLog, 'audit log');
      
      const updatedAuditLog = await this.auditLogRepository.update(id, auditLogData as AuditLog);
      
      // Invalidate cache
      this.invalidateCache(id);
      
      return updatedAuditLog;
    } catch (error) {
      this.handleError(error, 'updateAuditLog');
    }
  }

  /**
   * Update the end time of an audit log and calculate duration
   */
  public async updateLogEndTime(id: string, endTime: Date) {
    try {
      this.validateRequired(id, 'id');
      this.validateRequired(endTime, 'endTime');
      
      const updatedAuditLog = await this.auditLogRepository.updateLogEndTime(id, endTime);
      
      // Invalidate cache
      this.invalidateCache(parseInt(id));
      
      return updatedAuditLog;
    } catch (error) {
      this.handleError(error, 'updateLogEndTime');
    }
  }

  /**
   * Invalidate cache entries after data changes
   */
  private invalidateCache(id?: number) {
    try {
      // Always invalidate the "all" cache
      cacheManager.delete(`${this.CACHE_PREFIX}all:`);
      
      // If specific ID provided, invalidate that cache too
      if (id) {
        cacheManager.delete(`${this.CACHE_PREFIX}${id}`);
      }
      
      Logger.debug(`Cache invalidated for audit logs ${id ? `id:${id}` : 'all'}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Logger.error(`Failed to invalidate audit log cache: ${errorMessage}`);
    }
  }
}

export default AuditLogService; 