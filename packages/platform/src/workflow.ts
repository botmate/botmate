type WorkflowInputBase = {
  id: string;
  label: string;
  type: 'text' | 'select';
  description: string;
};

type WorkflowTextInput = WorkflowInputBase & {
  type: 'text';
  multiline?: boolean;
};

type WorkflowSelectInput = WorkflowInputBase & {
  type: 'select';
  options: string[];
};

export type WorkflowInput = WorkflowTextInput | WorkflowSelectInput;

export type WorkflowAction<ID = string> = {
  id: ID;
  label: string;
  description: string;
  applyTo?: string[];
  boolean?: boolean;
  parameters: WorkflowInput[];
  preview?: string;
};

export type WorkflowEvent<ID = string> = {
  id: ID;
  label: string;
  description: string;
  applyTo?: string[];
  parameters: WorkflowInput[];
  preview?: string;
};
