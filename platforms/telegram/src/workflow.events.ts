import { WorkflowEvent } from '@botmate/platform';

const _events = [
  'message',
  'photo',
  'document',
  'new_user',
  'command',
] as const;

export type Event = typeof _events[number];

export const events: WorkflowEvent<Event>[] = [
  {
    id: 'message',
    label: 'Message',
    description: 'A message is receieved by the bot',
  },
  {
    id: 'photo',
    label: 'Photo',
    description: 'An image in receieved by the bot',
  },
  {
    id: 'document',
    label: 'Document',
    description: 'File is receieved by the bot',
  },
  {
    id: 'new_user',
    label: 'New Member',
    description: 'When someone joins the chat',
  },
  {
    id: 'command',
    label: 'Command',
    description: 'When a command is sent to the bot',
  },
];
