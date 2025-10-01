import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, RefreshCw } from "lucide-react";

interface TreeBuilderProps {
  onBuildTree: (names: string[], parents: number[]) => void;
}

interface NodeData {
  id: number;
  name: string;
  parentId: number;
}

const TreeBuilder = ({ onBuildTree }: TreeBuilderProps) => {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 0, name: "Root", parentId: -1 },
    { id: 1, name: "Child1", parentId: 0 },
    { id: 2, name: "Child2", parentId: 0 },
    { id: 3, name: "Child3", parentId: 0 },
    { id: 4, name: "GC1", parentId: 1 },
    { id: 5, name: "GC2", parentId: 1 },
    { id: 6, name: "GC3", parentId: 2 },
    { id: 7, name: "GC4", parentId: 2 },
  ]);

  const addNode = () => {
    const newId = nodes.length;
    setNodes([...nodes, { id: newId, name: `Node${newId}`, parentId: 0 }]);
  };

  const removeNode = (id: number) => {
    if (id === 0) return; // Can't remove root
    setNodes(nodes.filter(node => node.id !== id));
  };

  const updateNodeName = (id: number, name: string) => {
    setNodes(nodes.map(node => (node.id === id ? { ...node, name } : node)));
  };

  const updateNodeParent = (id: number, parentId: number) => {
    if (id === 0) return; // Root can't have parent
    if (id === parentId) return; // Can't be parent of self
    setNodes(nodes.map(node => (node.id === id ? { ...node, parentId } : node)));
  };

  const handleBuild = () => {
    const names = nodes.map(n => n.name);
    const parents = nodes.map(n => n.parentId);
    onBuildTree(names, parents);
  };

  const loadPreset = (preset: string) => {
    switch (preset) {
      case "simple":
        setNodes([
          { id: 0, name: "Root", parentId: -1 },
          { id: 1, name: "Left", parentId: 0 },
          { id: 2, name: "Right", parentId: 0 },
        ]);
        break;
      case "balanced":
        setNodes([
          { id: 0, name: "Root", parentId: -1 },
          { id: 1, name: "A", parentId: 0 },
          { id: 2, name: "B", parentId: 0 },
          { id: 3, name: "A1", parentId: 1 },
          { id: 4, name: "A2", parentId: 1 },
          { id: 5, name: "B1", parentId: 2 },
          { id: 6, name: "B2", parentId: 2 },
        ]);
        break;
      case "deep":
        setNodes([
          { id: 0, name: "L0", parentId: -1 },
          { id: 1, name: "L1", parentId: 0 },
          { id: 2, name: "L2", parentId: 1 },
          { id: 3, name: "L3", parentId: 2 },
          { id: 4, name: "L4", parentId: 3 },
        ]);
        break;
      case "wide":
        setNodes([
          { id: 0, name: "Root", parentId: -1 },
          { id: 1, name: "C1", parentId: 0 },
          { id: 2, name: "C2", parentId: 0 },
          { id: 3, name: "C3", parentId: 0 },
          { id: 4, name: "C4", parentId: 0 },
          { id: 5, name: "C5", parentId: 0 },
        ]);
        break;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Tree Builder</h3>
          <Button onClick={handleBuild} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Build Tree
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => loadPreset("simple")}
          >
            Simple (3 nodes)
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => loadPreset("balanced")}
          >
            Balanced (7 nodes)
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => loadPreset("deep")}
          >
            Deep (5 levels)
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => loadPreset("wide")}
          >
            Wide (6 children)
          </Badge>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="flex items-center gap-2 p-2 border rounded-lg"
            >
              <Badge variant="secondary">{node.id}</Badge>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={node.name}
                    onChange={(e) => updateNodeName(node.id, e.target.value)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Parent ID</Label>
                  <Input
                    type="number"
                    value={node.parentId}
                    onChange={(e) =>
                      updateNodeParent(node.id, parseInt(e.target.value))
                    }
                    disabled={node.id === 0}
                    className="h-8"
                    min={-1}
                    max={nodes.length - 1}
                  />
                </div>
              </div>
              {node.id !== 0 && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeNode(node.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button onClick={addNode} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Node
        </Button>
      </div>
    </Card>
  );
};

export default TreeBuilder;
