import { useMemo } from 'react';
import { useDrag } from 'react-dnd';

import type { WorkflowAction } from '@botmate/platform';

import { useWorkflowActions } from './workflow';

const baseActions: WorkflowAction[] = [
  {
    id: 'condition',
    label: 'Condition',
    description: 'Add a condition to the workflow',
    parameters: [
      {
        id: 'expression',
        label: 'Expression',
        type: 'string',
        description: 'The expression to evaluate',
      },
    ],
  },
];

function WorkflowActions() {
  const _actions = useWorkflowActions();

  const actions = useMemo(() => {
    return [...baseActions, ..._actions];
  }, [_actions]);

  return (
    <div className="space-y-4">
      {actions.map((action) => {
        return <ActionCard key={action.id} action={action} />;
      })}
    </div>
  );
}

type ActionCardProps = {
  action: WorkflowAction;
};
function ActionCard({ action }: ActionCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ACTION',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      className="p-4 bg-muted/50 rounded-xl"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <h3 className="font-medium text-sm">{action.label}</h3>
      <p className="text-muted-foreground text-sm">{action.description}</p>
    </div>
  );
}

export default WorkflowActions;
