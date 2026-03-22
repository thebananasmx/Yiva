import { Handle, Position } from '@xyflow/react';
import { Instagram, AlertCircle } from 'lucide-react';

export default function PostNode({ data }: { data: any }) {
  return (
    <div className="w-80 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-pink-600/20 to-transparent p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <Instagram className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Nodo de Post</h3>
            <p className="text-xs text-white/50">Caption para Instagram</p>
          </div>
        </div>
        {data.loading && (
          <div className="w-4 h-4 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
        )}
      </div>
      
      <div className="p-4 relative">
        <div className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 overflow-y-auto text-sm text-white/80 leading-relaxed">
          {data.caption ? (
            <p className="whitespace-pre-wrap">{data.caption}</p>
          ) : data.error ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-red-400 text-center">
              <AlertCircle className="w-6 h-6 opacity-50" />
              <p className="text-xs">{data.error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-white/20">
              <p className="text-xs font-medium uppercase tracking-widest text-center">Esperando Imagen</p>
            </div>
          )}
        </div>

        {data.loading && (
          <div className="absolute inset-4 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-xs text-pink-400 font-medium animate-pulse">Escribiendo Caption...</p>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-pink-500 border-2 border-[#1a1a1a]"
      />
    </div>
  );
}
