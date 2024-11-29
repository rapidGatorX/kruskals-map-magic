import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Graph from "@/components/Graph";
import { kruskalMST } from "@/utils/kruskal";
import { useToast } from "@/components/ui/use-toast";

const nodes = [
  { id: "Chattogram", x: 900, y: 600 },
  { id: "Dhaka", x: 300, y: 300 },
  { id: "Cumilla", x: 650, y: 450 },
  { id: "Chandpur", x: 550, y: 600 },
  { id: "Feni", x: 750, y: 650 },
  { id: "Brahmanbaria", x: 600, y: 250 },
  { id: "Narsingdi", x: 400, y: 450 },
];

const edges = [
  { source: "Chattogram", target: "Feni", weight: 150 },
  { source: "Feni", target: "Cumilla", weight: 80 },
  { source: "Cumilla", target: "Chandpur", weight: 60 },
  { source: "Chandpur", target: "Narsingdi", weight: 90 },
  { source: "Narsingdi", target: "Dhaka", weight: 50 },
  { source: "Cumilla", target: "Brahmanbaria", weight: 70 },
  { source: "Brahmanbaria", target: "Dhaka", weight: 100 },
  { source: "Feni", target: "Chandpur", weight: 110 },
  { source: "Cumilla", target: "Narsingdi", weight: 85 },
  { source: "Brahmanbaria", target: "Narsingdi", weight: 65 },
];

const Index = () => {
  const [mstEdges, setMstEdges] = useState<typeof edges | undefined>();
  const { toast } = useToast();

  const handleGenerateRoute = () => {
    const mst = kruskalMST(edges, nodes);
    setMstEdges(mst);
    toast({
      title: "Route Generated!",
      description: "The shortest route has been calculated using Kruskal's algorithm.",
    });
  };

  const handleReset = () => {
    setMstEdges(undefined);
    toast({
      title: "Reset Complete",
      description: "The map has been reset to its initial state.",
    });
  };

  return (
    <div className="min-h-screen bg-mapbg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            Shortest Route Finder: Chattogram to Dhaka
          </h1>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleGenerateRoute}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
              disabled={mstEdges !== undefined}
            >
              Generate Shortest Route
            </Button>
            <Button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold"
            >
              Reset Map
            </Button>
          </div>
        </div>
        <div className="bg-mapbg/50 rounded-lg shadow-xl p-4 aspect-[6/4]">
          <Graph 
            nodes={nodes} 
            edges={edges} 
            mstEdges={mstEdges}
            onAnimationComplete={() => {
              toast({
                title: "Destination Reached!",
                description: "The shortest path to Dhaka has been completed.",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;