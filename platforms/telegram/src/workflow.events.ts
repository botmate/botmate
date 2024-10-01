import { WorkflowEvent } from '@botmate/platform';

const _events = ['text', 'photo', 'document', 'new_user', 'command'] as const;

export type Event = typeof _events[number];

export const events: WorkflowEvent<Event>[] = [
  {
    id: 'command',
    label: 'On Command',
    description: 'When a command is sent to the bot',
    parameters: [
      {
        id: 'command',
        label: 'Command',
        description: 'The command sent to the bot',
        type: 'text',
      },
    ],
    preview: `{command}`,
  },
  {
    id: 'text',
    label: 'On Text',
    description: 'A text message is received by the bot',
    parameters: [
      {
        id: 'text',
        label: 'Text',
        description: 'The text of the message',
        type: 'text',
      },
    ],
  },
  {
    id: 'photo',
    label: 'On Photo',
    description: 'An image in receieved by the bot',
    parameters: [],
  },
  {
    id: 'document',
    label: 'On Document',
    description: 'File is receieved by the bot',
    parameters: [],
  },
  {
    id: 'new_user',
    label: 'On New Member',
    description: 'When someone joins the chat',
    parameters: [],
  },
];
