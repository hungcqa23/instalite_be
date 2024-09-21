import { LoggerOptions, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const options = {
  console: {
    level: 'silly'
  }
};

const commonFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const fileTransport = new DailyRotateFile({
  dirname: 'logs/%DATE%',
  filename: 'application.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

const errorFileTransport = new DailyRotateFile({
  dirname: 'logs/%DATE%',
  filename: 'error.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error'
});

export const devLoggerConfig: LoggerOptions = {
  format: commonFormat,
  transports: [
    new transports.Console({
      ...options.console,
      format: format.combine(format.colorize(), format.simple())
    }),
    fileTransport,
    errorFileTransport
  ]
};

export const prodLoggerConfig: LoggerOptions = {
  format: commonFormat,
  transports: [
    new transports.Console(options.console),
    fileTransport,
    errorFileTransport
  ]
};

const loggerConfig: LoggerOptions =
  process.env.NODE_ENV === 'production' ? prodLoggerConfig : devLoggerConfig;

export default loggerConfig;
