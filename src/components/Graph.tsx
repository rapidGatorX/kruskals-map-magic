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
  onAnimationComplete?: () => void;
}

const Graph: React.FC<GraphProps> = ({ nodes, edges, mstEdges, className, onAnimationComplete }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitedEdges, setVisitedEdges] = useState<Edge[]>([]);

  const findNode = (id: string) => nodes.find((n) => n.id === id);

  useEffect(() => {
    if (mstEdges && !isAnimating) {
      setIsAnimating(true);
      setVisitedEdges([]);
      
      // Find path from Chattogram to Dhaka
      const path = findPathToTarget(mstEdges, "Chattogram", "Dhaka");
      
      // Start animation from Chattogram
      const chattogramNode = findNode("Chattogram");
      if (chattogramNode) {
        setIconPosition({ x: chattogramNode.x, y: chattogramNode.y });
        animateAlongPath(path);
      }
    }
  }, [mstEdges]);

  const findPathToTarget = (edges: Edge[], start: string, target: string) => {
    const graph = new Map<string, { node: string; edge: Edge }[]>();
    
    // Build adjacency list
    edges.forEach(edge => {
      if (!graph.has(edge.source)) graph.set(edge.source, []);
      if (!graph.has(edge.target)) graph.set(edge.target, []);
      
      graph.get(edge.source)?.push({ node: edge.target, edge });
      graph.get(edge.target)?.push({ node: edge.source, edge });
    });

    // DFS to find path
    const visited = new Set<string>();
    const path: Edge[] = [];

    function dfs(current: string): boolean {
      if (current === target) return true;
      visited.add(current);

      const neighbors = graph.get(current) || [];
      for (const { node, edge } of neighbors) {
        if (!visited.has(node)) {
          path.push(edge);
          if (dfs(node)) return true;
          path.pop();
        }
      }

      return false;
    }

    dfs(start);
    return path;
  };

  const animateAlongPath = async (path: Edge[]) => {
    for (const edge of path) {
      const source = findNode(edge.source);
      const target = findNode(edge.target);
      
      if (source && target) {
        await new Promise<void>((resolve) => {
          const duration = 1000;
          const startTime = Date.now();
          const startX = source.x;
          const startY = source.y;
          const endX = target.x;
          const endY = target.y;

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            setIconPosition({ x: currentX, y: currentY });

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setVisitedEdges(prev => [...prev, edge]);
              resolve();
            }
          };

          requestAnimationFrame(animate);
        });
      }
    }
    
    setIsAnimating(false);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <svg
      ref={svgRef}
      className={cn("w-full h-full", className)}
      viewBox="0 0 1200 1000"
    >
      {/* Draw edges */}
      {edges.map((edge) => {
        const source = findNode(edge.source);
        const target = findNode(edge.target);
        if (!source || !target) return null;

        const isVisited = visitedEdges.some(
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
                isVisited
                  ? "stroke-red-500 animate-path-trace"
                  : "stroke-[#D6BCFA] opacity-30"
              )}
              strokeDasharray={isVisited ? "1000" : "0"}
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2}
              className="fill-white text-sm font-bold"
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
            r="15"
            className="fill-black stroke-white stroke-2"
          />
          <text
            x={node.x}
            y={node.y + 35}
            className="fill-white text-sm font-bold"
            textAnchor="middle"
          >
            {node.id}
          </text>
        </g>
      ))}

      {/* Animated person icon */}
      {isAnimating && (
        <g transform={`translate(${iconPosition.x - 12}, ${iconPosition.y - 12})`}>
          <PersonStanding className="w-8 h-8 text-white" />
        </g>
      )}
    </svg>
  );
};

export default Graph;