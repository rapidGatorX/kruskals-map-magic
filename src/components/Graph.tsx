import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PersonStanding } from "lucide-react";

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
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const findNode = (id: string) => nodes.find((n) => n.id === id);

  useEffect(() => {
    if (mstEdges && !isAnimating) {
      setIsAnimating(true);
      // Find path from Chattogram to Dhaka using MST
      const chattogramNode = findNode("Chattogram");
      if (chattogramNode) {
        setIconPosition({ x: chattogramNode.x, y: chattogramNode.y });
      }

      // Animate along the path
      const animateAlongPath = async () => {
        if (!mstEdges) return;
        
        const path = mstEdges.map(edge => {
          const source = findNode(edge.source);
          const target = findNode(edge.target);
          return { source, target };
        });

        for (const segment of path) {
          if (segment.source && segment.target) {
            await new Promise<void>((resolve) => {
              const duration = 1000;
              const startTime = Date.now();
              const startX = segment.source.x;
              const startY = segment.source.y;
              const endX = segment.target.x;
              const endY = segment.target.y;

              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;

                setIconPosition({ x: currentX, y: currentY });

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  resolve();
                }
              };

              requestAnimationFrame(animate);
            });
          }
        }
      };

      animateAlongPath();
    }
  }, [mstEdges]);

  return (
    <svg
      ref={svgRef}
      className={cn("w-full h-full", className)}
      viewBox="0 0 1000 800"
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
                "stroke-4",
                isMST
                  ? "stroke-[#6E59A5] animate-path-trace"
                  : "stroke-[#D6BCFA] opacity-30"
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
            r="12"
            className="fill-node stroke-white stroke-2"
          />
          <text
            x={node.x}
            y={node.y + 30}
            className="fill-white text-sm font-semibold"
            textAnchor="middle"
          >
            {node.id}
          </text>
        </g>
      ))}

      {/* Animated person icon */}
      {isAnimating && (
        <g transform={`translate(${iconPosition.x - 12}, ${iconPosition.y - 12})`}>
          <PersonStanding className="w-6 h-6 text-white" />
        </g>
      )}
    </svg>
  );
};

export default Graph;