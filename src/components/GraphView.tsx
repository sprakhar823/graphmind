import React, { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { mockNodes, mockEdges, Node, Edge } from '../data/mockData';
import * as d3 from 'd3-force';

interface GraphViewProps {
  onNodeClick: (node: Node) => void;
  highlightedNodes?: string[];
}

const GraphView: React.FC<GraphViewProps> = ({ onNodeClick, highlightedNodes = [] }) => {
  const fgRef = useRef<any>(null);
  const [graphData, setGraphData] = useState({ nodes: mockNodes, links: mockEdges });

  useEffect(() => {
    // Adjust forces for larger dataset
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-80);
      fgRef.current.d3Force('link').distance(60);
    }
  }, []);

  const getNodeColor = (node: any) => {
    if (highlightedNodes.includes(node.id)) return '#ef4444'; // Red for highlighted
    switch (node.type) {
      case 'Customer': return '#3b82f6'; // Blue
      case 'SalesOrder': return '#10b981'; // Green
      case 'Delivery': return '#f59e0b'; // Amber
      case 'Invoice': return '#8b5cf6'; // Purple
      case 'Payment': return '#ec4899'; // Pink
      case 'Product': return '#6366f1'; // Indigo
      case 'Address': return '#64748b'; // Slate
      case 'Plant': return '#14b8a6'; // Teal
      default: return '#94a3b8';
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel={(node: any) => `${node.type}: ${node.label}`}
        nodeColor={getNodeColor}
        nodeRelSize={6}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node: any) => onNodeClick(node)}
        linkColor={() => 'rgba(255, 255, 255, 0.1)'}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Inter`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = getNodeColor(node);
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fill();

          if (globalScale > 1.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(label, node.x, node.y + 10);
          }
        }}
      />
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur p-3 rounded-lg border border-slate-700 text-xs text-slate-300 pointer-events-none">
        <div className="font-bold mb-2 text-white">Legend</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> Customer</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Sales Order</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div> Delivery</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div> Invoice</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ec4899]"></div> Payment</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#6366f1]"></div> Product</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#64748b]"></div> Address</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div> Plant</div>
        </div>
      </div>
    </div>
  );
};

export default GraphView;
