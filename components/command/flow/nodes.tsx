import React from 'react';
import { NodeProps } from 'reactflow';

function DefaultNode({}: NodeProps) {
  return <div>DefaultNode</div>;
}

export { DefaultNode, SelectedNode };

function SelectedNode({}: NodeProps) {
  return <div>SelectedNode</div>;
}
