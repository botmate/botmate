type BaseInput = {
  id: string;
  type: 'text' | 'checkbox' | 'radio';
  label: string;
  placeholder: string;
  required?: boolean;
};

type RadioInput = BaseInput & {
  type: 'radio';
  options: string[];
};

export type FormInput = BaseInput | RadioInput;
