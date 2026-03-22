import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../store';
import IdentityNode from './nodes/IdentityNode';
import ScenarioNode from './nodes/ScenarioNode';
import GeneratorNode from './nodes/GeneratorNode';
import PostNode from './nodes/PostNode';
import { Play } from 'lucide-react';

const nodeTypes = {
  identity: IdentityNode,
  scenario: ScenarioNode,
  generator: GeneratorNode,
  post: PostNode,
};

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, executeWorkflow, isExecuting, addNode } = useStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          prompt: type === 'identity' || type === 'scenario' ? '' : undefined,
          image: type === 'generator' ? null : undefined,
          caption: type === 'post' ? '' : undefined,
          loading: false,
          error: null
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode],
  );

  return (
    <div className="flex-1 h-full relative bg-[#0a0a0a]" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0a0a0a]"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={16} />
        <Controls className="bg-[#1a1a1a] border-[#333] fill-white" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'identity') return '#8b5cf6';
            if (n.type === 'scenario') return '#10b981';
            if (n.type === 'generator') return '#3b82f6';
            if (n.type === 'post') return '#ec4899';
            return '#fff';
          }}
          className="bg-[#1a1a1a] border-[#333]"
          maskColor="rgba(0, 0, 0, 0.7)"
        />
        
        <Panel position="top-right" className="m-4">
          <button
            onClick={executeWorkflow}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
            {isExecuting ? 'Generando...' : 'Ejecutar Workflow'}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
