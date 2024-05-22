import { randomBytes, scryptSync } from 'crypto';

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, hashedPassword: string) {
  const [salt, hash] = hashedPassword.split(':');
  const hashBuffer = scryptSync(password, salt, 64);
  return hash === hashBuffer.toString('hex');
}
