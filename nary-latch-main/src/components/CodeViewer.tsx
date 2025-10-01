import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const CodeViewer = () => {
  const lockCode = `// Lock Operation - O(log N)
bool NaryTreeLock::lock(int node_id, int user_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;

    // Check if already locked - O(1)
    int expected = -1;
    if (!node->locked_by.compare_exchange_strong(expected, user_id)) {
        return false;  // Already locked
    }

    // Check if any descendant is locked - O(1)
    if (node->locked_descendant_count.load() > 0) {
        node->locked_by.store(-1);
        return false;
    }

    // Check if any ancestor is locked - O(log N)
    if (hasLockedAncestor(node)) {
        node->locked_by.store(-1);
        return false;
    }

    // Successfully locked - update ancestor counts
    updateAncestorCount(node, 1);
    return true;
}`;

  const unlockCode = `// Unlock Operation - O(log N)
bool NaryTreeLock::unlock(int node_id, int user_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;

    // Check if locked by this user - O(1)
    int expected = user_id;
    if (!node->locked_by.compare_exchange_strong(expected, -1)) {
        return false;  // Not locked by this user
    }

    // Update ancestor counts - O(log N)
    updateAncestorCount(node, -1);
    return true;
}`;

  const upgradeCode = `// Upgrade Lock - O(M + log N)
bool NaryTreeLock::upgradeLock(int node_id, int user_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;

    // Validate node can be locked
    if (node->locked_by.load() != -1) return false;
    if (hasLockedAncestor(node)) return false;
    if (node->locked_descendant_count.load() == 0) return false;

    // Find all locked descendants (BFS) - O(M)
    std::vector<TreeNode*> locked_descendants;
    std::queue<TreeNode*> q;
    q.push(node);

    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();

        for (TreeNode* child : curr->children) {
            if (child->locked_by.load() == user_id) {
                locked_descendants.push_back(child);
            }
            q.push(child);
        }
    }

    // Verify all locked descendants belong to user
    if (locked_descendants.size() != node->locked_descendant_count) {
        return false;
    }

    // Unlock all descendants
    for (TreeNode* desc : locked_descendants) {
        desc->locked_by.store(-1);
        updateAncestorCount(desc, -1);
    }

    // Lock current node
    node->locked_by.store(user_id);
    updateAncestorCount(node, 1);

    return true;
}`;

  const helperCode = `// Helper: Check if any ancestor is locked - O(log N)
bool NaryTreeLock::hasLockedAncestor(TreeNode* node) {
    TreeNode* curr = node->parent;

    while (curr != nullptr) {
        if (curr->locked_by.load() != -1) {
            return true;
        }
        curr = curr->parent;
    }

    return false;
}

// Helper: Update ancestor counts - O(log N)
void NaryTreeLock::updateAncestorCount(TreeNode* node, int delta) {
    TreeNode* curr = node->parent;

    while (curr != nullptr) {
        curr->locked_descendant_count.fetch_add(delta);
        curr = curr->parent;
    }
}`;

  const nodeStructCode = `// TreeNode Structure
class TreeNode {
public:
    std::string name;
    int id;
    TreeNode* parent;
    std::vector<TreeNode*> children;

    // Lock state - thread-safe
    std::atomic<int> locked_by;              // User ID (-1 if unlocked)
    std::atomic<int> locked_descendant_count; // Count of locked descendants
    std::mutex node_mutex;                   // For structural changes

    TreeNode(const std::string& node_name, int node_id,
             TreeNode* parent_node = nullptr)
        : name(node_name), id(node_id), parent(parent_node),
          locked_by(-1), locked_descendant_count(0) {}

    void addChild(TreeNode* child) {
        children.push_back(child);
    }
};`;

  const analysisCode = `/*
 * TIME COMPLEXITY ANALYSIS
 *
 * Lock Operation: O(log N)
 * - Check already locked: O(1)
 * - Check descendant count: O(1)
 * - Check ancestors: O(height) = O(log N) for balanced tree
 * - Update ancestor counts: O(height) = O(log N)
 * Total: O(log N)
 *
 * Unlock Operation: O(log N)
 * - Verify ownership: O(1)
 * - Update ancestor counts: O(height) = O(log N)
 * Total: O(log N)
 *
 * Upgrade Lock: O(M + log N)
 * - M = number of locked descendants
 * - BFS to find descendants: O(M)
 * - Unlock each: M * O(log N)
 * - Lock parent: O(log N)
 * Total: O(M * log N + log N) = O(M + log N) amortized
 *
 * SPACE COMPLEXITY: O(N)
 * - N nodes with parent/child pointers
 * - Atomic counters at each node
 * - No additional data structures
 *
 * OPTIMIZATION KEY:
 * Instead of traversing entire subtree (O(N)) to check descendants,
 * we maintain a counter at each node (O(1) check, O(log N) update)
 */`;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">C++ Implementation</h3>
          <p className="text-muted-foreground">
            Core algorithm with O(log N) optimization and thread-safety
          </p>
        </div>

        <Tabs defaultValue="lock">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="lock">Lock</TabsTrigger>
            <TabsTrigger value="unlock">Unlock</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
            <TabsTrigger value="helpers">Helpers</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="lock" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge>O(log N)</Badge>
                <span className="text-sm text-muted-foreground">
                  Lock a node with constraint validation
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono">
                  <code>{lockCode}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="unlock" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge>O(log N)</Badge>
                <span className="text-sm text-muted-foreground">
                  Unlock a node and update ancestors
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono">
                  <code>{unlockCode}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="upgrade" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge>O(M + log N)</Badge>
                <span className="text-sm text-muted-foreground">
                  Lock parent, unlock all descendants
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono">
                  <code>{upgradeCode}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="helpers" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge>O(log N)</Badge>
                <span className="text-sm text-muted-foreground">
                  Helper functions for ancestor operations
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono">
                  <code>{helperCode}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge>Thread-Safe</Badge>
                <span className="text-sm text-muted-foreground">
                  Node structure with atomic operations
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono">
                  <code>{nodeStructCode}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Complexity Analysis</Badge>
                <span className="text-sm text-muted-foreground">
                  Time and space complexity breakdown
                </span>
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  <code>{analysisCode}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default CodeViewer;
