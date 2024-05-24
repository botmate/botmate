import executor from './executor';
import { BuildPluginExecutorSchema } from './schema';

const options: BuildPluginExecutorSchema = {};

describe('BuildPlugin Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
