import { coreDatabase } from './core-database';

describe('coreDatabase', () => {
  it('should work', () => {
    expect(coreDatabase()).toEqual('core-database');
  });
});
