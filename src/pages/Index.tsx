import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Graph from "@/components/Graph";
import { kruskalMST } from "@/utils/kruskal";
import { useToast } from "@/components/ui/use-toast";

const nodes = [
  { id: "Chattogram", x: 750, y: 500 },
  { id: "Dhaka", x: 250, y: 250 },
  { id: "Cumilla", x: 550, y: 375 },
  { id: "Chandpur", x: 450, y: 500 },
  { id: "Feni", x: 650, y: 550 },
  { id: "Brahmanbaria", x: 500, y: 200 },
  { id: "Narsingdi", x: 300, y: 375 },
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

  return (
    <div className="min-h-screen bg-mapbg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Shortest Route Finder: Chattogram to Dhaka
          </h1>
          <Button
            onClick={handleGenerateRoute}
            className="bg-[#6E59A5] hover:bg-[#9b87f5] text-white"
          >
            Generate Shortest Route
          </Button>
        </div>
        <div className="bg-mapbg/50 rounded-lg shadow-xl p-4 aspect-[4/3]">
          <Graph nodes={nodes} edges={edges} mstEdges={mstEdges} />
        </div>
      </div>
    </div>
  );
};

export default Index;
