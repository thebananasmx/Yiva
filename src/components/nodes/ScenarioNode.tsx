import { Handle, Position } from '@xyflow/react';
import { useStore } from '../../store';
import { MapPin } from 'lucide-react';

export default function ScenarioNode({ id, data }: { id: string, data: any }) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="w-80 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600/20 to-transparent p-4 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <MapPin className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">Nodo de Escenario</h3>
          <p className="text-xs text-white/50">Contexto de la Foto</p>
        </div>
      </div>
      
      <div className="p-4">
        <textarea
          className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          placeholder="Ej: En una cafetería en París, luz de la mañana, tomando un espresso..."
          value={data.prompt || ''}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-emerald-500 border-2 border-[#1a1a1a]"
      />
    </div>
  );
}
