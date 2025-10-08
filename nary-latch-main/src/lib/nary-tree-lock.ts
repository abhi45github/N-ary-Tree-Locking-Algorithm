/**
 * N-ary Tree Locking Algorithm - TypeScript Implementation
 * Optimized from O(N) to O(log N)
 */

export class TreeNode {
  id: number;
  name: string;
  parent: TreeNode | null;
  children: TreeNode[];
  lockedBy: number; // -1 if unlocked, otherwise user ID
  lockedDescendantCount: number;

  constructor(id: number, name: string, parent: TreeNode | null = null) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.children = [];
    this.lockedBy = -1;
    this.lockedDescendantCount = 0;
  }

  addChild(child: TreeNode): void {
    this.children.push(child);
  }
}

export interface LockResult {
  success: boolean;
  message: string;
  operation: 'lock' | 'unlock' | 'upgrade';
  nodeId: number;
  userId: number;
  timestamp: number;
}

export interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  duration: number;
}

export class NaryTreeLock {
  private root: TreeNode | null = null;
  private nodeMap: Map<number, TreeNode> = new Map();
  private operationLog: LockResult[] = [];

  /**
   * Build tree from names and parent IDs
   */
  buildTree(names: string[], parentIds: number[]): void {
    if (names.length !== parentIds.length) {
      throw new Error('names and parentIds must have same length');
    }

    this.nodeMap.clear();
    const nodes: TreeNode[] = [];

    // Create all nodes
    for (let i = 0; i < names.length; i++) {
      nodes[i] = new TreeNode(i, names[i]);
      this.nodeMap.set(i, nodes[i]);
    }

    // Build parent-child relationships
    for (let i = 0; i < names.length; i++) {
      const parentId = parentIds[i];
      if (parentId === -1) {
        this.root = nodes[i];
      } else {
        nodes[i].parent = nodes[parentId];
        nodes[parentId].addChild(nodes[i]);
      }
    }
  }

  getNode(nodeId: number): TreeNode | null {
    return this.nodeMap.get(nodeId) || null;
  }

  getRoot(): TreeNode | null {
    return this.root;
  }

  getAllNodes(): TreeNode[] {
    return Array.from(this.nodeMap.values());
  }

  getOperationLog(): LockResult[] {
    return this.operationLog;
  }

  clearOperationLog(): void {
    this.operationLog = [];
  }

  /**
   * Check if any ancestor is locked
   * Time Complexity: O(log N)
   */
  private hasLockedAncestor(node: TreeNode): boolean {
    let current = node.parent;
    while (current !== null) {
      if (current.lockedBy !== -1) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  /**
   * Update locked descendant count for all ancestors
   * Time Complexity: O(log N)
   */
  private updateAncestorCount(node: TreeNode, delta: number): void {
    let current = node.parent;
    while (current !== null) {
      current.lockedDescendantCount += delta;
      current = current.parent;
    }
  }

  /**
   * Lock a node
   * Time Complexity: O(log N)
   */
  lock(nodeId: number, userId: number): LockResult {
    const startTime = performance.now();
    const node = this.getNode(nodeId);

    if (!node) {
      const result: LockResult = {
        success: false,
        message: `Node ${nodeId} not found`,
        operation: 'lock',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if already locked
    if (node.lockedBy !== -1) {
      const result: LockResult = {
        success: false,
        message: `Node ${node.name} is already locked by User ${node.lockedBy}`,
        operation: 'lock',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if any descendant is locked
    if (node.lockedDescendantCount > 0) {
      const result: LockResult = {
        success: false,
        message: `Node ${node.name} has ${node.lockedDescendantCount} locked descendants`,
        operation: 'lock',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if any ancestor is locked
    if (this.hasLockedAncestor(node)) {
      const result: LockResult = {
        success: false,
        message: `Node ${node.name} has a locked ancestor`,
        operation: 'lock',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Lock the node
    node.lockedBy = userId;
    this.updateAncestorCount(node, 1);

    const duration = performance.now() - startTime;
    const result: LockResult = {
      success: true,
      message: `Node ${node.name} locked by User ${userId} (${duration.toFixed(2)}ms)`,
      operation: 'lock',
      nodeId,
      userId,
      timestamp: Date.now(),
    };
    this.operationLog.push(result);
    return result;
  }

  /**
   * Unlock a node
   * Time Complexity: O(log N)
   */
  unlock(nodeId: number, userId: number): LockResult {
    const startTime = performance.now();
    const node = this.getNode(nodeId);

    if (!node) {
      const result: LockResult = {
        success: false,
        message: `Node ${nodeId} not found`,
        operation: 'unlock',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if locked by this user
    if (node.lockedBy !== userId) {
      const result: LockResult = {
        success: false,
        message:
          node.lockedBy === -1
            ? `Node ${node.name} is not locked`
            : `Node ${node.name} is locked by User ${node.lockedBy}, not User ${userId}`,
        operation: 'unlock',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Unlock the node
    node.lockedBy = -1;
    this.updateAncestorCount(node, -1);

    const duration = performance.now() - startTime;
    const result: LockResult = {
      success: true,
      message: `Node ${node.name} unlocked by User ${userId} (${duration.toFixed(2)}ms)`,
      operation: 'unlock',
      nodeId,
      userId,
      timestamp: Date.now(),
    };
    this.operationLog.push(result);
    return result;
  }

  /**
   * Upgrade lock: Lock parent and unlock all locked descendants
   * Time Complexity: O(M + log N) where M is number of locked descendants
   */
  upgradeLock(nodeId: number, userId: number): LockResult {
    const startTime = performance.now();
    const node = this.getNode(nodeId);

    if (!node) {
      const result: LockResult = {
        success: false,
        message: `Node ${nodeId} not found`,
        operation: 'upgrade',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if node is already locked
    if (node.lockedBy !== -1) {
      const result: LockResult = {
        success: false,
        message: `Node ${node.name} is already locked`,
        operation: 'upgrade',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if any ancestor is locked
    if (this.hasLockedAncestor(node)) {
      const result: LockResult = {
        success: false,
        message: `Node ${node.name} has a locked ancestor`,
        operation: 'upgrade',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Check if there are locked descendants
    if (node.lockedDescendantCount === 0) {
      const result: LockResult = {
        success: false,
        message: `Node ${node.name} has no locked descendants to upgrade`,
        operation: 'upgrade',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Find all locked descendants (BFS)
    const lockedDescendants: TreeNode[] = [];
    const queue: TreeNode[] = [node];

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const child of current.children) {
        if (child.lockedBy === userId) {
          lockedDescendants.push(child);
        }
        queue.push(child);
      }
    }

    // Verify all locked descendants belong to this user
    if (lockedDescendants.length !== node.lockedDescendantCount) {
      const result: LockResult = {
        success: false,
        message: `Not all locked descendants belong to User ${userId}`,
        operation: 'upgrade',
        nodeId,
        userId,
        timestamp: Date.now(),
      };
      this.operationLog.push(result);
      return result;
    }

    // Unlock all descendants
    for (const desc of lockedDescendants) {
      desc.lockedBy = -1;
      this.updateAncestorCount(desc, -1);
    }

    // Lock current node
    node.lockedBy = userId;
    this.updateAncestorCount(node, 1);

    const duration = performance.now() - startTime;
    const result: LockResult = {
      success: true,
      message: `Node ${node.name} upgraded: unlocked ${lockedDescendants.length} descendants, locked parent (${duration.toFixed(2)}ms)`,
      operation: 'upgrade',
      nodeId,
      userId,
      timestamp: Date.now(),
    };
    this.operationLog.push(result);
    return result;
  }

  /**
   * Reset all locks
   */
  resetAllLocks(): void {
    for (const node of this.nodeMap.values()) {
      node.lockedBy = -1;
      node.lockedDescendantCount = 0;
    }
    this.clearOperationLog();
  }

  /**
   * Get tree state for visualization
   */
  getTreeState(): any {
    const buildNodeState = (node: TreeNode): any => {
      return {
        id: node.id,
        name: node.name,
        lockedBy: node.lockedBy,
        lockedDescendantCount: node.lockedDescendantCount,
        children: node.children.map(buildNodeState),
      };
    };

    return this.root ? buildNodeState(this.root) : null;
  }
}
