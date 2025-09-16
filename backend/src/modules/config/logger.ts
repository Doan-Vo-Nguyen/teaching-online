import pino from 'pino';
import pretty from 'pino-pretty';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Constants for log levels
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Interface for custom log metadata
export interface LogMetadata {
  traceId?: string;
  userId?: string | number;
  module?: string; // Module/component name
  action?: string; // Action being performed
  duration?: number; // Duration in milliseconds
  [key: string]: any;
}

interface LogError {
  field: string;
  error: string;
  code?: string;
}

// Create pretty stream for development environment
const prettyStream = pretty({
  colorize: true,
  translateTime: 'HH:MM:ss.l',
  messageFormat: '{traceId} | {module} | {action} | {message}',
  singleLine: true,
  ignore: 'hostname,pid',
});

// Configure the logger based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

const logger = pino(
  {
    level: logLevel,
    redact: [
      'body.password', 
      'body.token', 
      'body.secret',
      'body.apiKey',
      'headers.authorization',
      'headers.cookie'
    ],
    base: {
      env: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
  isDevelopment 
    ? pino.multistream([{ stream: prettyStream }])
    : undefined
);

// Store active trace contexts with TTL
const traceContextStore = new Map<string, LogMetadata>();
const TRACE_TTL = 30 * 60 * 1000; // 30 minutes

// Cleanup expired traces
setInterval(() => {
  const now = Date.now();
  for (const [traceId, metadata] of traceContextStore.entries()) {
    if (metadata.startTime && (now - metadata.startTime) > TRACE_TTL) {
      traceContextStore.delete(traceId);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export const Logger = {
  // Core logging method
  log: (level: LogLevel, message: string, metadata?: LogMetadata) => {
    const logData = {
      message,
      ...metadata,
      level,
    };
    
    logger[level](logData);
  },

  // Shorthand methods for different log levels
  trace: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.TRACE, message, metadata);
  },

  debug: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.DEBUG, message, metadata);
  },

  info: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.INFO, message, metadata);
  },

  warn: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.WARN, message, metadata);
  },

  error: (message: unknown, errors?: LogError[] | LogError | any, metadata?: LogMetadata) => {
    let errorMessage = '';
    let errorStack = '';

    if (message instanceof Error) {
      errorMessage = message.message;
      errorStack = message.stack || '';
    } else if (typeof message === 'string') {
      errorMessage = message;
    } else {
      errorMessage = JSON.stringify(message, null, 2);
    }

    // Xử lý errors một cách an toàn
    let processedErrors: any[] = [];
    if (errors) {
      if (Array.isArray(errors)) {
        processedErrors = errors.map((err) => ({ 
          field: err.field, 
          error: err.error,
          code: err.code 
        }));
      } else if (typeof errors === 'object' && errors !== null) {
        // Nếu errors là một object đơn lẻ, chuyển thành mảng
        processedErrors = [{
          field: errors.field || 'unknown',
          error: errors.error || errors.message || JSON.stringify(errors),
          code: errors.code
        }];
      } else {
        // Nếu errors là primitive value, chuyển thành object
        processedErrors = [{
          field: 'error',
          error: String(errors),
          code: undefined
        }];
      }
    }

    logger.error({
      message: errorMessage,
      stack: errorStack,
      errors: processedErrors,
      ...metadata,
    });
  },

  fatal: (message: string, error?: Error, metadata?: LogMetadata) => {
    Logger.log(LogLevel.FATAL, message, {
      ...metadata,
      error: error ? { 
        message: error.message,
        stack: error.stack 
      } : undefined,
    });
  },

  // Trace management
  startTrace: (initialContext: LogMetadata = {}): string => {
    const traceId = uuidv4().slice(0, 8);
    traceContextStore.set(traceId, {
      ...initialContext,
      traceId,
      startTime: Date.now(),
    });
    return traceId;
  },

  addToTrace: (traceId: string, data: LogMetadata): void => {
    if (traceContextStore.has(traceId)) {
      const existingData = traceContextStore.get(traceId) || {};
      traceContextStore.set(traceId, { ...existingData, ...data });
    }
  },

  endTrace: (traceId: string, message?: string): void => {
    if (traceContextStore.has(traceId)) {
      const traceData = traceContextStore.get(traceId);
      if (traceData && traceData.startTime) {
        const duration = Date.now() - traceData.startTime;
        Logger.info(message || 'Trace completed', {
          traceId,
          duration,
          ...traceData,
        });
      }
      traceContextStore.delete(traceId);
    }
  },

  // HTTP request logging middleware
  requestLogger: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const traceId = req.headers['x-trace-id'] as string || Logger.startTrace();
      
      // Store trace ID in request for later use
      (req as any).traceId = traceId;
      
      // Log incoming request
      Logger.info(`${req.method} ${req.originalUrl}`, {
        traceId,
        module: 'http',
        action: 'request',
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.id,
        body: req.body ? Object.keys(req.body).length : 0,
      });
      
      // Intercept response
      const originalSend = res.send;
      res.send = function (body) {
        const responseTime = Date.now() - startTime;
        
        // Log response with performance metrics
        Logger.info(`${res.statusCode} ${req.method} ${req.originalUrl}`, {
          traceId,
          module: 'http',
          action: 'response',
          statusCode: res.statusCode,
          method: req.method,
          url: req.originalUrl,
          duration: responseTime,
          userId: (req as any).user?.id,
        });
        
        // Record metrics
        recordMetric('http_request_duration', responseTime, {
          method: req.method,
          status: res.statusCode.toString(),
          endpoint: req.route?.path || req.originalUrl,
        });
        
        recordMetric('http_requests_total', 1, {
          method: req.method,
          status: res.statusCode.toString(),
        });
        
        return originalSend.call(this, body);
      };
      
      next();
    };
  },

  // Database operation logging
  dbOperation: (operation: string, table: string, duration: number, metadata?: LogMetadata) => {
    Logger.debug(`DB ${operation} on ${table}`, {
      ...metadata,
      module: 'database',
      action: operation,
      table,
      duration,
    });
    
    recordMetric('db_operation_duration', duration, {
      operation,
      table,
    });
  },

  // Authentication logging
  auth: (action: string, userId?: string | number, metadata?: LogMetadata) => {
    Logger.info(`Authentication: ${action}`, {
      ...metadata,
      module: 'auth',
      action,
      userId,
    });
    
    recordMetric('auth_operations_total', 1, { action });
  },

  // Business logic logging
  business: (action: string, entity: string, metadata?: LogMetadata) => {
    Logger.info(`Business operation: ${action} on ${entity}`, {
      ...metadata,
      module: 'business',
      action,
      entity,
    });
  },

  // Metrics collection
  metrics: {
    counters: new Map<string, number>(),
    histograms: new Map<string, number[]>(),
    lastReset: Date.now(),
  },

  // Reset metrics (call periodically)
  resetMetrics: () => {
    Logger.metrics.counters.clear();
    Logger.metrics.histograms.clear();
    Logger.metrics.lastReset = Date.now();
    Logger.info('Metrics reset', { module: 'metrics', action: 'reset' });
  },

  // Get metrics in Prometheus format
  getMetricsForPrometheus: (): string => {
    const lines: string[] = [];
    const now = Date.now();
    
    // Export counters
    for (const [key, value] of Logger.metrics.counters.entries()) {
      lines.push(`# HELP ${key} Total count of ${key}`);
      lines.push(`# TYPE ${key} counter`);
      lines.push(`${key} ${value}`);
    }
    
    // Export histogram summaries
    for (const [key, values] of Logger.metrics.histograms.entries()) {
      if (values.length === 0) continue;
      
      const sum = values.reduce((a, b) => a + b, 0);
      const count = values.length;
      const avg = sum / count;
      const sorted = values.sort((a, b) => a - b);
      const p50 = sorted[Math.floor(count * 0.5)];
      const p95 = sorted[Math.floor(count * 0.95)];
      const p99 = sorted[Math.floor(count * 0.99)];
      
      lines.push(`# HELP ${key}_duration_seconds Duration of ${key} in seconds`);
      lines.push(`# TYPE ${key}_duration_seconds histogram`);
      lines.push(`${key}_duration_seconds_sum ${sum / 1000}`);
      lines.push(`${key}_duration_seconds_count ${count}`);
      lines.push(`${key}_duration_seconds_bucket{le="0.1"} ${sorted.filter(v => v <= 100).length}`);
      lines.push(`${key}_duration_seconds_bucket{le="0.5"} ${sorted.filter(v => v <= 500).length}`);
      lines.push(`${key}_duration_seconds_bucket{le="1.0"} ${sorted.filter(v => v <= 1000).length}`);
      lines.push(`${key}_duration_seconds_bucket{le="5.0"} ${sorted.filter(v => v <= 5000).length}`);
      lines.push(`${key}_duration_seconds_bucket{le="+Inf"} ${count}`);
      
      // Legacy metrics for backward compatibility
      lines.push(`${key}_avg ${avg}`);
      lines.push(`${key}_p50 ${p50}`);
      lines.push(`${key}_p95 ${p95}`);
      lines.push(`${key}_p99 ${p99}`);
    }
    
    // Add metadata
    lines.push(`# Last reset: ${new Date(Logger.metrics.lastReset).toISOString()}`);
    lines.push(`# Current time: ${new Date(now).toISOString()}`);
    
    return lines.join('\n');
  },

  // Health check
  health: () => {
    const activeTraces = traceContextStore.size;
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      activeTraces,
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
      metrics: {
        counters: Logger.metrics.counters.size,
        histograms: Logger.metrics.histograms.size,
      },
    };
  },
};

// Metric recording function
function recordMetric(name: string, value: number, labels: Record<string, string> = {}) {
  const labelKey = Object.entries(labels)
    .map(([k, v]) => `${k}="${v}"`)
    .join(',');
  
  const metricKey = labelKey ? `${name}{${labelKey}}` : name;
  
  if (name.includes('_count') || name.includes('_total')) {
    const currentValue = Logger.metrics.counters.get(metricKey) || 0;
    Logger.metrics.counters.set(metricKey, currentValue + value);
  } else {
    const values = Logger.metrics.histograms.get(metricKey) || [];
    values.push(value);
    // Keep only last 1000 values to prevent memory issues
    if (values.length > 1000) {
      values.splice(0, values.length - 1000);
    }
    Logger.metrics.histograms.set(metricKey, values);
  }
}

// Auto-reset metrics every hour
setInterval(() => {
  Logger.resetMetrics();
}, 60 * 60 * 1000);

export default Logger;
