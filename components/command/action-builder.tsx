'use client';

import { ActionListItem } from '#types';
import { Button } from '#ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '#ui/card';
import { Input } from '#ui/input';
import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  Panel,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ActionList from './action-list';
import { actionList } from './data';
import { DefaultNode, SelectedNode } from './flow/nodes';

function ActionBuilder() {
  // States
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      data: { label: 'INIT' },
      position: { x: 0, y: 0 },
      draggable: false,
      type: 'init',
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Callbacks
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = { ...connection };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  // Functions
  function connectEdges(source: string, target: string) {
    const edge: Edge = {
      id: `${source}-${target}`,
      source: source,
      target: target,
    };

    setEdges((prevEdges) => [...prevEdges, edge]);
  }

  function addAction(actionItem: ActionListItem) {
    const id = (nodes.length + 1).toString();

    const lastNode = nodes[nodes.length - 1];
    const newNode: Node = {
      id: id,
      data: {
        label: actionItem.name,
        method: actionItem.id,
      },
      position: { x: lastNode.position.x, y: lastNode.position.y + 70 },
      type: 'selected',
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    connectEdges(lastNode.id, id);
  }

  // Handles when a node is clicked
  function handleNodeClick(event: React.MouseEvent, node: Node) {
    const action = actionList.find((a) => a.id === node.data.method);
    if (!action) {
      setSelectedNode(null);
      setNodes((prevNodes) =>
        prevNodes.map((n) => ({ ...n, type: 'default' })),
      );
      return;
    }

    setSelectedNode(node);
  }

  // Memos
  const nodeTypes = useMemo(
    () => ({ inactive: DefaultNode, active: SelectedNode }),
    [],
  );

  const selectedNodeAction = useMemo(() => {
    if (!selectedNode) return null;
    return actionList.find((a) => a.id === selectedNode.data.method);
  }, [selectedNode]);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          duration: 0.5,
        }}
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="space-y-4">
          <Card className="w-80">
            <CardHeader className="flex-row items-center justify-between">
              <h3 className="font-semibold">Actions</h3>
              {/* <Input placeholder="Search" className="w-36" /> */}
            </CardHeader>
            <CardContent>
              <ActionList
                onSelect={(actionItem) => {
                  addAction(actionItem);
                }}
              />
            </CardContent>
          </Card>

          {selectedNodeAction && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">{selectedNodeAction.name}</h3>
                <p className="text-sm">{selectedNodeAction.description}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedNodeAction.inputs?.map((input, index) => (
                  <Input key={index} placeholder={input.placeholder} />
                ))}
              </CardContent>
              <CardFooter>
                <Button>Save</Button>
              </CardFooter>
            </Card>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default ActionBuilder;
