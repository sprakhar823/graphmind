import React, { useState } from 'react';
import GraphView from './components/GraphView';
import ChatInterface from './components/ChatInterface';
import { Node } from './data/mockData';
import { Layout, Database, Info, X } from 'lucide-react';

export default function App() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };

  const clearSelection = () => {
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Database size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">GraphMind</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Intelligent Business Explorer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Dataset Connected
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-64px)] p-6 flex gap-6 overflow-hidden">
        {/* Graph Section */}
        <div className="flex-1 min-w-0 relative group overflow-hidden">
          <GraphView 
            onNodeClick={handleNodeClick} 
            highlightedNodes={highlightedNodes} 
          />
          
          {/* Node Details Overlay */}
          {selectedNode && (
            <div className="absolute top-4 right-4 w-72 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-top-4 duration-300 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase">
                    {selectedNode.type}
                  </div>
                </div>
                <button 
                  onClick={clearSelection}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{selectedNode.label}</h3>
              
              <div className="space-y-3">
                {Object.entries(selectedNode.metadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{key}</span>
                    <span className="text-sm text-slate-200 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                <Info size={14} />
                <span>Click background to clear</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="w-[400px] h-full shrink-0">
          <ChatInterface onHighlightNodes={setHighlightedNodes} />
        </div>
      </main>
    </div>
  );
}
