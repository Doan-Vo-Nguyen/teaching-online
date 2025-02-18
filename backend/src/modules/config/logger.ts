import pino from 'pino';
import pretty from 'pino-pretty';

const prettyStream = pretty({
  colorize: true,
  translateTime: 'yyyy-mm-dd HH:MM:ss.l',
});

const logger = pino(
  {
    level: 'info',
  },
  pino.multistream([{ stream: prettyStream }])
);

interface LogError {
  field: string;
  error: string;
}

export const Logger = {
  info: (message: string) => {
    logger.info({ message, timestamp: new Date().toISOString() });
  },
  error: (message: unknown, errors?: LogError[]) => {
    let errorMessage = '';

    if (message instanceof Error) {
      errorMessage = message.stack || message.message;
    } else if (typeof message === 'string') {
      errorMessage = message;
    } else {
      errorMessage = JSON.stringify(message, null, 2); // Handle objects, arrays, etc.
    }

    logger.error({
      message: errorMessage,
      errors: errors?.map((err) => ({ field: err.field, error: err.error })) || [],
      timestamp: new Date().toISOString(),
    });
  },
};
