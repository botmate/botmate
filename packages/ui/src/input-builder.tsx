import {
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '.';

type BaseInput = {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'radio';
  label: string;
  placeholder?: string;
};
type StringInput = BaseInput & {
  type: 'string';
  note?: string;
};
type NumberInput = BaseInput & {
  type: 'number';
  note?: string;
};
type BooleanInput = BaseInput & {
  type: 'boolean';
};
type SelectOption = {
  label: string;
  value: string;
};
type SelectInput = BaseInput & {
  type: 'select';
  options: SelectOption[];
};
type RadioInput = BaseInput & {
  type: 'radio';
  options: SelectOption[];
  defaultValue?: string;
};
type Input =
  | StringInput
  | NumberInput
  | BooleanInput
  | SelectInput
  | RadioInput;

export class InputBuilder {
  inputs: Input[] = [];

  addString(key: string, input: Omit<StringInput, 'key' | 'type'>) {
    this.inputs.push({ ...input, key, type: 'string' });
    return this;
  }

  addNumber(key: string, input: Omit<NumberInput, 'key' | 'type'>) {
    this.inputs.push({ ...input, key, type: 'number' });
    return this;
  }

  addBoolean(key: string, input: Omit<BooleanInput, 'key' | 'type'>) {
    this.inputs.push({ ...input, key, type: 'boolean' });
    return this;
  }

  addSelect(key: string, input: Omit<SelectInput, 'key' | 'type'>) {
    this.inputs.push({ ...input, key, type: 'select' });
    return this;
  }

  addRadio(key: string, input: Omit<RadioInput, 'key' | 'type'>) {
    this.inputs.push({ ...input, key, type: 'radio' });
    return this;
  }

  build() {
    return this.inputs.map((input) => {
      switch (input.type) {
        case 'string':
          return (
            <div className="grid w-full items-center gap-1.5" key={input.key}>
              <Label htmlFor={input.key}>{input.label}</Label>
              <Input
                key={input.key}
                type="text"
                placeholder={input.placeholder}
              />
            </div>
          );
        case 'number':
          return (
            <div className="grid w-full items-center gap-1.5" key={input.key}>
              <Label htmlFor={input.key}>{input.label}</Label>
              <Input
                type="number"
                key={input.key}
                placeholder={input.placeholder}
              />
            </div>
          );
        case 'boolean':
          return (
            <div className="flex items-center space-x-2" key={input.key}>
              <Checkbox id={input.key} />
              <label
                htmlFor={input.key}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {input.label}
              </label>
            </div>
          );
        case 'select':
          return (
            <Select key={input.key}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={input.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {input.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        case 'radio':
          return (
            <RadioGroup
              defaultValue={input.defaultValue}
              className="flex"
              key={input.key}
            >
              <Label className="flex-1">{input.label}</Label>
              <div className="flex items-center gap-3">
                {input.options.map((option) => (
                  <div className="flex items-center gap-1.5" key={option.value}>
                    <RadioGroupItem value={option.value} id={option.label} />
                    <Label htmlFor={option.label}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          );
      }
    });
  }

  static create() {
    return new InputBuilder();
  }
}
