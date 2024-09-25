import { createLogger, winston } from '@botmate/logger';
import { Sequelize } from 'sequelize';

interface DatabaseOptions {
  dbPath?: string;
}

export class Database {
  sequelize: Sequelize;
  logger: winston.Logger = createLogger({ name: Database.name });

  constructor(options?: DatabaseOptions) {
    const { dbPath = 'storage/db/dev.sqlite3' } = options || {};
    const { logger } = this;

    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging(sql) {
        logger.debug(sql);
      },
    });

    this.sequelize = sequelize;
  }
}

export {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  ModelStatic,
} from 'sequelize';
