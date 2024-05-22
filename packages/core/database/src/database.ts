import type { Logger } from '@botmate/utils';
import { Sequelize } from 'sequelize';

interface DatabaseOptions {
  dbPath?: string;
  logger: Logger;
}

export class Database {
  sequelize: Sequelize;

  constructor(options: DatabaseOptions) {
    const { dbPath = 'storage/database.sqlite', logger } = options;

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
