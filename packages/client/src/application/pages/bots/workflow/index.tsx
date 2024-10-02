import { TRPCClientError } from '@trpc/react-query';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSearchParams } from 'react-router-dom';

import { WorkflowAction, WorkflowEvent } from '@botmate/platform';
import type { IWorkflow } from '@botmate/server';
import { Button } from '@botmate/ui';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import SidebarItem from '../../../components/sidebar-item';
import useCurrentBot from '../../../hooks/bots';
import { useBotWorkflows } from '../../../hooks/workflows';
import { trpc } from '../../../trpc';
import BaseNode from './node';
import WorkflowPanel from './panel';

let id = 0;
const getId = () => `${id++}`;

type DnDItem =
  | { type: 'event'; event: WorkflowEvent }
  | { type: 'action' | 'condition'; action: WorkflowAction };

type Action = {
  nodeId: string;
  action: string;
  values: Record<string, string>;
};
type Event = {
  id: string;
  nodeId: string;
  values: Record<string, string>;
  actions: Action[];
};

type Props = {
  workflows: IWorkflow[];

  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialValues?: Record<string, string>;
};
function WorkflowPage({ workflows }: Props) {
  const bot = useCurrentBot();
  const { theme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const createWorkflow = trpc.createWorkflow.useMutation();

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
            event: event.id,
            parameters: event.parameters.map((p) => p.id),
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
            action: action.id,
            parameters: action.parameters.map((p) => p.id),
          },
        };
        setNodes((prev) => [...prev, newNode]);
      }
    },
  }));

  function addValue(key: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      event: (props) => (
        <BaseNode {...props} values={values} onValuesChange={addValue} />
      ),
      action: (props) => (
        <BaseNode {...props} values={values} onValuesChange={addValue} />
      ),
      condition: (props) => (
        <BaseNode {...props} values={values} onValuesChange={addValue} />
      ),
    }),
    [],
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="min-h-20 flex items-center justify-between px-4 border-b">
        <div>
          <h1 className="text-xl font-medium">Workflows</h1>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="w-72 h-full border-r p-2">
          <p className="text-muted-foreground text-xs mt-1">Your workflows</p>
          <div className="space-y-3 mt-2">
            {workflows.map((workflow) => (
              <SidebarItem
                key={workflow._id}
                title={workflow.name}
                onClick={() => {
                  // const rf = workflow.reactflow;
                  // setNodes(rf.nodes as Node[]);
                  // setEdges(rf.edges as Edge[]);
                  // (workflow.events as Event[]).forEach((event) => {
                  //   Object.entries(event.values).forEach(([key, value]) => {
                  //     addValue(`${event.nodeId}.${key}`, value);
                  //   });
                  //   event.actions.forEach((action) => {
                  //     Object.entries(action.values).forEach(([key, value]) => {
                  //       addValue(`${action.nodeId}.${key}`, value);
                  //     });
                  //   });
                  // });
                }}
              />
            ))}
          </div>
        </div>
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
            attributionPosition="bottom-left"
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
                <WorkflowPanel />
              </AnimatePresence>
            </Panel>
            <Panel position="bottom-right">
              <Button
                onClick={() => {
                  const obj = rfInstance?.toObject();

                  const nodeMap = new Map<string, Node>();
                  nodes.forEach((node) => nodeMap.set(node.id, node));

                  const data: Event[] = [];

                  const events = nodes.filter((n) => n.type === 'event');

                  for (const event of events) {
                    const actions: Action[] = [];
                    let currentNode = event;
                    while (currentNode) {
                      const source = edges.find(
                        (e) => e.target === currentNode.id,
                      );
                      if (!source) break;

                      const sourceNode = nodeMap.get(source.source);
                      if (!sourceNode) break;

                      if (sourceNode.type === 'action') {
                        const parameters = sourceNode.data
                          .parameters as string[];
                        const _values = parameters.reduce((prev, curr) => {
                          const value = values[`${sourceNode.id}.${curr}`];
                          return {
                            ...prev,
                            [curr]: value,
                          };
                        }, {});

                        actions.push({
                          nodeId: sourceNode.id,
                          action: sourceNode.data.action as string,
                          values: _values,
                        });
                      }

                      currentNode = sourceNode;
                    }

                    const _values = (event.data.parameters as string[]).reduce(
                      (prev, curr) => {
                        const value = values[`${event.id}.${curr}`];
                        return {
                          ...prev,
                          [curr]: value,
                        };
                      },
                      {},
                    );

                    data.push({
                      nodeId: event.id,
                      id: event.data.event as string,
                      values: _values,
                      actions,
                    });
                  }

                  createWorkflow
                    .mutateAsync({
                      botId: bot._id,
                      enabled: true,
                      name: Math.random().toString(36).substring(7),
                      reactflow: obj,
                      events: data,
                    })
                    .then(() => {
                      toast.success('Workflow created');
                    })
                    .catch((err: Error) => {
                      if (err instanceof TRPCClientError) {
                        toast.error(err.message);
                        return;
                      }
                      toast.error("Couldn't create workflow");
                    });
                }}
                isLoading={createWorkflow.isLoading}
              >
                Save
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

function Page() {
  const workflows = useBotWorkflows();

  if (workflows.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <WorkflowPage workflows={workflows.data} />
      </DndProvider>
    </ReactFlowProvider>
  );
}

export default Page;
