import type { ModelStatic } from '@botmate/database';
import type { UserModel } from '@botmate/plugin-users';
import { Plugin } from '@botmate/server';
import { env } from '@botmate/utils';
import * as jsonwebtoken from 'jsonwebtoken';
import { z } from '@botmate/utils';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type LoginSchema = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});
type RegisterSchema = z.infer<typeof registerSchema>;

import { hashPassword, verifyPassword } from './hash';

export class AuthPlugin extends Plugin {
  override async load() {
    const model = this.db.models['users'] as unknown as ModelStatic<UserModel>;
    if (!model) {
      throw new Error('Users model not found');
    }

    
    this.router.post('/auth/login', async (ctx) => {
      const { email,password } = <LoginSchema>ctx.request.body;
      const user = await model.findOne({ where: { email } });

      if (!user) {
        ctx.body = { error: 'Invalid email or password' };
        ctx.status = 400;
        return;
      }
      if (!verifyPassword(password, user.password)) {
        ctx.body = { error: 'Invalid email or password' };
        ctx.status = 400;
        return;
      }

      const token = jsonwebtoken.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' },
      );

      ctx.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ctx.body = { token };
    });

    this.router.post('/auth/register', async (ctx) => {
      const { name, email, password } = <RegisterSchema>ctx.request.body;
      const exist = await model.findOne({ where: { email } });
      if (exist) {
        ctx.body = { error: 'User already exists' };
        ctx.status = 400;
        return;
      }
      const data = await model.create({
        name,
        email,
        password: hashPassword(password),
        role: 'user',
        enabled: true,
      });

      const token = jsonwebtoken.sign(
        { id: data.id, role: data.role },
        env.JWT_SECRET,
        { expiresIn: '7d' },
      );

      ctx.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ctx.body = { data: token };
    });

    this.app.router.get('/auth/me', async (ctx) => {
      const token = ctx.headers.authorization?.split(' ')[1];
      if (!token) {
        return ctx.throw(401, 'Unauthorized');
      }
      try {
        const decoded = jsonwebtoken.verify(token, env.JWT_SECRET) as {
          id: string;
        };
        const user = await model.findByPk(decoded.id);
        if (!user) {
          ctx.throw(401, 'Unauthorized');
        }
        ctx.body = { data: user };
      } catch (error) {
        return ctx.throw(401, 'Unauthorized');
      }
    });
  }
}
