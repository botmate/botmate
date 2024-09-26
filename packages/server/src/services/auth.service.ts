import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { z } from 'zod';

import { Application } from '../application';
import { SessionModel } from '../models/sessions.model';
import { publicProcedure } from './_trpc';

export class AuthService {
  private _sessionModel = SessionModel;

  constructor(private app: Application) {}

  async getUserFromToken(token: string) {
    if (token) {
      const decoded = jsonwebtoken.verify(token, this.app.env.SECRET) as {
        id: string;
      };
      // todo: cache the session in backend
      const session = await this._sessionModel.findById(decoded.id);
      if (!session) {
        return null;
      }
      if (session.expiresAt < new Date()) {
        await session.deleteOne();
        return null;
      }
      const user = await this.app.usersService.getUserByID(session.userId);
      return user;
    }
    return null;
  }

  async deleteUserSessions(userId: string) {
    await this._sessionModel.deleteMany({ userId });
  }

  validateToken(token: string) {
    try {
      jsonwebtoken.verify(token, this.app.env.SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(username: string, password: string) {
    const user = await this.app.usersService.getUser(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (bcrypt.compareSync(user.password, hashPassword)) {
      throw new Error('Invalid username or password');
    }

    const ONE_DAY = 24 * 60 * 60 * 1000;

    const session = new this._sessionModel({
      userId: user._id,
      token: hashPassword,
      expiresAt: new Date(Date.now() + ONE_DAY * 7),
    });

    await session.save();

    const token = jsonwebtoken.sign(
      {
        id: session._id,
      },
      this.app.env.SECRET,
      {
        expiresIn: '7d',
      },
    );

    return token;
  }

  getRoutes() {
    return {
      login: publicProcedure
        .input(
          z.object({
            username: z.string(),
            password: z.string(),
          }),
        )
        .mutation(({ input }) => {
          return this.login(input.username, input.password);
        }),
    };
  }
}
