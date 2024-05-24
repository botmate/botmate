import { type ExecutorContext, runExecutor } from '@nx/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

export interface BuildPluginOptions {
  outputPath: string;
}

export default async function echoExecutor(
  options: BuildPluginOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  for await (const s of await runExecutor(
    {
      project: context.projectName,
      target: 'build:server',
    },
    options,
    context,
  )) {
    if (!s.success) {
      return { success: false };
    }
  }
  return { success: true };
}
