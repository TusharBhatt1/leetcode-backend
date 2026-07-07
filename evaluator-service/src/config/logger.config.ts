import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, colorize, simple } = format;

// Define custom log levels if needed; otherwise defaults to npm levels
export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  transports: [
    // Output structured JSON logs to the terminal
    new transports.Console({
      format: combine(
        colorize(),
        simple()
      )
    }),
    // Persist error logs to a dedicated file
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Persist all application logs to a combined file
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

