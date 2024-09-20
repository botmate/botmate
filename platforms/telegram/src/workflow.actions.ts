import { WorkflowAction } from '@botmate/platform';

const _actions = ['send_message', 'send_photo', 'send_document'] as const;

type Action = (typeof _actions)[number];

export const actions: Record<Action, WorkflowAction> = {
  send_message: {
    name: 'Send Message',
    description: 'Send a message to a chat or user',
    parameters: {
      chat_id: {
        title: 'Chat ID',
        description: 'The ID of the chat to send the message to',
        type: 'string',
        required: true,
      },
      text: {
        title: 'Text',
        description: 'The text of the message to send',
        type: 'string',
        required: true,
      },
    },
  },
  send_photo: {
    name: 'Send Photo',
    description: 'Send a photo to a chat or user',
    parameters: {
      chat_id: {
        title: 'Chat ID',
        description: 'The ID of the chat to send the photo to',
        type: 'string',
        required: true,
      },
      photo: {
        title: 'Photo',
        description: 'The photo to send',
        type: 'object',
        required: true,
        caption: 'The caption of the photo',
      },
    },
  },
  send_document: {
    name: 'Send Document',
    description: 'Send a document to a chat or user',
    parameters: {
      chat_id: {
        title: 'Chat ID',
        description: 'The ID of the chat to send the document to',
        type: 'string',
        required: true,
      },
      document: {
        title: 'Document',
        description: 'The document to send',
        type: 'object',
        required: true,
        caption: 'The caption of the document',
      },
    },
  },
};
