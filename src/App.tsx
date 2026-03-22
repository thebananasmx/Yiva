/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Canvas from './components/Canvas';
import { Settings, Layers, Box } from 'lucide-react';

export default function App() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-white/5 flex flex-col z-10">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">InfluencerOS</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Canvas Studio</p>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">Nodos Disponibles</h2>
            <div className="space-y-2">
              <div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 transition-colors"
                onDragStart={(event) => onDragStart(event, 'identity')}
                draggable
              >
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-sm font-medium">Identidad</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 transition-colors"
                onDragStart={(event) => onDragStart(event, 'scenario')}
                draggable
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">Escenario</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 transition-colors"
                onDragStart={(event) => onDragStart(event, 'generator')}
                draggable
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Generador IA</span>
              </div>
              <div 
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 transition-colors"
                onDragStart={(event) => onDragStart(event, 'post')}
                draggable
              >
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-sm font-medium">Post Instagram</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Settings className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Configuración API</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                La API Key de Gemini se inyecta automáticamente desde el panel de Secrets de AI Studio.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 relative">
        <Canvas />
      </main>
    </div>
  );
}

