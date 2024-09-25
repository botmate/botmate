import { WorkflowAction } from '@botmate/platform';

const _actions = ['send_message', 'send_photo'] as const;

type Action = (typeof _actions)[number];

export const actions: Record<Action, WorkflowAction> = {
  send_message: {
    id: 'send_message',
    label: 'Send Message',
    description: 'Send a message to a chat or user',
    parameters: [
      {
        id: 'chat_id',
        label: 'Chat ID',
        description: 'The ID of the chat to send the message to',
        type: 'string',
      },
      {
        id: 'text',
        label: 'Text',
        description: 'The text of the message to send',
        type: 'string',
      },
    ],
  },
  send_photo: {
    id: 'send_photo',
    label: 'Send Photo',
    description: 'Send a photo to a chat or user',
    parameters: [
      {
        id: 'chat_id',
        label: 'Chat ID',
        description: 'The ID of the chat to send the photo to',
        type: 'string',
      },
      {
        id: 'photo',
        label: 'Photo',
        description: 'The photo to send',
        type: 'string',
      },
    ],
  },
};
