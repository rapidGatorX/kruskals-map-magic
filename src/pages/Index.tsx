import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Graph from "@/components/Graph";
import { kruskalMST } from "@/utils/kruskal";
import { useToast } from "@/components/ui/use-toast";

const nodes = [
  { id: "Chattogram", x: 600, y: 400 },
  { id: "Dhaka", x: 200, y: 200 },
  { id: "Cumilla", x: 450, y: 300 },
  { id: "Chandpur", x: 350, y: 400 },
  { id: "Feni", x: 500, y: 450 },
  { id: "Brahmanbaria", x: 400, y: 150 },
  { id: "Narsingdi", x: 250, y: 300 },
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
      description: "The cheapest route has been calculated using Kruskal's algorithm.",
    });
  };

  return (
    <div className="min-h-screen bg-mapbg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Cheapest Route Finder: Chattogram to Dhaka
          </h1>
          <Button
            onClick={handleGenerateRoute}
            className="bg-route hover:bg-route-highlight text-white"
          >
            Generate Cheapest Route
          </Button>
        </div>
        <div className="bg-mapbg/50 rounded-lg shadow-xl p-4 aspect-video">
          <Graph nodes={nodes} edges={edges} mstEdges={mstEdges} />
        </div>
      </div>
    </div>
  );
};

export default Index;