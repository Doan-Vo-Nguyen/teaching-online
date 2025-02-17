import pino from 'pino';
import pretty from 'pino-pretty';
const prettyStream = pretty({
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
});
const logger = pino({
    level: 'info',
}, pino.multistream([
    { stream: prettyStream }
]));
export const Logger = {
    info: (message) => {
        logger.info({ message, timestamp: new Date().toISOString() });
    },
    error: (message, errors) => {
        logger.error({
            message,
            errors: errors?.map(err => ({ field: err.field, error: err.error })) || [],
            timestamp: new Date().toISOString()
        });
    }
};
//# sourceMappingURL=logger.js.map