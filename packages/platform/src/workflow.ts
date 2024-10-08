type WorkflowInputBase = {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  multiline?: boolean;
};

type WorkflowSelectInput = WorkflowInputBase & {
  type: 'select';
  options: string[];
};

type WorkflowInput = WorkflowInputBase | WorkflowSelectInput;

export type WorkflowAction<ID = string> = {
  id: ID;
  label: string;
  description: string;
  applyTo?: string[];
  parameters: WorkflowInput[];
};

export type WorkflowEvent<ID = string> = {
  id: ID;
  label: string;
  description: string;
  applyTo?: string[];
};
