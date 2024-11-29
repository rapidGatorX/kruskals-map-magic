import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  mstEdges?: Edge[];
  className?: string;
}

const Graph: React.FC<GraphProps> = ({ nodes, edges, mstEdges, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const findNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <svg
      ref={svgRef}
      className={cn("w-full h-full", className)}
      viewBox="0 0 800 600"
    >
      {/* Draw edges */}
      {edges.map((edge) => {
        const source = findNode(edge.source);
        const target = findNode(edge.target);
        if (!source || !target) return null;

        const isMST = mstEdges?.some(
          (e) =>
            (e.source === edge.source && e.target === edge.target) ||
            (e.source === edge.target && e.target === edge.source)
        );

        return (
          <g key={`${edge.source}-${edge.target}`}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className={cn(
                "stroke-2",
                isMST
                  ? "stroke-route-highlight animate-path-trace"
                  : "stroke-route opacity-30"
              )}
              strokeDasharray={isMST ? "1000" : "0"}
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2}
              className="fill-white text-sm"
              textAnchor="middle"
              dy="-5"
            >
              {edge.weight}km
            </text>
          </g>
        );
      })}

      {/* Draw nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r="10"
            className="fill-node stroke-white stroke-2 animate-node-pulse"
          />
          <text
            x={node.x}
            y={node.y + 25}
            className="fill-white text-sm font-semibold"
            textAnchor="middle"
          >
            {node.id}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default Graph;