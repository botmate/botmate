import type { ModelStatic } from '@botmate/database';
import type { UserModel } from '@botmate/plugin-users';
import { Plugin } from '@botmate/server';
import { env } from '@botmate/utils';
import { z } from '@botmate/utils';
import * as jsonwebtoken from 'jsonwebtoken';

import { hashPassword, verifyPassword } from './hash';

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

export class AuthPlugin extends Plugin {
  override async load() {
    const model = this.db.models['users'] as unknown as ModelStatic<UserModel>;
    if (!model) {
      throw new Error('Users model not found');
    }

    this.router.post('/auth/login', async (req, res) => {
      const { email, password } = req.body as LoginSchema;
      const user = await model.findOne({ where: { email } });

      if (!user) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }
      if (!verifyPassword(password, user.password)) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }

      const token = jsonwebtoken.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ data: token });
    });

    this.router.post('/auth/register', async (req, res) => {
      const { name, email, password } = req.body as RegisterSchema;
      const exist = await model.findOne({ where: { email } });
      if (exist) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
      await model.create({
        name,
        email,
        password: hashPassword(password),
        role: 'user',
        enabled: true,
      });

      res.json({ data: true });
    });

    this.app.router.get('/auth/me', async (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      try {
        const decoded = jsonwebtoken.verify(token, env.JWT_SECRET) as {
          id: string;
        };
        const user = await model.findByPk(decoded.id);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        req.body = { data: user };
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    });
  }
}
