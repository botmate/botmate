'use client';

import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

function ActionBuilder() {
  return (
    <div className="h-full">
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default ActionBuilder;
