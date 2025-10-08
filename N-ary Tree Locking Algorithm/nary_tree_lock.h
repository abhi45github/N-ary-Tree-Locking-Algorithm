#ifndef NARY_TREE_LOCK_H
#define NARY_TREE_LOCK_H

#include <vector>
#include <string>
#include <atomic>
#include <memory>
#include <unordered_map>
#include <mutex>

/**
 * N-ary Tree Locking Algorithm
 *
 * Features:
 * - Thread-safe locking/unlocking without mutex on individual nodes
 * - O(log N) time complexity for lock/unlock operations
 * - Lock constraints:
 *   1. A node can only be locked if no ancestor is locked
 *   2. A node can only be locked if no descendant is locked
 *
 * Optimization Strategy:
 * - Track locked descendant count at each node
 * - Only traverse to root for ancestor checking (O(height))
 * - Use atomic operations for thread safety
 */

class TreeNode {
public:
    std::string name;
    int id;
    TreeNode* parent;
    std::vector<TreeNode*> children;

    // Lock state
    std::atomic<int> locked_by;          // User ID who locked this node (-1 if unlocked)
    std::atomic<int> locked_descendant_count;  // Count of locked descendants

    // Thread safety
    std::mutex node_mutex;  // Used only for structural modifications

    TreeNode(const std::string& node_name, int node_id, TreeNode* parent_node = nullptr);

    void addChild(TreeNode* child);
};

class NaryTreeLock {
private:
    TreeNode* root;
    std::unordered_map<int, TreeNode*> node_map;  // Fast lookup by ID
    int node_count;

    // Helper methods
    bool hasLockedAncestor(TreeNode* node);
    void updateAncestorCount(TreeNode* node, int delta);

public:
    NaryTreeLock();
    ~NaryTreeLock();

    /**
     * Build tree from parent array representation
     * @param node_names: Names of nodes
     * @param parent_ids: Parent ID for each node (-1 for root)
     */
    void buildTree(const std::vector<std::string>& node_names,
                    const std::vector<int>& parent_ids);

    /**
     * Lock a node for a specific user
     * @param node_id: ID of the node to lock
     * @param user_id: ID of the user requesting the lock
     * @return true if lock successful, false otherwise
     *
     * Time Complexity: O(log N) - only traverses to root
     */
    bool lock(int node_id, int user_id);

    /**
     * Unlock a node
     * @param node_id: ID of the node to unlock
     * @param user_id: ID of the user requesting the unlock
     * @return true if unlock successful, false otherwise
     *
     * Time Complexity: O(log N) - updates ancestor counts
     */
    bool unlock(int node_id, int user_id);

    /**
     * Upgrade lock: Lock a node and unlock all locked descendants
     * @param node_id: ID of the node to upgrade
     * @param user_id: ID of the user requesting the upgrade
     * @return true if upgrade successful, false otherwise
     *
     * Time Complexity: O(M + log N) where M is number of locked descendants
     */
    bool upgradeLock(int node_id, int user_id);

    // Utility methods
    TreeNode* getNode(int node_id);
    bool isLocked(int node_id);
    int getLockedBy(int node_id);
    void printTree();
    void printTreeHelper(TreeNode* node, int depth);
};

#endif // NARY_TREE_LOCK_H
