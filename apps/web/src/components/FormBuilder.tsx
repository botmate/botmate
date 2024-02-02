import { Input } from '@nextui-org/react';
import { useMemo } from 'react';
import { FormInput } from '@botmate/shared';
import { useForm } from 'react-hook-form';

type FormBuilderProps = {
  form?: ReturnType<typeof useForm>;
  inputs: FormInput[];
};
function FormBuilder({ inputs, form }: FormBuilderProps) {
  const el = useMemo(() => {
    const final = [];

    for (const input of inputs) {
      switch (input.type) {
        case 'text': {
          final.push(
            <Input
              key={input.id}
              id={input.id}
              label={input.label}
              placeholder={input.placeholder}
              required={input.required}
              {...form?.register(input.id, { required: input.required })}
            />,
          );
          break;
        }
        default: {
          break;
        }
      }
    }

    return final;
  }, [form, inputs]);

  return <>{el}</>;
}

export { FormBuilder };
