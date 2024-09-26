import bcrypt from 'bcrypt';

import { Application } from '../application';
import { UserModel } from '../models/users.model';
import { authedProcedure } from './_trpc';

export class UsersService {
  model = UserModel;

  constructor(private app: Application) {}

  async createUser(username: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.model({
      username,
      password: hash,
    });

    await user.save();
  }

  async createDefaultUser() {
    const username = 'admin';
    const password = 'admin';

    await this.createUser(username, password);
  }

  async countUsers() {
    return this.model.countDocuments();
  }

  async getUser(username: string) {
    return this.model.findOne({ username });
  }

  async getUserByID(id: string) {
    return this.model.findById(id);
  }

  async deleteUser(username: string) {
    await this.model.deleteOne({ username });
  }

  async updateUser() {
    //
  }

  async listUsers() {
    return this.model.find();
  }

  async resetPassword(username: string, password: string) {
    const user = await this.getUser(username);

    if (!user) {
      throw new Error('User not found');
    }

    const hash = await bcrypt.hash(password, 10);

    await this.app.authService.deleteUserSessions(user._id);

    await this.model.updateOne(
      {
        username,
      },
      {
        password: hash,
      },
    );
  }

  getRoutes() {
    return {
      me: authedProcedure.query(({ ctx }) => {
        return ctx.user;
      }),
    };
  }
}
