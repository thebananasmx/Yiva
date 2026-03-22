import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { generateImage, generateCaption } from './services/gemini';

export type AppNode = Node;

export type AppState = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: AppNode) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  executeWorkflow: () => Promise<void>;
  isExecuting: boolean;
};

const initialNodes: AppNode[] = [
  {
    id: 'identity-1',
    type: 'identity',
    position: { x: 100, y: 100 },
    data: { prompt: 'A 25-year-old woman with short pink hair, wearing a leather jacket and sunglasses.' },
  },
  {
    id: 'scenario-1',
    type: 'scenario',
    position: { x: 100, y: 300 },
    data: { prompt: 'Sitting at a cozy Parisian cafe, drinking coffee, sunny morning.' },
  },
  {
    id: 'generator-1',
    type: 'generator',
    position: { x: 500, y: 200 },
    data: { image: null, loading: false },
  },
  {
    id: 'post-1',
    type: 'post',
    position: { x: 900, y: 200 },
    data: { caption: '', loading: false },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-id-gen', source: 'identity-1', target: 'generator-1', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-sc-gen', source: 'scenario-1', target: 'generator-1', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-gen-post', source: 'generator-1', target: 'post-1', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
];

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  isExecuting: false,
  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, get().edges),
    });
  },
  setNodes: (nodes: AppNode[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  addNode: (node: AppNode) => {
    set({ nodes: [...get().nodes, node] });
  },
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
  executeWorkflow: async () => {
    const state = get();
    set({ isExecuting: true });

    try {
      const generators = state.nodes.filter(n => n.type === 'generator');

      for (const generator of generators) {
        // Find connected identity and scenario nodes
        const connectedEdges = state.edges.filter(e => e.target === generator.id);
        const sourceNodes = connectedEdges.map(e => state.nodes.find(n => n.id === e.source)).filter(Boolean) as AppNode[];

        const identityNode = sourceNodes.find(n => n.type === 'identity');
        const scenarioNode = sourceNodes.find(n => n.type === 'scenario');

        if (!identityNode || !scenarioNode) {
          state.updateNodeData(generator.id, { error: "Falta conectar Identidad o Escenario." });
          continue;
        }

        const identityPrompt = identityNode.data.prompt as string;
        const scenarioPrompt = scenarioNode.data.prompt as string;

        if (!identityPrompt || !scenarioPrompt) {
          state.updateNodeData(generator.id, { error: "Los prompts no pueden estar vacíos." });
          continue;
        }

        // 1. Generate Image
        state.updateNodeData(generator.id, { loading: true, image: null, error: null });
        
        let imageBase64;
        try {
          imageBase64 = await generateImage(identityPrompt, scenarioPrompt);
          state.updateNodeData(generator.id, { loading: false, image: imageBase64 });
        } catch (e: any) {
          state.updateNodeData(generator.id, { loading: false, error: e.message });
          continue; // Skip post generation if image generation fails
        }

        // 2. Find connected post nodes and generate captions
        const postEdges = state.edges.filter(e => e.source === generator.id);
        const postNodes = postEdges.map(e => state.nodes.find(n => n.id === e.target && n.type === 'post')).filter(Boolean) as AppNode[];

        for (const postNode of postNodes) {
          state.updateNodeData(postNode.id, { loading: true, caption: '', error: null });
          try {
            const caption = await generateCaption(identityPrompt, scenarioPrompt, imageBase64);
            state.updateNodeData(postNode.id, { loading: false, caption });
          } catch (e: any) {
            state.updateNodeData(postNode.id, { loading: false, error: e.message });
          }
        }
      }
    } catch (error) {
      console.error("Workflow execution failed:", error);
    } finally {
      set({ isExecuting: false });
    }
  },
}));
