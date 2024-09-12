import { LoggerOptions, createLogger, format, transports } from 'winston';

// custom log display format
const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  console.log('Timestamp:', timestamp);
  console.log('Level:', level);
  console.log('Stack:', stack);
  console.log('Message:', message);

  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

const options = {
  file: {
    filename: 'error.log',
    level: 'error'
  },
  console: {
    level: 'silly'
  }
};

//for development environment
const devLoggerConfig: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file)
  ]
};

const prodLoggerConfig: LoggerOptions = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file),
    new transports.File({
      filename: 'combined.log',
      level: 'info'
    })
  ]
};

// export log instance based on the current environment
const loggerConfig: LoggerOptions =
  process.env.NODE_ENV === 'production' ? prodLoggerConfig : devLoggerConfig;

const instanceLogger = createLogger(loggerConfig);
// export  default the logger instance to be used in other modules because it is a singleton (node js module)
export default instanceLogger;
