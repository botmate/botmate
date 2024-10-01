import { WorkflowAction } from '@botmate/platform';

const _actions = [
  'send_message',
  'send_photo',
  'delete_message',
  'wait_for_message',
  'match_text',
  'validate_message',
] as const;

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
        type: 'text',
        multiline: true,
      },
      {
        id: 'chat_id',
        label: 'Chat ID',
        description: 'The ID of the chat to send the message to',
        type: 'text',
      },
    ],
    preview: `Send "{text}"`,
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
        type: 'text',
      },
      {
        id: 'chat_id',
        label: 'Chat ID',
        description: 'The ID of the chat to send the photo to',
        type: 'text',
      },
    ],
  },
  {
    id: 'delete_message',
    label: 'Delete Message',
    description: 'Delete the sent message',
    parameters: [],
  },
  {
    id: 'wait_for_message',
    label: 'Wait for Message',
    description: 'Wait for a message to be sent to the bot',
    parameters: [
      {
        id: 'timeout',
        label: 'Timeout',
        description: 'The time to wait for a message',
        type: 'text',
      },
    ],
  },
  {
    id: 'match_text',
    label: 'Match Text',
    description: 'Match the text sent to the bot',
    boolean: true,
    parameters: [
      {
        id: 'text',
        label: 'Text',
        description: 'The text to match',
        type: 'text',
      },
      {
        id: 'mode',
        label: 'Mode',
        description: 'The mode to validate the text',
        type: 'select',
        options: ['contains', 'equals', 'regex'],
      },
    ],
    preview: `Message {mode} "{text}"`,
  },
];
