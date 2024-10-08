import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { UseFormReturn } from 'react-hook-form';

import { WorkflowAction } from '@botmate/platform';
import { Input, Label, Textarea } from '@botmate/ui';

import { useOutsideClick } from '../../hooks/utils';
import { useWorkflowActions } from '../../hooks/workflows';

type Props = {
  form: UseFormReturn;
  editMode?: boolean;
};
function WorkflowArea({ form, editMode }: Props) {
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const ref = useOutsideClick(() => {
    setEditingIndex(null);
  });

  useEffect(() => {
    if (!editMode) {
      setEditingIndex(null);
    }
  }, [editMode]);

  const actionList = useWorkflowActions();

  const steps = form.getValues('steps');
  const values = form.getValues('values');

  useEffect(() => {
    if (steps?.length > 0) {
      const _actions = steps.map((step: string, index: number) => {
        const action = actionList.find((a) => a.id === step);
        if (!action) return null;
        return action;
      });
      setActions(_actions.filter((a) => a !== null) as WorkflowAction[]);

      values?.forEach((value: Record<string, any>, index: number) => {
        Object.entries(value).forEach(([key, val]) => {
          form.setValue(`values.${index}.${key}`, val);
        });
      });
    } else {
      setActions([]);
    }
  }, [steps, values]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'ACTION',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item, monitor) {
      if (monitor.canDrop()) {
        // @ts-expect-error
        setActions((prev) => [...prev, item.action]);
      }
    },
  }));

  return (
    <div className="flex flex-col p-4 h-full overflow-auto gap-4">
      {actions.map(({ id }, index) => (
        <input value={id} {...form.register(`steps.${index}`)} type="hidden" />
      ))}
      {actions.length > 0 && (
        <div className="flex flex-col gap-2" ref={ref}>
          {actions.map((action, index) => {
            const inputs = action.parameters.map((parameter) => {
              return (
                <div key={index + parameter.id} className="space-y-1">
                  <Label>{parameter.label}</Label>
                  {parameter.multiline ? (
                    <Textarea
                      placeholder={parameter.description}
                      rows={6}
                      {...form.register(`values.${index}.${parameter.id}`)}
                      disabled={!editMode}
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder={parameter.description}
                      {...form.register(`values.${index}.${parameter.id}`)}
                      disabled={!editMode}
                    />
                  )}
                </div>
              );
            });
            return (
              <div key={`${action.id}-${index}`}>
                <div
                  key={`${action.id}-${index}`}
                  className={`p-4 bg-muted/50 border-2 rounded-xl relative group ${
                    editMode ? 'cursor-pointer' : ''
                  } ${
                    editingIndex === index
                      ? 'border-orange-400'
                      : 'border-transparent'
                  }`}
                  onClick={() => {
                    setEditingIndex(index);
                  }}
                >
                  <div className="absolute top-4 right-4">
                    <XIcon
                      size={14}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActions((prev) =>
                          prev.filter((_, i) => i !== index),
                        );

                        form.unregister([`steps.${index}`, `values.${index}`]);
                      }}
                    />
                  </div>

                  <h3 className="font-medium text-sm">{action.label}</h3>
                  <p className="text-muted-foreground text-sm">
                    {action.description}
                  </p>

                  <div
                    className={`mt-4 space-y-2 ${
                      editingIndex === index ? '' : 'hidden'
                    }`}
                  >
                    {inputs}
                  </div>
                </div>
                {index < actions.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <div className="h-10 w-0.5 bg-muted/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div
        ref={drop}
        className="h-40 flex justify-center items-center border-2 border-dashed border-muted rounded-xl"
      >
        {isOver && canDrop ? (
          <div className="text-muted-foreground">Drop here</div>
        ) : (
          <div className="text-muted-foreground">Drag actions here</div>
        )}
      </div>
    </div>
  );
}

export default WorkflowArea;
