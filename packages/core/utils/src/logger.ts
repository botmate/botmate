import { createLogger as CreateLogger, format, transports } from 'winston';

import { env } from './env';

export function createLogger(name = 'server') {
  const logger = CreateLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    transports: [
      new transports.Console({
        format: format.combine(
          format.simple(),
          format.colorize({
            all: true,
          }),
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.printf(
            (info) =>
              `${info['timestamp']} : ${info.level} \t[${name}] ${info.message}`,
          ),
          format.errors({ stack: true }),
        ),
      }),
    ],
  });

  return logger;
}

export type Logger = ReturnType<typeof createLogger>;
