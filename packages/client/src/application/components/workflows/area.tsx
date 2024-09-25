import { useState } from 'react';
import { useDrop } from 'react-dnd';

import { WorkflowAction } from '@botmate/platform';

function WorkflowArea() {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'ACTION',
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [actions, setActions] = useState<WorkflowAction[]>([]);

  return (
    <div className="flex flex-col p-4 h-full overflow-auto">
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
