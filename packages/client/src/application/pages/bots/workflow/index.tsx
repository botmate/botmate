import {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useMemo, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { WorkflowAction, WorkflowEvent } from '@botmate/platform';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

import WorkflowEditor from './editor';
import BaseNode from './node';
import WorkflowPanel from './panel';

let id = 0;
const getId = () => `${id++}`;

type DnDItem =
  | { type: 'event'; event: WorkflowEvent }
  | { type: 'action' | 'condition'; action: WorkflowAction };

function WorkflowPage() {
  const { theme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [values, setValues] = useState<Record<string, string>>({});

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const [, drop] = useDrop(() => ({
    accept: 'WORKFLOW_ITEM',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item, monitor) {
      const offset = monitor.getClientOffset()!;

      const i = item as DnDItem;
      if (i.type === 'event') {
        const { event } = i;
        const position = screenToFlowPosition({
          x: offset.x,
          y: offset.y,
        });
        const newNode: Node = {
          id: getId(),
          type: 'event',
          position,
          data: {
            label: event.label,
            event,
          },
        };
        setNodes((prev) => [...prev, newNode]);
      } else if (i.type === 'action' || i.type === 'condition') {
        const { action } = i;
        const position = screenToFlowPosition({
          x: offset.x,
          y: offset.y,
        });
        const newNode: Node = {
          id: getId(),
          type: i.type,
          position,
          data: {
            label: action.label,
            action,
          },
        };
        setNodes((prev) => [...prev, newNode]);
      }
    },
  }));

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      event: (props) => <BaseNode {...props} values={values} />,
      action: (props) => <BaseNode {...props} values={values} />,
      condition: (props) => <BaseNode {...props} values={values} />,
    }),
    [values],
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="min-h-20 flex items-center justify-between px-4 border-b">
        <div>
          <h1 className="text-xl font-medium">Workflows</h1>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="w-72 h-full border-r">{/* SIDEBAR */}</div>
        <div className="flex-1">
          <ReactFlow
            draggable
            fitView
            ref={drop}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={(x) => {
              setRfInstance(x);
            }}
            colorMode={theme === 'dark' ? 'dark' : 'light'}
            onNodeClick={(_, node) => {
              setSelectedNode(node);
            }}
            onPaneClick={() => {
              setSelectedNode(null);
            }}
            nodeTypes={nodeTypes}
          >
            <Background />
            <Controls />
            <Panel position="top-right">
              <AnimatePresence>
                {!selectedNode ? (
                  <WorkflowPanel />
                ) : (
                  <WorkflowEditor
                    id={selectedNode.id}
                    event={selectedNode.data?.event as WorkflowEvent}
                    action={selectedNode.data?.action as WorkflowAction}
                    values={values}
                    setValues={setValues}
                  />
                )}
              </AnimatePresence>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

function Page() {
  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <WorkflowPage />
      </DndProvider>
    </ReactFlowProvider>
  );
}

export default Page;
