import { WorkflowEvent } from '@botmate/platform';

const _events = [
  'message',
  'photo',
  'document',
  'new_user',
  'command',
] as const;

export type Event = (typeof _events)[number];

export const events: Record<Event, WorkflowEvent> = {
  message: {
    name: 'Message',
    description: 'A message is receieved by the bot',
  },
  photo: {
    name: 'Photo',
    description: 'An image in receieved by the bot',
  },
  document: {
    name: 'Document',
    description: 'File is receieved by the bot',
  },
  new_user: {
    name: 'New User',
    description: 'When someone joins the chat',
  },
  command: {
    name: 'Command',
    description: 'When a command is sent to the bot',
  },
};
