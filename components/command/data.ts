import { HiDocumentText, HiFire } from 'react-icons/hi';

export const ConditionList = [
  {
    id: 'text',
    name: 'Text',
    description: 'Compare the text of the message',
    inputs: [
      {
        id: 'text',
        type: 'text',
        label: 'Text',
        placeholder: 'Enter text',
      },
    ],
  },
  {
    id: 'sticker',
    name: 'Sticker',
    description: 'Check if the message is a sticker',
    inputs: [
      {
        id: 'stickerId',
        type: 'text',
        label: 'Sticker ID',
        placeholder: 'Enter sticker ID (optional)',
      },
    ],
  },
];

export const ActionList = [
  {
    id: 'sendMessage',
    name: 'Send Message',
    description: 'Send a message to the user',
    displayFields: ['message'],
    icon: HiDocumentText,
    inputs: [
      {
        id: 'message',
        type: 'text',
        label: 'Message',
        placeholder: 'Enter message',
      },
    ],
  },
  {
    id: 'sendSticker',
    name: 'Send Sticker',
    icon: HiFire,
    description: 'Send a sticker to the user',
    displayFields: ['stickerId'],
    inputs: [
      {
        id: 'stickerId',
        type: 'text',
        label: 'Sticker ID',
        placeholder: 'Enter sticker ID',
      },
    ],
  },
];
