const _events = ['message', 'photo', 'document'] as const;

export type WorkflowEvent = (typeof _events)[number];

export type WorkflowEventMethod = {
  [key in WorkflowEvent]: {
    title: string;
    description: string;
    applyTo?: string[];
  };
};

export const events: Readonly<WorkflowEventMethod> = {
  message: {
    title: 'Message',
    description: 'A message was sent to the bot',
  },
  photo: {
    title: 'Photo',
    description: 'A photo was sent to the bot',
  },
  document: {
    title: 'Document',
    description: 'A document was sent to the bot',
  },
};
