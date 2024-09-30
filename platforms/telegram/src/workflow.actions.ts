import { WorkflowAction } from '@botmate/platform';

const _actions = ['send_message', 'send_photo'] as const;

export type Action = typeof _actions[number];

export const actions: WorkflowAction<Action>[] = [
  {
    id: 'send_message',
    label: 'Send Message',
    description: 'Send a message to a chat or user',
    parameters: [
      {
        id: 'text',
        label: 'Text',
        description: 'The text of the message to send',
        type: 'string',
        multiline: true,
      },
      {
        id: 'chat_id',
        label: 'Chat ID',
        description: 'The ID of the chat to send the message to',
        type: 'string',
      },
    ],
  },
  {
    id: 'send_photo',
    label: 'Send Photo',
    description: 'Send a photo to a chat or user',
    parameters: [
      {
        id: 'photo',
        label: 'Photo',
        description: 'The photo to send',
        type: 'string',
      },
      {
        id: 'chat_id',
        label: 'Chat ID',
        description: 'The ID of the chat to send the photo to',
        type: 'string',
      },
    ],
  },
];
