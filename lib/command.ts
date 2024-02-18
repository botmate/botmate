import { Condition } from '#types';
import { Prisma } from '@prisma/client';

export function parseCondition(condition: Prisma.JsonValue) {
  return condition as Condition;
}
