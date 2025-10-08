import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NaryTreeLock, TreeNode, LockResult } from "@/lib/nary-tree-lock";
import { Lock, Unlock, ArrowUpCircle, RotateCcw, Play, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TreeBuilder from "@/components/TreeBuilder";
import CodeViewer from "@/components/CodeViewer";

const Demo = () => {
  const navigate = useNavigate();
  const [tree] = useState(() => new NaryTreeLock());
  const [treeState, setTreeState] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [userId, setUserId] = useState<number>(1);
  const [operationLog, setOperationLog] = useState<LockResult[]>([]);
  const [stats, setStats] = useState({ locks: 0, unlocks: 0, upgrades: 0 });

  // Initialize default tree
  useEffect(() => {
    const names = ["Root", "Child1", "Child2", "Child3", "GC1", "GC2", "GC3", "GC4"];
    const parents = [-1, 0, 0, 0, 1, 1, 2, 2];
    tree.buildTree(names, parents);
    updateTreeState();
  }, []);

  const handleBuildTree = (names: string[], parents: number[]) => {
    handleReset();
    tree.buildTree(names, parents);
    updateTreeState();
  };

  const updateTreeState = () => {
    setTreeState(tree.getTreeState());
    setOperationLog([...tree.getOperationLog()]);
  };

  const handleLock = () => {
    if (selectedNode === null) return;
    const result = tree.lock(selectedNode, userId);
    updateTreeState();
    if (result.success) {
      setStats(prev => ({ ...prev, locks: prev.locks + 1 }));
    }
  };

  const handleUnlock = () => {
    if (selectedNode === null) return;
    const result = tree.unlock(selectedNode, userId);
    updateTreeState();
    if (result.success) {
      setStats(prev => ({ ...prev, unlocks: prev.unlocks + 1 }));
    }
  };

  const handleUpgrade = () => {
    if (selectedNode === null) return;
    const result = tree.upgradeLock(selectedNode, userId);
    updateTreeState();
    if (result.success) {
      setStats(prev => ({ ...prev, upgrades: prev.upgrades + 1 }));
    }
  };

  const handleReset = () => {
    tree.resetAllLocks();
    updateTreeState();
    setStats({ locks: 0, unlocks: 0, upgrades: 0 });
    setSelectedNode(null);
  };

  const runTests = () => {
    handleReset();

    // Test 1: Basic lock
    setTimeout(() => tree.lock(1, 1) && updateTreeState(), 100);
    setTimeout(() => tree.unlock(1, 1) && updateTreeState(), 300);

    // Test 2: Lock parent then try child
    setTimeout(() => tree.lock(0, 1) && updateTreeState(), 500);
    setTimeout(() => tree.lock(1, 2) && updateTreeState(), 700);
    setTimeout(() => tree.unlock(0, 1) && updateTreeState(), 900);

    // Test 3: Lock children then upgrade
    setTimeout(() => tree.lock(4, 1) && updateTreeState(), 1100);
    setTimeout(() => tree.lock(5, 1) && updateTreeState(), 1300);
    setTimeout(() => tree.upgradeLock(1, 1) && updateTreeState(), 1500);
  };

  const TreeNodeComponent = ({ node, depth = 0 }: { node: any; depth?: number }) => {
    const isSelected = selectedNode === node.id;
    const isLocked = node.lockedBy !== -1;
    const hasLockedDesc = node.lockedDescendantCount > 0;

    return (
      <div className="ml-4">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
            isSelected
              ? "bg-primary/20 border-2 border-primary"
              : "hover:bg-muted border-2 border-transparent"
          } ${isLocked ? "bg-red-500/20" : ""}`}
          onClick={() => setSelectedNode(node.id)}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              isLocked
                ? "bg-red-500 text-white"
                : hasLockedDesc
                ? "bg-yellow-500 text-white"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {node.id}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground">{node.name}</div>
            <div className="text-xs text-muted-foreground">
              {isLocked && `Locked by User ${node.lockedBy}`}
              {!isLocked && hasLockedDesc && `${node.lockedDescendantCount} locked descendants`}
              {!isLocked && !hasLockedDesc && "Unlocked"}
            </div>
          </div>
          {isLocked && <Lock className="w-4 h-4 text-red-500" />}
        </div>
        {node.children && node.children.length > 0 && (
          <div className="ml-6 mt-2 border-l-2 border-muted pl-2">
            {node.children.map((child: any) => (
              <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Interactive N-ary Tree Locking Demo
              </h1>
              <p className="text-muted-foreground">
                Test the O(log N) lock/unlock algorithm in real-time
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.locks}</div>
            <div className="text-sm text-muted-foreground">Locks</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-secondary">{stats.unlocks}</div>
            <div className="text-sm text-muted-foreground">Unlocks</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-accent">{stats.upgrades}</div>
            <div className="text-sm text-muted-foreground">Upgrades</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{operationLog.length}</div>
            <div className="text-sm text-muted-foreground">Total Ops</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tree Visualization */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tree Structure</h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <ScrollArea className="h-[400px] border rounded-lg p-4">
                {treeState ? (
                  <TreeNodeComponent node={treeState} />
                ) : (
                  <div className="text-center text-muted-foreground">No tree loaded</div>
                )}
              </ScrollArea>

              <div className="flex items-center gap-2 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Legend:</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary"></div>
                  <span className="text-xs">Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                  <span className="text-xs">Locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">Has Locked Desc</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Operations</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">User ID</label>
                  <Input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Node</label>
                  <div className="text-2xl font-bold text-primary">
                    {selectedNode !== null ? `Node ${selectedNode}` : "None"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleLock}
                    disabled={selectedNode === null}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Lock
                  </Button>
                  <Button
                    onClick={handleUnlock}
                    disabled={selectedNode === null}
                    variant="secondary"
                    className="w-full"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock
                  </Button>
                </div>

                <Button
                  onClick={handleUpgrade}
                  disabled={selectedNode === null}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                  Upgrade Lock
                </Button>

                <Button onClick={runTests} variant="default" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Run Automated Tests
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Operation Log</h2>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {operationLog.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No operations yet
                    </div>
                  ) : (
                    operationLog
                      .slice()
                      .reverse()
                      .map((op, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border ${
                            op.success ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={op.success ? "default" : "destructive"}>
                              {op.operation}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              User {op.userId}
                            </span>
                          </div>
                          <div className="text-sm">{op.message}</div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* Complexity Info */}
        <Card className="mt-6 p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Lock Operation</h3>
              <Badge className="text-lg px-4 py-2">O(log N)</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Traverses to root checking ancestors
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Unlock Operation</h3>
              <Badge className="text-lg px-4 py-2">O(log N)</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Updates ancestor counters
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Upgrade Lock</h3>
              <Badge className="text-lg px-4 py-2">O(M + log N)</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                M = locked descendants
              </p>
            </div>
          </div>
        </Card>

        {/* Tree Builder */}
        <div className="mt-6">
          <TreeBuilder onBuildTree={handleBuildTree} />
        </div>

        {/* Code Viewer */}
        <div className="mt-6">
          <CodeViewer />
        </div>
      </div>
    </div>
  );
};

export default Demo;
