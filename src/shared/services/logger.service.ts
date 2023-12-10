import config from "../../../config";
import winston from 'winston'

class LoggerConfigs {

    private static readonly format = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        )
    );

    private static readonly logLevels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    };

    private static readonly logColors = {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white',
    };

    private static readonly transports = [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${this.setLogsFileName()}-error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${config.LOGGING_DIRECTORY}/all.log` }),
    ];

    public static readonly logger = winston.createLogger({
        level: this.getLogLevel(),
        levels: this.logLevels,
        format: this.format,
        transports: this.transports
    });

    private static getLogLevel() {
        const env = process.env.NODE_ENV || 'development'
        const isDevelopment = env === 'development'
        return isDevelopment ? 'debug' : 'error'
    }

    private static setLogsFileName(): string {
        return `${config.LOGGING_DIRECTORY}/${new Date().getTime()}-${new Date().getMilliseconds()}-`;
    }
}

export const logger = LoggerConfigs.logger;