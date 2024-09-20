type BaseActionParameters = {
  title: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
};

export type WorkflowAction = {
  name: string;
  description: string;
  applyTo?: string[];
  parameters: {
    [key: string]: BaseActionParameters & Record<string, unknown>;
  };
};

export type WorkflowEvent = {
  name: string;
  description: string;
  applyTo?: string[];
};
