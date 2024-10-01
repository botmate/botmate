import {
  WorkflowAction,
  WorkflowEvent,
  WorkflowInput,
} from '@botmate/platform';
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

type WorkflowEditorProps = {
  id: string;
  event?: WorkflowEvent;
  action?: WorkflowAction;

  values: Record<string, string>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

function WorkflowEditor({
  id,
  event,
  action,
  values,
  setValues,
}: WorkflowEditorProps) {
  const inputs = (
    event ? event.parameters : action ? action.parameters : []
  ) as WorkflowInput[];

  const getId = (key: string) => `${id}_${key}`;

  return (
    <div className="w-80 bg-card rounded-xl border">
      <div className="border-b border-muted">
        <nav className="flex gap-4 px-4" aria-label="Tabs">
          <button
            className={`px-1 h-16 text-sm font-medium transition-all border-b-2 border-transparent`}
          >
            {event ? event.label : action ? action.label : ''}
          </button>
        </nav>
      </div>
      <div className="p-4 overflow-auto max-h-[500px]">
        {inputs.map((input) => {
          return (
            <div key={input.id} className="mb-4">
              <Label htmlFor={input.id} className="block text-sm font-medium">
                {input.label}
              </Label>
              {input.type === 'text' ? (
                input.multiline ? (
                  <Textarea
                    id={getId(input.id)}
                    name={input.id}
                    value={values[getId(input.id)]}
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        [getId(input.id)]: e.target.value,
                      }));
                    }}
                    rows={4}
                    className="w-full mt-1 border rounded-md"
                  />
                ) : (
                  <Input
                    id={getId(input.id)}
                    name={input.id}
                    type="text"
                    value={values[getId(input.id)]}
                    onChange={(e) => {
                      setValues((prev) => ({
                        ...prev,
                        [getId(input.id)]: e.target.value,
                      }));
                    }}
                    className="w-full mt-1 border rounded-md"
                  />
                )
              ) : input.type === 'select' ? (
                <Select
                  value={values[getId(input.id)]}
                  onValueChange={(val) => {
                    setValues((prev) => ({
                      ...prev,
                      [getId(input.id)]: val,
                    }));
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
  );
}

export default WorkflowEditor;
