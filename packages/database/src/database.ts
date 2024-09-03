import { createLogger } from '@botmate/logger';
import { Sequelize } from 'sequelize';

interface DatabaseOptions {
  dbPath?: string;
}

export class Database {
  sequelize: Sequelize;
  logger = createLogger({ name: Database.name });

  constructor(options?: DatabaseOptions) {
    const { dbPath = 'storage/db/dev.sqlite3' } = options || {};
    const { logger } = this;

    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging(sql, timing) {
        logger.debug(sql, { timing });
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
