import { ActionListItem } from '#types';
import { HiDocumentText, HiFire, HiPhotograph } from 'react-icons/hi';

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

export const actionList: ActionListItem[] = [
  {
    id: 'sendMessage',
    name: 'Send Message',
    description: 'Send a message in chat',
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
    description: 'Send a sticker in the chat',
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
  {
    id: 'sendPhoto',
    name: 'Send Photo',
    icon: HiPhotograph,
    description: 'Send a image in the chat',
    inputs: [
      {
        id: 'imageURL',
        type: 'text',
        label: 'Image URL',
        placeholder: 'Enter image URL',
      },
      {
        id: 'imageID',
        type: 'text',
        label: 'Image ID',
        placeholder: 'Enter Telegram Image ID',
      },
    ],
  },
];
