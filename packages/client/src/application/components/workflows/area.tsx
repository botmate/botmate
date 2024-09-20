import { Background, Controls, Panel, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useMemo } from 'react';

import type { WorkflowAction } from '@botmate/platform';
import { Card, CardContent, CardHeader, CardTitle } from '@botmate/ui';

import {
  useGetWfActionsQuery,
  useGetWfEventsQuery,
} from '../../services/workflows';

// todo: refactor
function WorkflowArea() {
  const _events = useGetWfEventsQuery('telegram');
  const _actions = useGetWfActionsQuery('telegram');

  const events = useMemo(() => _events.data || {}, [_events]);
  const actions = useMemo(() => _actions.data || {}, [_actions]);

  const [selectedAction, setSelectedAction] =
    React.useState<null | WorkflowAction>(null);

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow colorMode="dark" fitView>
        <Background />
        <Controls />
        <Panel position="top-right">
          <Card className="w-72">
            <CardHeader>
              <CardTitle className="text-md">
                {!selectedAction ? 'Select an action' : selectedAction.name}
              </CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default WorkflowArea;
