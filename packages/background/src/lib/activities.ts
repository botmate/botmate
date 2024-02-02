import { proxyActivities } from '@temporalio/workflow';
import type * as allActivities from '../activities';

export const activity = proxyActivities<typeof allActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 1,
  },
});
