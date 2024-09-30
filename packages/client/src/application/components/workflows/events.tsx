import { WorkflowEvent } from '@botmate/platform';

type Props = {
  event: WorkflowEvent;
};
function WorkflowEventEditor({ event }: Props) {
  return (
    <div className="space-y-4">
      {/* <div className="flex items-center text-muted-foreground/50">
        <InfoIcon size={16} className="mr-1" />
        <p className="text-sm">{event.description}</p>
      </div> */}
    </div>
  );
}

export default WorkflowEventEditor;
