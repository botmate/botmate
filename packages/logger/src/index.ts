import * as winston from 'winston';
import { format } from 'winston';

interface LoggerOptions {
  name: string;
  isDev?: boolean;
}

function createLogger(opts: LoggerOptions) {
  const { name, isDev = true } = opts;

  const transports: winston.transport[] = [];

  function addSpaces(level: string) {
    let spaces = '';
    for (let i = level.length; i < 16; i++) {
      spaces += ' ';
    }
    return spaces;
  }

  if (isDev) {
    transports.push(
      new winston.transports.Console({
        format: format.combine(
          format.timestamp({
            format: 'MMM DD, YYYY HH:mm:ss:SSS',
          }),
          format.colorize({
            message: true,
            level: true,
          }),
          format.printf(
            (info) => `${info['timestamp']} [${name}] ${info.message}`,
          ),
          format.errors({ stack: true }),
        ),
      }),
    );
  }

  const logger = winston.createLogger({
    level: isDev ? 'debug' : 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'botmate' },
    transports,
  });

  return logger;
}

export { createLogger, type winston };
