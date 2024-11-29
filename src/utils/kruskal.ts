interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface Node {
  id: string;
  x: number;
  y: number;
}

class DisjointSet {
  private parent: { [key: string]: string };

  constructor() {
    this.parent = {};
  }

  makeSet(vertex: string) {
    this.parent[vertex] = vertex;
  }

  find(vertex: string): string {
    if (this.parent[vertex] !== vertex) {
      this.parent[vertex] = this.find(this.parent[vertex]);
    }
    return this.parent[vertex];
  }

  union(vertex1: string, vertex2: string) {
    const root1 = this.find(vertex1);
    const root2 = this.find(vertex2);
    if (root1 !== root2) {
      this.parent[root2] = root1;
    }
  }
}

export const kruskalMST = (edges: Edge[], nodes: Node[]): Edge[] => {
  const ds = new DisjointSet();
  nodes.forEach((node) => ds.makeSet(node.id));

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mst: Edge[] = [];

  for (const edge of sortedEdges) {
    const sourceRoot = ds.find(edge.source);
    const targetRoot = ds.find(edge.target);

    if (sourceRoot !== targetRoot) {
      mst.push(edge);
      ds.union(edge.source, edge.target);
    }
  }

  return mst;
};