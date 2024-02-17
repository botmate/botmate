export const telegram = () => ({
  conditionList: [
    {
      id: 'text',
      title: 'Text',
      description: 'Matches a text message',
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
      id: 'sticker',
      title: 'Sticker',
      description: 'Math with a sticker message',
      inputs: [
        {
          id: 'stickerId',
          type: 'text',
          label: 'Sticker ID',
          placeholder: 'Enter sticker ID (optional)',
        },
      ],
    },
  ],
  actionList: [
    {
      id: 'sendMessage',
      title: 'Send Message',
      description: 'Send a message to the user',
      displayFields: ['message'],
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
      title: 'Send Sticker',
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
  ],
});
