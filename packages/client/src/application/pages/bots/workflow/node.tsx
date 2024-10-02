import { Handle, NodeProps, Position } from '@xyflow/react';

import { WorkflowInput } from '@botmate/platform';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@botmate/ui';

import {
  useWorkflowActions,
  useWorkflowEvents,
} from '../../../hooks/workflows';

type BaseNodeProps = NodeProps & {
  data: Record<string, any>;
  type: 'action' | 'condition' | 'event';
  values: Record<string, string>;
  onValuesChange: (key: string, value: string) => void;
};

const NO_PREVIEW = 'No preview';

function BaseNode({
  id,
  data,
  type,
  values = {},
  onValuesChange,
}: BaseNodeProps) {
  const events = useWorkflowEvents();
  const actions = useWorkflowActions();

  const event = events.find((e) => e.id === data.event);
  const action = actions.find((a) => a.id === data.action);

  const inputs = ((data.event ? event?.parameters : action?.parameters) ??
    []) as WorkflowInput[];

  const getId = (key: string) => `${id}.${key}`;

  return (
    <>
      <div className="dark:bg-neutral-900 bg-white border border-neutral-700 rounded-md min-w-[250px]">
        <div className="px-2 py-3 border-b border-muted-foreground font-medium">
          <p className="text-sm">{data.label}</p>
        </div>

        <div className="px-2 py-4">
          {inputs.map((input) => {
            return (
              <div key={input.id} className="mb-4">
                <Label htmlFor={input.id} className="block text-xs">
                  {input.label}
                </Label>
                {input.type === 'text' ? (
                  input.multiline ? (
                    <Textarea
                      id={getId(input.id)}
                      name={input.id}
                      defaultValue={values[getId(input.id)]}
                      onChange={(e) => {
                        onValuesChange(getId(input.id), e.target.value);
                      }}
                      rows={4}
                      className="w-full mt-1 border rounded-md no-drag"
                    />
                  ) : (
                    <Input
                      id={getId(input.id)}
                      name={input.id}
                      type="text"
                      defaultValue={values[getId(input.id)]}
                      onChange={(e) => {
                        onValuesChange(getId(input.id), e.target.value);
                      }}
                      className="w-full mt-1 border rounded-md no-drag"
                    />
                  )
                ) : input.type === 'select' ? (
                  <Select
                    defaultValue={values[getId(input.id)]}
                    onValueChange={(val) => {
                      onValuesChange(getId(input.id), val);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {input.options.map((option) => (
                          <SelectItem value={option}>
                            <SelectLabel className="font-normal">
                              {option}
                            </SelectLabel>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {input.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {type === 'event' ? (
        <>
          <Handle position={Position.Bottom} type="target" />
        </>
      ) : type === 'action' ? (
        <>
          <Handle position={Position.Top} type="source" />
          <Handle position={Position.Bottom} type="target" />
        </>
      ) : type === 'condition' ? (
        <>
          <Handle position={Position.Top} type="source" />
          <Handle
            position={Position.Right}
            type="target"
            id="true"
            style={{
              backgroundColor: 'green',
            }}
          />
          <Handle
            position={Position.Left}
            type="target"
            id="false"
            style={{
              backgroundColor: 'red',
            }}
          />
        </>
      ) : null}
    </>
  );
}

export default BaseNode;
