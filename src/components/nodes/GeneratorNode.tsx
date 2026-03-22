import { Handle, Position } from '@xyflow/react';
import { Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function GeneratorNode({ data }: { data: any }) {
  return (
    <div className="w-96 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600/20 to-transparent p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Nodo Generador (IA)</h3>
            <p className="text-xs text-white/50">Gemini 3.1 Flash Image</p>
          </div>
        </div>
        {data.loading && (
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        )}
      </div>
      
      <div className="p-4">
        <div className="w-full aspect-square bg-black/50 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center relative group">
          {data.image ? (
            <img src={data.image} alt="Generated" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : data.error ? (
            <div className="flex flex-col items-center gap-2 text-red-400 p-4 text-center">
              <AlertCircle className="w-8 h-8 opacity-50" />
              <p className="text-xs">{data.error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/20">
              <ImageIcon className="w-12 h-12" />
              <p className="text-xs font-medium uppercase tracking-widest">Esperando Input</p>
            </div>
          )}
          
          {data.loading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs text-blue-400 font-medium animate-pulse">Generando Imagen...</p>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-[#1a1a1a]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-[#1a1a1a]"
      />
    </div>
  );
}
