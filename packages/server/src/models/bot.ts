import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
  Sequelize
} from '@botmate/database';
import { PlatformType } from '@botmate/platform';

import { BotStatus } from '../bot';

export class BotModel extends Model<
  InferAttributes<BotModel>,
  InferCreationAttributes<BotModel>
> {
  declare id: CreationOptional<string>;
  declare botId: string;
  declare name: string;
  declare platformType: PlatformType;
  declare raw: Record<string, unknown> | null;
  declare credentials: Record<string, string> | null;
  declare avatar: string;
  declare enabled: boolean;
  declare status: BotStatus;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initBotsModel(db: Sequelize): ModelStatic<BotModel> {
  return db.define<BotModel>(
    'bots',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      botId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      platformType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      raw: {
        type: DataTypes.JSON,
        allowNull: true
      },
      credentials: {
        type: DataTypes.JSON,
        allowNull: true
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'error'),
        allowNull: false,
        defaultValue: 'inactive'
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true
    }
  );
}

export type IBot = InferAttributes<BotModel>;
