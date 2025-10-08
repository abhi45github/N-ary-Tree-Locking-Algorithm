#include "nary_tree_lock.h"
#include <iostream>
#include <thread>
#include <vector>
#include <chrono>
#include <cassert>

using namespace std;

// ANSI Color codes for better output
#define GREEN "\033[32m"
#define RED "\033[31m"
#define YELLOW "\033[33m"
#define BLUE "\033[34m"
#define RESET "\033[0m"

void printTestResult(const string& test_name, bool passed) {
    if (passed) {
        cout << GREEN << "[PASS] " << RESET << test_name << endl;
    } else {
        cout << RED << "[FAIL] " << RESET << test_name << endl;
    }
}

void printTestHeader(const string& header) {
    cout << "\n" << BLUE << "=== " << header << " ===" << RESET << endl;
}

/**
 * Test Case 1: Basic Lock/Unlock Operations
 */
void testBasicLockUnlock() {
    printTestHeader("Test 1: Basic Lock/Unlock");

    vector<string> names = {"Root", "Child1", "Child2", "GrandChild1"};
    vector<int> parents = {-1, 0, 0, 1};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Test basic lock
    bool result1 = tree.lock(1, 100);  // Lock Child1 by User 100
    printTestResult("Lock Child1", result1);
    assert(result1 == true);

    // Test lock same node again
    bool result2 = tree.lock(1, 200);  // Try to lock Child1 by User 200
    printTestResult("Lock Child1 again (should fail)", result2 == false);
    assert(result2 == false);

    // Test unlock by wrong user
    bool result3 = tree.unlock(1, 200);  // Try to unlock by User 200
    printTestResult("Unlock by wrong user (should fail)", result3 == false);
    assert(result3 == false);

    // Test unlock by correct user
    bool result4 = tree.unlock(1, 100);  // Unlock by User 100
    printTestResult("Unlock by correct user", result4);
    assert(result4 == true);

    // Test lock after unlock
    bool result5 = tree.lock(1, 200);  // Lock by User 200
    printTestResult("Lock after unlock", result5);
    assert(result5 == true);

    tree.unlock(1, 200);
}

/**
 * Test Case 2: Ancestor Lock Constraint
 */
void testAncestorConstraint() {
    printTestHeader("Test 2: Ancestor Lock Constraint");

    vector<string> names = {"Root", "Child1", "Child2", "GrandChild1"};
    vector<int> parents = {-1, 0, 0, 1};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Lock parent
    bool result1 = tree.lock(0, 100);  // Lock Root
    printTestResult("Lock Root", result1);
    assert(result1 == true);

    // Try to lock child (should fail)
    bool result2 = tree.lock(1, 200);  // Try to lock Child1
    printTestResult("Lock Child1 with locked ancestor (should fail)", result2 == false);
    assert(result2 == false);

    // Try to lock grandchild (should fail)
    bool result3 = tree.lock(3, 200);  // Try to lock GrandChild1
    printTestResult("Lock GrandChild1 with locked ancestor (should fail)", result3 == false);
    assert(result3 == false);

    // Unlock root
    tree.unlock(0, 100);

    // Now child should be lockable
    bool result4 = tree.lock(1, 200);  // Lock Child1
    printTestResult("Lock Child1 after ancestor unlock", result4);
    assert(result4 == true);

    tree.unlock(1, 200);
}

/**
 * Test Case 3: Descendant Lock Constraint
 */
void testDescendantConstraint() {
    printTestHeader("Test 3: Descendant Lock Constraint");

    vector<string> names = {"Root", "Child1", "Child2", "GrandChild1"};
    vector<int> parents = {-1, 0, 0, 1};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Lock grandchild
    bool result1 = tree.lock(3, 100);  // Lock GrandChild1
    printTestResult("Lock GrandChild1", result1);
    assert(result1 == true);

    // Try to lock ancestor (should fail)
    bool result2 = tree.lock(1, 200);  // Try to lock Child1
    printTestResult("Lock Child1 with locked descendant (should fail)", result2 == false);
    assert(result2 == false);

    // Try to lock root (should fail)
    bool result3 = tree.lock(0, 200);  // Try to lock Root
    printTestResult("Lock Root with locked descendant (should fail)", result3 == false);
    assert(result3 == false);

    // Unlock grandchild
    tree.unlock(3, 100);

    // Now ancestor should be lockable
    bool result4 = tree.lock(1, 200);  // Lock Child1
    printTestResult("Lock Child1 after descendant unlock", result4);
    assert(result4 == true);

    tree.unlock(1, 200);
}

/**
 * Test Case 4: Sibling Locks (Independent)
 */
void testSiblingLocks() {
    printTestHeader("Test 4: Sibling Locks (Independent)");

    vector<string> names = {"Root", "Child1", "Child2", "GrandChild1", "GrandChild2"};
    vector<int> parents = {-1, 0, 0, 1, 2};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Lock Child1
    bool result1 = tree.lock(1, 100);
    printTestResult("Lock Child1", result1);
    assert(result1 == true);

    // Lock Child2 (sibling, should succeed)
    bool result2 = tree.lock(2, 200);
    printTestResult("Lock Child2 (sibling)", result2);
    assert(result2 == true);

    // Lock GrandChild2 (under locked parent, should fail)
    bool result3 = tree.lock(4, 300);
    printTestResult("Lock GrandChild2 under locked parent (should fail)", result3 == false);
    assert(result3 == false);

    tree.unlock(1, 100);
    tree.unlock(2, 200);
}

/**
 * Test Case 5: Upgrade Lock Operation
 */
void testUpgradeLock() {
    printTestHeader("Test 5: Upgrade Lock Operation");

    vector<string> names = {"Root", "Child1", "Child2", "GrandChild1", "GrandChild2", "GrandChild3"};
    vector<int> parents = {-1, 0, 0, 1, 1, 1};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Lock all grandchildren under Child1
    bool result1 = tree.lock(3, 100);  // GrandChild1 by User 100
    bool result2 = tree.lock(4, 100);  // GrandChild2 by User 100
    bool result3 = tree.lock(5, 100);  // GrandChild3 by User 100

    printTestResult("Lock GrandChild1", result1);
    printTestResult("Lock GrandChild2", result2);
    printTestResult("Lock GrandChild3", result3);
    assert(result1 && result2 && result3);

    // Upgrade lock on Child1
    bool result4 = tree.upgradeLock(1, 100);
    printTestResult("Upgrade lock on Child1", result4);
    assert(result4 == true);

    // Verify Child1 is now locked
    assert(tree.isLocked(1));
    printTestResult("Child1 is locked after upgrade", tree.isLocked(1));

    // Verify grandchildren are unlocked
    bool all_unlocked = !tree.isLocked(3) && !tree.isLocked(4) && !tree.isLocked(5);
    printTestResult("All grandchildren unlocked after upgrade", all_unlocked);
    assert(all_unlocked);

    tree.unlock(1, 100);
}

/**
 * Test Case 6: Upgrade Lock with Different Users (should fail)
 */
void testUpgradeLockDifferentUsers() {
    printTestHeader("Test 6: Upgrade Lock with Different Users");

    vector<string> names = {"Root", "Child1", "Child2", "GrandChild1", "GrandChild2"};
    vector<int> parents = {-1, 0, 0, 1, 1};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Lock grandchildren by different users
    tree.lock(3, 100);  // GrandChild1 by User 100
    tree.lock(4, 200);  // GrandChild2 by User 200

    // Try to upgrade (should fail because not all locked by same user)
    bool result = tree.upgradeLock(1, 100);
    printTestResult("Upgrade with mixed user locks (should fail)", result == false);
    assert(result == false);

    tree.unlock(3, 100);
    tree.unlock(4, 200);
}

/**
 * Test Case 7: Multithreading Test
 */
void testMultithreading() {
    printTestHeader("Test 7: Multithreading Stress Test");

    vector<string> names = {"Root", "C1", "C2", "C3", "GC1", "GC2", "GC3", "GC4"};
    vector<int> parents = {-1, 0, 0, 0, 1, 1, 2, 2};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    atomic<int> success_count(0);
    atomic<int> total_operations(0);

    auto thread_func = [&](int thread_id, int node_id) {
        for (int i = 0; i < 100; i++) {
            if (tree.lock(node_id, thread_id)) {
                success_count++;
                this_thread::sleep_for(chrono::microseconds(10));
                tree.unlock(node_id, thread_id);
            }
            total_operations++;
        }
    };

    // Launch multiple threads competing for different nodes
    vector<thread> threads;
    threads.push_back(thread(thread_func, 1, 1));  // Thread 1 -> C1
    threads.push_back(thread(thread_func, 2, 2));  // Thread 2 -> C2
    threads.push_back(thread(thread_func, 3, 3));  // Thread 3 -> C3
    threads.push_back(thread(thread_func, 4, 4));  // Thread 4 -> GC1

    for (auto& t : threads) {
        t.join();
    }

    cout << "Total operations: " << total_operations << endl;
    cout << "Successful locks: " << success_count << endl;
    cout << "Success rate: " << (100.0 * success_count / total_operations) << "%" << endl;

    printTestResult("Multithreading test completed", true);
}

/**
 * Test Case 8: Complex Tree Structure
 */
void testComplexTree() {
    printTestHeader("Test 8: Complex Tree Structure");

    // Create a larger tree
    vector<string> names;
    vector<int> parents;

    // Build a tree with 3 levels
    names.push_back("Root"); parents.push_back(-1);  // 0

    for (int i = 1; i <= 4; i++) {
        names.push_back("L1_" + to_string(i));
        parents.push_back(0);  // Children of root
    }

    for (int i = 5; i <= 12; i++) {
        names.push_back("L2_" + to_string(i));
        parents.push_back((i - 5) / 2 + 1);  // Grandchildren
    }

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Lock multiple nodes
    bool r1 = tree.lock(5, 100);   // L2_5
    bool r2 = tree.lock(7, 100);   // L2_7
    bool r3 = tree.lock(10, 200);  // L2_10

    printTestResult("Lock L2_5", r1);
    printTestResult("Lock L2_7", r2);
    printTestResult("Lock L2_10", r3);

    // Try to lock parent of L2_5 and L2_7
    bool r4 = tree.lock(1, 100);  // L1_1 (should fail, has locked descendants)
    printTestResult("Lock L1_1 with locked descendants (should fail)", r4 == false);
    assert(r4 == false);

    tree.unlock(5, 100);
    tree.unlock(7, 100);
    tree.unlock(10, 200);
}

/**
 * Test Case 9: Performance Test
 */
void testPerformance() {
    printTestHeader("Test 9: Performance Test (1000 nodes)");

    vector<string> names;
    vector<int> parents;

    // Create a deep tree: 1000 nodes
    for (int i = 0; i < 1000; i++) {
        names.push_back("Node_" + to_string(i));
        if (i == 0) {
            parents.push_back(-1);  // Root
        } else {
            parents.push_back((i - 1) / 4);  // 4-ary tree
        }
    }

    NaryTreeLock tree;
    auto start = chrono::high_resolution_clock::now();
    tree.buildTree(names, parents);
    auto end = chrono::high_resolution_clock::now();

    cout << "Tree build time: "
         << chrono::duration_cast<chrono::milliseconds>(end - start).count()
         << " ms" << endl;

    // Test lock/unlock performance
    start = chrono::high_resolution_clock::now();
    for (int i = 0; i < 1000; i++) {
        tree.lock(i, 1);
        tree.unlock(i, 1);
    }
    end = chrono::high_resolution_clock::now();

    cout << "1000 lock/unlock operations: "
         << chrono::duration_cast<chrono::milliseconds>(end - start).count()
         << " ms" << endl;

    printTestResult("Performance test completed", true);
}

/**
 * Test Case 10: Edge Cases
 */
void testEdgeCases() {
    printTestHeader("Test 10: Edge Cases");

    vector<string> names = {"Root", "Child1", "Child2"};
    vector<int> parents = {-1, 0, 0};

    NaryTreeLock tree;
    tree.buildTree(names, parents);

    // Test invalid node ID
    bool r1 = tree.lock(999, 100);
    printTestResult("Lock invalid node (should fail)", r1 == false);
    assert(r1 == false);

    // Test unlock non-locked node
    bool r2 = tree.unlock(1, 100);
    printTestResult("Unlock non-locked node (should fail)", r2 == false);
    assert(r2 == false);

    // Test upgrade on non-locked descendants
    bool r3 = tree.upgradeLock(0, 100);
    printTestResult("Upgrade with no locked descendants (should fail)", r3 == false);
    assert(r3 == false);
}

int main() {
    cout << YELLOW << "\n"
         << "================================================\n"
         << "  N-ary Tree Locking Algorithm Test Suite\n"
         << "  Optimized: O(log N) Time Complexity\n"
         << "  Thread-Safe: Atomic Operations\n"
         << "================================================\n"
         << RESET << endl;

    try {
        testBasicLockUnlock();
        testAncestorConstraint();
        testDescendantConstraint();
        testSiblingLocks();
        testUpgradeLock();
        testUpgradeLockDifferentUsers();
        testMultithreading();
        testComplexTree();
        testPerformance();
        testEdgeCases();

        cout << "\n" << GREEN << "=====================================" << endl;
        cout << "  All Tests Passed Successfully!" << endl;
        cout << "=====================================" << RESET << "\n" << endl;

    } catch (const exception& e) {
        cout << RED << "Test failed with exception: " << e.what() << RESET << endl;
        return 1;
    }

    return 0;
}
