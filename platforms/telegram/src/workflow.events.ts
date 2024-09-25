import { WorkflowEvent } from '@botmate/platform';

const _events = ['message', 'photo', 'document'] as const;

export type Event = (typeof _events)[number];

export const events: Record<Event, WorkflowEvent> = {
  message: {
    name: 'Message',
    description: 'A message was sent to the bot',
  },
  photo: {
    name: 'Photo',
    description: 'A photo was sent to the bot',
  },
  document: {
    name: 'Document',
    description: 'A document was sent to the bot',
  },
};
