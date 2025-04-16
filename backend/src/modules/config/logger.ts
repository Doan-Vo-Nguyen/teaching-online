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
  // Simplified metadata
  ctx?: string; // context information
  [key: string]: any;
}

interface LogError {
  field: string;
  error: string;
}

// Create a simplified pretty stream for one-line logs
const prettyStream = pretty({
  colorize: true,
  translateTime: 'HH:MM:ss.l',
  messageFormat: '{traceId} | {ctx} | {message}',
  singleLine: true,
  ignore: 'hostname,pid',
});

// Configure the logger with options
const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    redact: ['body.password', 'body.token', 'body.secret'], // Redact sensitive fields
    base: {
      env: process.env.NODE_ENV || 'development',
    },
  },
  pino.multistream([{ stream: prettyStream }])
);

// Store active trace contexts
const traceContextStore = new Map<string, LogMetadata>();

export const Logger = {
  // Log a message at the specified level with metadata
  log: (level: LogLevel, message: string, metadata?: LogMetadata) => {
    logger[level]({
      message,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },

  // Shorthand methods for different log levels
  trace: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.TRACE, message, metadata);
  },

  debug: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.DEBUG, message, metadata);
  },

  info: (message: string, metadata?: LogMetadata) => {
    logger.info({
      message,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },

  warn: (message: string, metadata?: LogMetadata) => {
    Logger.log(LogLevel.WARN, message, metadata);
  },

  error: (message: unknown, errors?: LogError[], metadata?: LogMetadata) => {
    let errorMessage = '';

    if (message instanceof Error) {
      errorMessage = message.message;
    } else if (typeof message === 'string') {
      errorMessage = message;
    } else {
      errorMessage = JSON.stringify(message, null, 2);
    }

    logger.error({
      message: errorMessage,
      errors: errors?.map((err) => ({ field: err.field, error: err.error })) || [],
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  },

  fatal: (message: string, error?: Error, metadata?: LogMetadata) => {
    Logger.log(LogLevel.FATAL, message, {
      ...metadata,
      error: error ? { message: error.message } : undefined,
    });
  },

  // Create and return a new trace ID
  startTrace: (initialContext: LogMetadata = {}): string => {
    const traceId = uuidv4().slice(0, 8); // Shorter trace ID
    traceContextStore.set(traceId, {
      ...initialContext,
      traceId,
      startTime: Date.now(),
    });
    return traceId;
  },

  // Add data to an existing trace
  addToTrace: (traceId: string, data: LogMetadata): void => {
    if (traceContextStore.has(traceId)) {
      const existingData = traceContextStore.get(traceId) || {};
      traceContextStore.set(traceId, { ...existingData, ...data });
    }
  },

  // End the trace and log a summary
  endTrace: (traceId: string, message?: string): void => {
    if (traceContextStore.has(traceId)) {
      traceContextStore.delete(traceId);
    }
  },

  // Create a middleware to log HTTP requests in a simplified format
  requestLogger: () => {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const traceId = req.headers['x-trace-id'] as string || Logger.startTrace();
      
      // Store trace ID in request for later use
      (req as any).traceId = traceId;
      
      // Log the incoming request with minimal info
      Logger.info(`${req.method} ${req.originalUrl}`, {
        traceId,
        ctx: 'request',
        userId: (req as any).user?.id,
      });
      
      // Intercept the response
      const originalSend = res.send;
      res.send = function (body) {
        const responseTime = Date.now() - startTime;
        
        // Simple log format for response
        Logger.info(`${res.statusCode} ${req.method} ${req.originalUrl} ${responseTime}ms`, {
          traceId,
          ctx: 'response',
          userId: (req as any).user?.id,
        });
        
        return originalSend.call(this, body);
      };
      
      next();
    };
  },

  // Metrics collection - simplified version
  metrics: {
    counters: new Map<string, number>(),
    histograms: new Map<string, number[]>(),
  },

  // Get metrics in simplified format
  getMetricsForPrometheus: (): string => {
    const lines: string[] = [];
    
    // Export counters
    for (const [key, value] of Logger.metrics.counters.entries()) {
      lines.push(`${key} ${value}`);
    }
    
    // Export histogram summaries (simplified)
    for (const [key, values] of Logger.metrics.histograms.entries()) {
      if (values.length === 0) continue;
      
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      lines.push(`${key}_sum ${sum}`);
      lines.push(`${key}_count ${values.length}`);
      lines.push(`${key}_avg ${avg}`);
    }
    
    return lines.join('\n');
  },
};

// Simplified metric recording
function recordMetric(name: string, value: number, labels: Record<string, string> = {}) {
  const labelKey = Object.entries(labels)
    .map(([k, v]) => `${k}:${v}`)
    .join(',');
  
  const metricKey = labelKey ? `${name}{${labelKey}}` : name;
  
  if (name.includes('_count') || name.includes('_total')) {
    const currentValue = Logger.metrics.counters.get(metricKey) || 0;
    Logger.metrics.counters.set(metricKey, currentValue + value);
  } else {
    const values = Logger.metrics.histograms.get(metricKey) || [];
    values.push(value);
    Logger.metrics.histograms.set(metricKey, values);
  }
}
