#include "nary_tree_lock.h"
#include <iostream>
#include <queue>
#include <stack>

// TreeNode Implementation
TreeNode::TreeNode(const std::string& node_name, int node_id, TreeNode* parent_node)
    : name(node_name), id(node_id), parent(parent_node),
      locked_by(-1), locked_descendant_count(0) {}

void TreeNode::addChild(TreeNode* child) {
    children.push_back(child);
}

// NaryTreeLock Implementation
NaryTreeLock::NaryTreeLock() : root(nullptr), node_count(0) {}

NaryTreeLock::~NaryTreeLock() {
    // Clean up tree nodes using BFS
    if (!root) return;

    std::queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();

        for (TreeNode* child : curr->children) {
            q.push(child);
        }

        delete curr;
    }
}

void NaryTreeLock::buildTree(const std::vector<std::string>& node_names,
                              const std::vector<int>& parent_ids) {
    if (node_names.size() != parent_ids.size()) {
        throw std::invalid_argument("node_names and parent_ids must have same size");
    }

    node_count = node_names.size();
    std::vector<TreeNode*> nodes(node_count);

    // Create all nodes first
    for (int i = 0; i < node_count; i++) {
        nodes[i] = new TreeNode(node_names[i], i);
        node_map[i] = nodes[i];
    }

    // Build parent-child relationships
    for (int i = 0; i < node_count; i++) {
        int parent_id = parent_ids[i];

        if (parent_id == -1) {
            root = nodes[i];
        } else {
            nodes[i]->parent = nodes[parent_id];
            nodes[parent_id]->addChild(nodes[i]);
        }
    }
}

TreeNode* NaryTreeLock::getNode(int node_id) {
    auto it = node_map.find(node_id);
    if (it != node_map.end()) {
        return it->second;
    }
    return nullptr;
}

bool NaryTreeLock::isLocked(int node_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;
    return node->locked_by.load() != -1;
}

int NaryTreeLock::getLockedBy(int node_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return -1;
    return node->locked_by.load();
}

/**
 * Check if any ancestor is locked
 * Time Complexity: O(log N) - traverses to root
 */
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

/**
 * Update locked descendant count for all ancestors
 * Time Complexity: O(log N) - traverses to root
 */
void NaryTreeLock::updateAncestorCount(TreeNode* node, int delta) {
    TreeNode* curr = node->parent;

    while (curr != nullptr) {
        curr->locked_descendant_count.fetch_add(delta);
        curr = curr->parent;
    }
}

/**
 * Lock a node
 * Time Complexity: O(log N)
 *
 * Algorithm:
 * 1. Check if node is already locked - O(1)
 * 2. Check if any descendant is locked - O(1) using counter
 * 3. Check if any ancestor is locked - O(log N) traverse to root
 * 4. Lock node and update ancestor counts - O(log N)
 */
bool NaryTreeLock::lock(int node_id, int user_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;

    // Check if already locked
    int expected = -1;
    if (!node->locked_by.compare_exchange_strong(expected, user_id)) {
        // Node is already locked (by someone)
        return false;
    }

    // Check if any descendant is locked
    if (node->locked_descendant_count.load() > 0) {
        // Unlock and return false
        node->locked_by.store(-1);
        return false;
    }

    // Check if any ancestor is locked
    if (hasLockedAncestor(node)) {
        // Unlock and return false
        node->locked_by.store(-1);
        return false;
    }

    // Successfully locked - update ancestor counts
    updateAncestorCount(node, 1);

    return true;
}

/**
 * Unlock a node
 * Time Complexity: O(log N)
 *
 * Algorithm:
 * 1. Verify node is locked by this user - O(1)
 * 2. Unlock node - O(1)
 * 3. Update ancestor counts - O(log N)
 */
bool NaryTreeLock::unlock(int node_id, int user_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;

    // Check if locked by this user
    int expected = user_id;
    if (!node->locked_by.compare_exchange_strong(expected, -1)) {
        // Node is not locked by this user
        return false;
    }

    // Update ancestor counts
    updateAncestorCount(node, -1);

    return true;
}

/**
 * Upgrade lock: Lock node and unlock all locked descendants
 * Time Complexity: O(M + log N) where M is number of locked descendants
 *
 * Algorithm:
 * 1. Check if node can be locked (not already locked, no ancestor locked)
 * 2. Check if at least one descendant is locked
 * 3. Check if all locked descendants belong to this user
 * 4. Unlock all locked descendants
 * 5. Lock the current node
 */
bool NaryTreeLock::upgradeLock(int node_id, int user_id) {
    TreeNode* node = getNode(node_id);
    if (!node) return false;

    // Check if node is already locked
    if (node->locked_by.load() != -1) {
        return false;
    }

    // Check if any ancestor is locked
    if (hasLockedAncestor(node)) {
        return false;
    }

    // Check if there are locked descendants
    int locked_desc_count = node->locked_descendant_count.load();
    if (locked_desc_count == 0) {
        return false;  // No descendants to upgrade
    }

    // Find all locked descendants using BFS
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

            // Continue BFS even if child is locked (might have locked descendants)
            q.push(child);
        }
    }

    // Verify all locked descendants belong to this user
    if ((int)locked_descendants.size() != locked_desc_count) {
        return false;  // Some descendants locked by other users
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
}

void NaryTreeLock::printTree() {
    if (!root) {
        std::cout << "Tree is empty" << std::endl;
        return;
    }
    std::cout << "\n=== Tree Structure ===" << std::endl;
    printTreeHelper(root, 0);
    std::cout << "=====================\n" << std::endl;
}

void NaryTreeLock::printTreeHelper(TreeNode* node, int depth) {
    if (!node) return;

    // Print indentation
    for (int i = 0; i < depth; i++) {
        std::cout << "  ";
    }

    // Print node info
    std::cout << node->name << " (ID: " << node->id << ")";

    int locked = node->locked_by.load();
    if (locked != -1) {
        std::cout << " [LOCKED by User " << locked << "]";
    }

    int desc_count = node->locked_descendant_count.load();
    if (desc_count > 0) {
        std::cout << " [" << desc_count << " locked descendants]";
    }

    std::cout << std::endl;

    // Print children
    for (TreeNode* child : node->children) {
        printTreeHelper(child, depth + 1);
    }
}
