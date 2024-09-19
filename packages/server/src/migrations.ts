import { Database, QueryInterface } from '@botmate/database';
import { SequelizeStorage, Umzug } from 'umzug';

export class Migrations {
  umzug: Umzug<QueryInterface>;

  constructor(_db: Database) {
    this.umzug = new Umzug({
      migrations: {
        glob: ['migrations/*.js', { cwd: __dirname }],
      },
      context: _db.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: _db.sequelize,
      }),
      logger: console,
    });
  }

  async runMigrations() {
    await this.umzug.up();
  }
}
