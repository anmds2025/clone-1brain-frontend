import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { label: 'Extract' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 300, y: 100 },
    data: { label: 'Transform' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 500, y: 100 },
    data: { label: 'Load' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function WorkflowsPage() {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{t('workflows.title')}</h2>
        <Button onClick={handleReset}>{t('workflows.reset')}</Button>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
