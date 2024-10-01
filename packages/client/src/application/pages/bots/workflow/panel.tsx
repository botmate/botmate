import { useState } from 'react';
import { useDrag } from 'react-dnd';

import { WorkflowAction, WorkflowEvent } from '@botmate/platform';

import {
  useWorkflowActions,
  useWorkflowEvents,
} from '../../../hooks/workflows';

const tabs = ['Events', 'Actions'] as const;

function WorkflowPanel() {
  const workflowEvents = useWorkflowEvents();
  const workflowActions = useWorkflowActions();

  const [tab, setTab] = useState<typeof tabs[number]>(tabs[0]);

  return (
    <div className="w-80 bg-card rounded-xl border">
      <div className="border-b border-muted">
        <nav className="flex gap-4 px-4" aria-label="Tabs">
          {tabs.map((_tab) => (
            <button
              key={_tab}
              onClick={() => setTab(_tab)}
              className={`px-1 h-16 text-sm font-medium transition-all
            ${
              _tab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-muted-foreground/70 border-b-2 border-transparent'
            }`}
            >
              {_tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 overflow-auto max-h-[500px]">
        {tab === 'Events' ? (
          <ul className="flex flex-col">
            <p className="text-muted-foreground text-xs pb-4 pt-2">
              Drag and drop events to create a workflow
            </p>
            {workflowEvents.map((event) => (
              <WorkflowEventItem key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col">
            <p className="text-muted-foreground text-xs pb-4 pt-2">
              Drag and drop actions to create a workflow
            </p>
            {workflowActions.map((action) => (
              <WorkflowActionItem key={action.id} action={action} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WorkflowPanel;

function WorkflowEventItem({ event }: { event: WorkflowEvent }) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'WORKFLOW_ITEM',
    item: { type: 'event', event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <li
      key={event.id}
      ref={dragPreview}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div role="Handle" ref={drag} className="p-4 hover:bg-muted/30">
        <h1 className="text-sm"> {event.label}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {/* {event.description} */}
        </p>
      </div>
    </li>
  );
}

function WorkflowActionItem({ action }: { action: WorkflowAction }) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'WORKFLOW_ITEM',
    item: { type: action.boolean ? 'condition' : 'action', action },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  return (
    <li
      key={action.id}
      ref={dragPreview}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div ref={drag} className="p-4 hover:bg-muted/30">
        <h1 className="text-sm"> {action.label}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {/* {action.description} */}
        </p>
      </div>
    </li>
  );
}
